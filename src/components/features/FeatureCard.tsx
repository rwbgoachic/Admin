import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconType;
}

export default function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="bg-white border-2 border-primary-600 p-6 transition-all duration-300 hover:bg-primary-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-primary-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <Link
            to="/auth/register"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
          >
            Get Started
            <svg 
              className="ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}