import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import FeatureCard from '../components/features/FeatureCard';
import { featureCards } from '../data/features';

const testimonials = [
  {
    content: "PaySurity transformed our business. We've seen a 40% increase in online sales since switching.",
    author: "Sarah Johnson",
    role: "CEO, Fashion Boutique",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    content: "The easiest payment system we've ever used. Their customer support is outstanding.",
    author: "Michael Chen",
    role: "Owner, Restaurant Chain",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.pexels.com/photos/8353841/pexels-photo-8353841.jpeg?auto=compress&cs=tinysrgb&w=1920"
          >
            <source
              src="https://player.vimeo.com/progressive_redirect/playback/814789574/rendition/1080p/file.mp4?loc=external"
              type="video/mp4"
            />
          </video>
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Accept payments anywhere, anytime
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Transform your business with our secure, reliable, and easy-to-use payment processing solution. Join thousands of businesses already growing with PaySurity.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/auth/register"
                className="bg-primary-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get Started
              </Link>
              <Link
                to="/pricing"
                className="text-base font-semibold leading-6 text-white flex items-center"
              >
                View Pricing <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to grow your business
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Comprehensive payment solutions designed to help your business thrive
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.slice(0, 8).map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by businesses worldwide
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mt-20 lg:max-w-none lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="flex flex-col gap-y-6 bg-white p-8 shadow-sm">
                <p className="text-lg leading-8 text-gray-600">"{testimonial.content}"</p>
                <div className="flex items-center gap-x-4">
                  <img
                    className="h-12 w-12 bg-gray-50"
                    src={testimonial.image}
                    alt={testimonial.author}
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm leading-6 text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to grow your business?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Join thousands of businesses already using PaySurity to process millions in payments.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/auth/register"
                className="bg-white px-5 py-3 text-base font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="text-base font-semibold leading-6 text-white"
              >
                Contact Sales <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}