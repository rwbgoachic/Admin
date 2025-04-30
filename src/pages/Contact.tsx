import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNotification } from '../contexts/NotificationContext';

const supportOptions = [
  {
    name: 'Email Support',
    description: 'Get help via email within 24 hours',
    icon: EnvelopeIcon,
    email: 'support@paysurity.com',
  },
  {
    name: 'Phone Support',
    description: 'Talk to our support team directly',
    icon: PhoneIcon,
    phone: '+1 (888) 123-4567',
  },
  {
    name: 'Live Chat',
    description: 'Chat with our support team in real-time',
    icon: ChatBubbleLeftIcon,
    availability: '24/7',
  },
];

const faqs = [
  {
    question: 'How long does it take to get approved?',
    answer: 'Most applications are reviewed and approved within 1-2 business days. Complex cases may take up to 5 business days.',
  },
  {
    question: 'What are your transaction fees?',
    answer: 'Our transaction fees start at 2.9% + $0.30 per transaction. Volume discounts are available for businesses processing over $50,000 per month.',
  },
  {
    question: 'How do payouts work?',
    answer: 'Payouts are processed automatically on a weekly basis. You can also set up daily or monthly payouts in your dashboard settings.',
  },
  {
    question: 'What payment methods do you support?',
    answer: 'We support all major credit cards (Visa, Mastercard, American Express, Discover), ACH transfers, and digital wallets like Apple Pay and Google Pay.',
  },
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      subject: Yup.string().required('Required'),
      message: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSubmitting(true);
        // In a real application, you would send this to your backend
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        showSuccess('Message sent successfully! We\'ll get back to you soon.');
        resetForm();
      } catch (error) {
        showError('Failed to send message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Support</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Need help? Our support team is here to assist you 24/7. Choose your preferred way to reach us.
          </p>
        </div>

        {/* Support Options */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {supportOptions.map((option) => (
              <div key={option.name} className="flex flex-col items-center text-center">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <option.icon className="h-8 w-8 flex-none text-primary-600" aria-hidden="true" />
                  {option.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{option.description}</p>
                  {option.email && (
                    <p className="mt-2">
                      <a href={`mailto:${option.email}`} className="text-primary-600 hover:text-primary-500">
                        {option.email}
                      </a>
                    </p>
                  )}
                  {option.phone && (
                    <p className="mt-2">
                      <a href={`tel:${option.phone}`} className="text-primary-600 hover:text-primary-500">
                        {option.phone}
                      </a>
                    </p>
                  )}
                  {option.availability && (
                    <p className="mt-2 text-sm text-gray-500">Available {option.availability}</p>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Contact Form */}
        <div className="mx-auto mt-16 max-w-2xl bg-white sm:mt-20 lg:mt-24">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                {...formik.getFieldProps('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...formik.getFieldProps('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                {...formik.getFieldProps('subject')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.subject}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                {...formik.getFieldProps('message')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {formik.touched.message && formik.errors.message && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        {/* FAQs */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Frequently Asked Questions</h3>
          <dl className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <dt className="text-lg font-semibold leading-7 text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}