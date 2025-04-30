import { cn } from '../../../ui/utils/cn';
import { formatCurrency } from '../../../ui/utils/format';

interface PriceTagProps {
  price: number;
  comparePrice?: number;
  unit?: string;
  saleEnds?: Date;
  className?: string;
}

export function PriceTag({
  price,
  comparePrice,
  unit,
  saleEnds,
  className,
}: PriceTagProps) {
  const isOnSale = comparePrice && comparePrice > price;
  const discount = isOnSale
    ? ((comparePrice - price) / comparePrice) * 100
    : 0;

  return (
    <div className={cn(
      'inline-flex flex-col items-start',
      className
    )}>
      <div className="flex items-center space-x-2">
        <span className={cn(
          'text-2xl font-bold',
          isOnSale ? 'text-red-600' : 'text-gray-900'
        )}>
          {formatCurrency(price)}
        </span>
        {unit && (
          <span className="text-sm text-gray-500">
            / {unit}
          </span>
        )}
      </div>

      {isOnSale && (
        <>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(comparePrice)}
            </span>
            <span className="text-sm font-medium text-red-600">
              Save {discount.toFixed(0)}%
            </span>
          </div>
          {saleEnds && (
            <p className="text-sm text-gray-500 mt-1">
              Sale ends {new Date(saleEnds).toLocaleDateString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}