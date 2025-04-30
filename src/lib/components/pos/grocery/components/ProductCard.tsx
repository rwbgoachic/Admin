import { cn } from '../../../ui/utils/cn';
import { formatCurrency } from '../../../ui/utils/format';
import { Button } from '../../../ui/components/button';

interface ProductCardProps {
  name: string;
  price: number;
  unit?: string;
  image?: string;
  onAdd?: () => void;
  className?: string;
}

export function ProductCard({
  name,
  price,
  unit,
  image,
  onAdd,
  className,
}: ProductCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md overflow-hidden',
      className
    )}>
      {image && (
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(price)}
            </span>
            {unit && (
              <span className="ml-1 text-sm text-gray-500">
                / {unit}
              </span>
            )}
          </div>
          <Button
            onClick={onAdd}
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}