import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { CodeBracketIcon, CreditCardIcon, CubeIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  {
    name: 'Quick Start',
    icon: CreditCardIcon,
    content: {
      title: 'Get Started with PaySurity',
      description: 'Follow these steps to start accepting payments in minutes.',
      steps: [
        {
          title: '1. Create an Account',
          content: 'Sign up for a PaySurity account and complete the verification process.',
        },
        {
          title: '2. Install the SDK',
          content: 'Install our SDK using npm or yarn:',
          code: 'npm install @paysurity/js',
        },
        {
          title: '3. Initialize the Client',
          content: 'Initialize the PaySurity client with your API key:',
          code: `import { PaySurity } from '@paysurity/js';

const client = new PaySurity({
  apiKey: 'your_api_key',
  environment: 'production' // or 'sandbox' for testing
});`,
        },
        {
          title: '4. Accept Your First Payment',
          content: 'Create a payment intent and process your first transaction:',
          code: `// Create a payment intent
const paymentIntent = await client.createPaymentIntent({
  amount: 1000, // Amount in cents
  currency: 'usd'
});

// Process the payment
const result = await client.processPayment(paymentIntent.id, {
  cardNumber: '4242424242424242',
  expMonth: 12,
  expYear: 2025,
  cvc: '123'
});`,
        },
      ],
    },
  },
  {
    name: 'API Reference',
    icon: CodeBracketIcon,
    content: {
      title: 'API Documentation',
      description: 'Complete reference for the PaySurity API.',
      endpoints: [
        {
          method: 'POST',
          path: '/v1/payment_intents',
          description: 'Create a new payment intent',
          example: `curl -X POST https://api.paysurity.com/v1/payment_intents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d amount=1000 \\
  -d currency=usd`,
        },
        {
          method: 'POST',
          path: '/v1/payments',
          description: 'Process a payment',
          example: `curl -X POST https://api.paysurity.com/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d payment_intent=pi_123456789 \\
  -d payment_method=pm_card_visa`,
        },
        {
          method: 'GET',
          path: '/v1/payments/{id}',
          description: 'Retrieve payment details',
          example: `curl https://api.paysurity.com/v1/payments/py_123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        },
      ],
    },
  },
  {
    name: 'SDKs & Libraries',
    icon: CubeIcon,
    content: {
      title: 'Official SDKs',
      description: 'Use our official SDKs to integrate PaySurity into your application.',
      sdks: [
        {
          language: 'JavaScript',
          installation: 'npm install @paysurity/js',
          example: `import { PaySurity } from '@paysurity/js';

const client = new PaySurity({ apiKey: 'your_api_key' });`,
        },
        {
          language: 'Python',
          installation: 'pip install paysurity',
          example: `import paysurity

client = paysurity.Client(api_key='your_api_key')`,
        },
        {
          language: 'PHP',
          installation: 'composer require paysurity/paysurity-php',
          example: `<?php
require_once('vendor/autoload.php');

$client = new \\PaySurity\\Client('your_api_key');`,
        },
      ],
    },
  },
];

export default function Documentation() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Documentation</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Learn how to integrate PaySurity
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Everything you need to know about integrating PaySurity into your application.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex space-x-1 rounded-xl bg-primary-100 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-primary-700 shadow'
                        : 'text-primary-600 hover:bg-white/[0.12] hover:text-primary-800'
                    )
                  }
                >
                  <div className="flex items-center justify-center space-x-2">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </div>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-8">
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <div className="space-y-8">
                    {tab.name === 'Quick Start' && (
                      <div className="space-y-8">
                        {tab.content.steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                            <p className="text-gray-600">{step.content}</p>
                            {step.code && (
                              <pre className="rounded-lg bg-gray-900 p-4">
                                <code className="text-sm text-white">{step.code}</code>
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {tab.name === 'API Reference' && (
                      <div className="space-y-8">
                        {tab.content.endpoints.map((endpoint, endpointIdx) => (
                          <div key={endpointIdx} className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <span className="rounded bg-primary-100 px-2 py-1 text-sm font-medium text-primary-700">
                                {endpoint.method}
                              </span>
                              <code className="text-sm text-gray-900">{endpoint.path}</code>
                            </div>
                            <p className="text-gray-600">{endpoint.description}</p>
                            <pre className="rounded-lg bg-gray-900 p-4">
                              <code className="text-sm text-white">{endpoint.example}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab.name === 'SDKs & Libraries' && (
                      <div className="space-y-8">
                        {tab.content.sdks.map((sdk, sdkIdx) => (
                          <div key={sdkIdx} className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">{sdk.language}</h3>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">Installation:</p>
                              <pre className="rounded-lg bg-gray-900 p-4">
                                <code className="text-sm text-white">{sdk.installation}</code>
                              </pre>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">Example usage:</p>
                              <pre className="rounded-lg bg-gray-900 p-4">
                                <code className="text-sm text-white">{sdk.example}</code>
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}