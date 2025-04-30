import { type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TouchFriendlyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function TouchFriendlyButton({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: TouchFriendlyButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
          'px-3 py-1.5 text-sm min-w-[64px]': size === 'sm',
          'px-4 py-2 text-base min-w-[96px]': size === 'md',
          'px-6 py-3 text-lg min-w-[128px]': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}