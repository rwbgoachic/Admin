import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', country: 'US' },
  { code: 'es', name: 'Spanish', country: 'ES' },
  { code: 'fr', name: 'French', country: 'FR' },
  { code: 'de', name: 'German', country: 'DE' },
  { code: 'it', name: 'Italian', country: 'IT' },
] as const;

type Language = typeof languages[number];

export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language['code']>('en');

  function formatCountryCode(code: string) {
    // Keep country codes like US, UK in uppercase, others in title case
    return ['us', 'uk'].includes(code.toLowerCase()) 
      ? code.toUpperCase() 
      : code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
  }

  return (
    <div className="relative">
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value as Language['code'])}
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[44px]"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name} ({formatCountryCode(language.country)})
          </option>
        ))}
      </select>
    </div>
  );
}