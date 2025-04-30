import { cn } from '../../../ui/utils/cn';
import { formatCurrency } from '../../../ui/utils/format';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  modifiers?: {
    name: string;
    price: number;
  }[];
}

interface OrderSummaryProps {
  items: OrderItem[];
  tax?: number;
  serviceCharge?: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    label: string;
  };
  className?: string;
}

export function OrderSummary({
  items,
  tax = 0,
  serviceCharge = 0,
  discount,
  className,
}: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const modifiersTotal = item.modifiers?.reduce(
      (acc, mod) => acc + mod.price,
      0
    ) || 0;
    return sum + (itemTotal + modifiersTotal * item.quantity);
  }, 0);

  const discountAmount = discount
    ? discount.type === 'percentage'
      ? (subtotal * discount.value) / 100
      : discount.value
    : 0;

  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const serviceChargeAmount = ((subtotal - discountAmount) * serviceCharge) / 100;
  const total = subtotal - discountAmount + taxAmount + serviceChargeAmount;

  return (
    <div className={cn('bg-white rounded-lg shadow-md p-4', className)}>
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="ml-4 text-sm text-gray-500">
                {item.modifiers.map((mod, modIndex) => (
                  <div key={modIndex} className="flex justify-between">
                    <span>{mod.name}</span>
                    <span>{formatCurrency(mod.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {discount && (
          <div className="flex justify-between text-green-600">
            <span>{discount.label}</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        {tax > 0 && (
          <div className="flex justify-between">
            <span>Tax ({tax}%)</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
        )}

        {serviceCharge > 0 && (
          <div className="flex justify-between">
            <span>Service Charge ({serviceCharge}%)</span>
            <span>{formatCurrency(serviceChargeAmount)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}