import { cn } from '../../../ui/utils/cn';
import { TableStatus } from './TableStatus';

interface Table {
  id: string;
  number: string | number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  occupiedSince?: Date;
  reservedFor?: Date;
}

interface TableGridProps {
  tables: Table[];
  onTableSelect?: (tableId: string) => void;
  className?: string;
}

export function TableGrid({
  tables,
  onTableSelect,
  className,
}: TableGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4',
      className
    )}>
      {tables.map((table) => (
        <div
          key={table.id}
          onClick={() => onTableSelect?.(table.id)}
          className={cn(
            'cursor-pointer transition-transform hover:scale-105',
            'transform-gpu'
          )}
        >
          <TableStatus
            status={table.status}
            tableNumber={table.number}
            seats={table.seats}
            occupiedSince={table.occupiedSince}
            reservedFor={table.reservedFor}
          />
        </div>
      ))}
    </div>
  );
}