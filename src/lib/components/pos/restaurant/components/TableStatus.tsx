import { cn } from '../../../ui/utils/cn';

type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

interface TableStatusProps {
  status: TableStatus;
  tableNumber: string | number;
  seats: number;
  occupiedSince?: Date;
  reservedFor?: Date;
  className?: string;
}

export function TableStatus({
  status,
  tableNumber,
  seats,
  occupiedSince,
  reservedFor,
  className,
}: TableStatusProps) {
  return (
    <div className={cn(
      'p-4 rounded-lg',
      {
        'bg-green-100 border-green-200': status === 'available',
        'bg-red-100 border-red-200': status === 'occupied',
        'bg-yellow-100 border-yellow-200': status === 'reserved',
        'bg-gray-100 border-gray-200': status === 'cleaning',
      },
      'border-2',
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Table {tableNumber}</span>
        <span className="text-sm">{seats} seats</span>
      </div>

      <div className="mt-2">
        <span className={cn(
          'inline-block px-2 py-1 rounded-full text-sm font-medium',
          {
            'bg-green-200 text-green-800': status === 'available',
            'bg-red-200 text-red-800': status === 'occupied',
            'bg-yellow-200 text-yellow-800': status === 'reserved',
            'bg-gray-200 text-gray-800': status === 'cleaning',
          }
        )}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {occupiedSince && status === 'occupied' && (
        <p className="mt-2 text-sm text-gray-600">
          Occupied since: {occupiedSince.toLocaleTimeString()}
        </p>
      )}

      {reservedFor && status === 'reserved' && (
        <p className="mt-2 text-sm text-gray-600">
          Reserved for: {reservedFor.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}