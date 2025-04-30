import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface TouchFriendlyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
}

export const TouchFriendlyInput = forwardRef<HTMLInputElement, TouchFriendlyInputProps>(
  ({ className, label, error, icon, multiline, ...props }, ref) => {
    const inputClasses = clsx(
      'block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
      'min-h-[44px]',
      icon && 'pl-10',
      error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          {multiline ? (
            <textarea
              className={inputClasses}
              rows={4}
              {...(props as any)}
            />
          ) : (
            <input
              ref={ref}
              className={inputClasses}
              {...props}
            />
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

TouchFriendlyInput.displayName = 'TouchFriendlyInput';