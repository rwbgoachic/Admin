import { cn } from '../../../ui/utils/cn';
import { Button } from '../../../ui/components/button';
import { Clock, AlertTriangle } from 'lucide-react';

interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber: string | number;
  items: {
    name: string;
    quantity: number;
    notes?: string;
    allergies?: string[];
  }[];
  priority: 'normal' | 'rush' | 'vip';
  status: 'pending' | 'preparing' | 'ready';
  orderedAt: Date;
  estimatedTime?: number;
}

interface KitchenDisplayProps {
  orders: KitchenOrder[];
  onStatusChange: (orderId: string, status: 'pending' | 'preparing' | 'ready') => void;
  className?: string;
}

export function KitchenDisplay({
  orders,
  onStatusChange,
  className,
}: KitchenDisplayProps) {
  const sortedOrders = [...orders].sort((a, b) => {
    // Sort by priority first
    const priorityOrder = { vip: 0, rush: 1, normal: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Then by order time
    return new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime();
  });

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {sortedOrders.map((order) => (
        <div
          key={order.id}
          className={cn(
            'bg-white rounded-lg shadow-md p-4 border-l-4',
            {
              'border-red-500': order.priority === 'rush',
              'border-purple-500': order.priority === 'vip',
              'border-blue-500': order.priority === 'normal',
            }
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium">Order #{order.orderNumber}</h3>
              <p className="text-sm text-gray-500">Table {order.tableNumber}</p>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">
                {new Date(order.orderedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{item.quantity}x</span>
                  <span className="ml-2">{item.name}</span>
                  {item.notes && (
                    <p className="text-sm text-gray-500 ml-6">{item.notes}</p>
                  )}
                  {item.allergies && item.allergies.length > 0 && (
                    <div className="flex items-center ml-6 mt-1">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-500">
                        {item.allergies.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {order.estimatedTime && (
            <div className="mt-4 text-sm text-gray-500">
              Est. time: {order.estimatedTime} min
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <span className={cn(
              'px-2 py-1 text-sm font-medium rounded-full',
              {
                'bg-yellow-100 text-yellow-800': order.status === 'pending',
                'bg-blue-100 text-blue-800': order.status === 'preparing',
                'bg-green-100 text-green-800': order.status === 'ready',
              }
            )}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <Button
              onClick={() => {
                const nextStatus = {
                  pending: 'preparing',
                  preparing: 'ready',
                }[order.status] as 'preparing' | 'ready';
                onStatusChange(order.id, nextStatus);
              }}
              disabled={order.status === 'ready'}
            >
              Mark as {
                {
                  pending: 'Preparing',
                  preparing: 'Ready',
                  ready: 'Completed',
                }[order.status]
              }
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}