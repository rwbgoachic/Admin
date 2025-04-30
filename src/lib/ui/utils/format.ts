import { format as dateFnsFormat } from 'date-fns';

export function formatDate(date: Date | string, formatStr = 'PPpp'): string {
  return dateFnsFormat(new Date(date), formatStr);
}

export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatNumber(
  number: number,
  options?: Intl.NumberFormatOptions,
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumber;
}