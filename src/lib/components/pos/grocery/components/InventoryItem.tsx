import { cn } from '../../../ui/utils/cn';
import { formatCurrency } from '../../../ui/utils/format';
import { Button } from '../../../ui/components/button';
import { AlertTriangle } from 'lucide-react';

interface InventoryItemProps {
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  price: number;
  costPrice: number;
  reorderPoint: number;
  location?: string;
  expiryDate?: Date;
  onReorder?: () => void;
  className?: string;
}

export function InventoryItem({
  name,
  sku,
  quantity,
  unit,
  price,
  costPrice,
  reorderPoint,
  location,
  expiryDate,
  onReorder,
  className,
}: InventoryItemProps) {
  const isLowStock = quantity <= reorderPoint;
  const margin = ((price - costPrice) / price) * 100;
  const isExpiringSoon = expiryDate && new Date(expiryDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md p-4',
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">SKU: {sku}</p>
        </div>
        {isLowStock && (
          <div className="flex items-center text-amber-600">
            <AlertTriangle className="h-5 w-5 mr-1" />
            <span className="text-sm">Low Stock</span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Quantity</p>
          <p className="text-lg font-medium">
            {quantity} {unit}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-lg font-medium">{formatCurrency(price)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cost</p>
          <p className="text-lg font-medium">{formatCurrency(costPrice)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Margin</p>
          <p className="text-lg font-medium">{margin.toFixed(1)}%</p>
        </div>
      </div>

      {location && (
        <p className="mt-4 text-sm text-gray-500">
          Location: {location}
        </p>
      )}

      {expiryDate && (
        <p className={cn(
          'mt-2 text-sm',
          isExpiringSoon ? 'text-red-600' : 'text-gray-500'
        )}>
          Expires: {new Date(expiryDate).toLocaleDateString()}
        </p>
      )}

      {isLowStock && onReorder && (
        <div className="mt-4">
          <Button
            onClick={onReorder}
            className="w-full"
          >
            Reorder Stock
          </Button>
        </div>
      )}
    </div>
  );
}