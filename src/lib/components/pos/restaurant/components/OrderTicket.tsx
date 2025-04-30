import { cn } from '../../../ui/utils/cn';
import { formatCurrency } from '../../../ui/utils/format';
import { Button } from '../../../ui/components/button';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface OrderTicketProps {
  orderNumber: string;
  items: OrderItem[];
  tableNumber: string | number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  createdAt: Date;
  onStatusChange?: (status: 'pending' | 'preparing' | 'ready' | 'served') => void;
  className?: string;
}

export function OrderTicket({
  orderNumber,
  items,
  tableNumber,
  status,
  createdAt,
  onStatusChange,
  className,
}: OrderTicketProps) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md p-4',
      className
    )}>
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div>
          <h3 className="text-lg font-medium">Order #{orderNumber}</h3>
          <p className="text-sm text-gray-500">Table {tableNumber}</p>
        </div>
        <span className={cn(
          'px-2 py-1 rounded-full text-sm font-medium',
          {
            'bg-yellow-100 text-yellow-800': status === 'pending',
            'bg-blue-100 text-blue-800': status === 'preparing',
            'bg-green-100 text-green-800': status === 'ready',
            'bg-gray-100 text-gray-800': status === 'served',
          }
        )}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <div>
              <span className="font-medium">{item.quantity}x</span>
              <span className="ml-2">{item.name}</span>
              {item.notes && (
                <p className="text-sm text-gray-500 ml-6">{item.notes}</p>
              )}
            </div>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total:</span>
          <span className="text-lg font-bold">{formatCurrency(total)}</span>
        </div>
      </div>

      {onStatusChange && status !== 'served' && (
        <div className="mt-4">
          <Button
            onClick={() => {
              const nextStatus = {
                pending: 'preparing',
                preparing: 'ready',
                ready: 'served',
              }[status] as 'preparing' | 'ready' | 'served';
              onStatusChange(nextStatus);
            }}
            className="w-full"
          >
            Mark as {
              {
                pending: 'Preparing',
                preparing: 'Ready',
                ready: 'Served',
              }[status]
            }
          </Button>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500">
        Created: {createdAt.toLocaleTimeString()}
      </p>
    </div>
  );
}