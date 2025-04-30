import { cn } from '../../../ui/utils/cn';

interface PromotionBannerProps {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'discount' | 'bogo' | 'bundle' | 'points';
  className?: string;
}

export function PromotionBanner({
  title,
  description,
  startDate,
  endDate,
  type,
  className,
}: PromotionBannerProps) {
  const isActive = new Date() >= startDate && new Date() <= endDate;
  const daysRemaining = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={cn(
      'rounded-lg p-4',
      {
        'bg-green-100 border-green-200': type === 'discount',
        'bg-blue-100 border-blue-200': type === 'bogo',
        'bg-purple-100 border-purple-200': type === 'bundle',
        'bg-yellow-100 border-yellow-200': type === 'points',
      },
      'border-2',
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="mt-1 text-sm">{description}</p>
          )}
        </div>
        {isActive && (
          <span className={cn(
            'px-2 py-1 text-sm font-medium rounded-full',
            {
              'bg-green-200 text-green-800': type === 'discount',
              'bg-blue-200 text-blue-800': type === 'bogo',
              'bg-purple-200 text-purple-800': type === 'bundle',
              'bg-yellow-200 text-yellow-800': type === 'points',
            }
          )}>
            Active
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span>
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </span>
        {isActive && daysRemaining > 0 && (
          <span className="font-medium">
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
          </span>
        )}
      </div>
    </div>
  );
}