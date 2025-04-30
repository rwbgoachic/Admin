import { CheckIcon } from '@heroicons/react/24/outline';

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/auth/register',
    priceMonthly: '$29',
    description: 'Perfect for small businesses just getting started.',
    features: [
      '2.9% + 30¢ per transaction',
      'Basic analytics dashboard',
      'Up to 1,000 transactions/month',
      'Email support',
      'Basic fraud protection',
      'Next-day payouts',
    ],
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '/auth/register',
    priceMonthly: '$59',
    description: 'Ideal for growing businesses with higher volume.',
    features: [
      '2.5% + 30¢ per transaction',
      'Advanced analytics and reporting',
      'Up to 10,000 transactions/month',
      'Priority email & chat support',
      'Advanced fraud protection',
      'Same-day payouts',
      'Custom payment forms',
    ],
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/auth/register',
    priceMonthly: 'Custom',
    description: 'Custom solutions for large organizations.',
    features: [
      'Custom pricing available',
      'Unlimited transactions',
      'Dedicated account manager',
      '24/7 phone & email support',
      'Enterprise-grade security',
      'Instant payouts',
      'Custom integration support',
      'API access',
    ],
  },
];

export default function Pricing() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for businesses of all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose the perfect plan for your business. All plans include our core features with different transaction limits and support levels.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                tierIdx === 1 ? 'lg:z-10 lg:rounded-b-none' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">{tier.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                  {tier.name !== 'Enterprise' && <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-primary-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={tier.href}
                className="mt-8 block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}