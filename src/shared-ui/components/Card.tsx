import { cn } from '../../lib/ui/utils/cn';

interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Card({ title, children, footer, className }: CardProps) {
  return (
    <div className={cn(
      'bg-card text-card-foreground rounded-lg border border-border shadow-sm',
      className
    )}>
      {title && (
        <div className="px-6 py-4 border-b border-border">
          {typeof title === 'string' ? (
            <h3 className="text-lg font-semibold">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-muted">
          {footer}
        </div>
      )}
    </div>
  );
}