import { cn } from '../../../ui/utils/cn';
import { formatCurrency } from '../../../ui/utils/format';
import { Button } from '../../../ui/components/button';
import { Flame } from 'lucide-react';

interface MenuItemCardProps {
  name: string;
  description?: string;
  price: number;
  image?: string;
  preparationTime?: number;
  spicyLevel?: 1 | 2 | 3;
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
  };
  onOrder?: () => void;
  className?: string;
}

export function MenuItemCard({
  name,
  description,
  price,
  image,
  preparationTime,
  spicyLevel,
  dietary,
  onOrder,
  className,
}: MenuItemCardProps) {
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
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          {spicyLevel && (
            <div className="flex">
              {[...Array(spicyLevel)].map((_, i) => (
                <Flame
                  key={i}
                  className="h-4 w-4 text-red-500"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {preparationTime && (
            <p className="text-sm text-gray-500">
              Preparation time: {preparationTime} min
            </p>
          )}

          {dietary && Object.keys(dietary).length > 0 && (
            <div className="flex gap-2">
              {dietary.vegetarian && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Vegetarian
                </span>
              )}
              {dietary.vegan && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Vegan
                </span>
              )}
              {dietary.glutenFree && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Gluten Free
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(price)}
          </span>
          <Button
            onClick={onOrder}
            size="sm"
          >
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
}