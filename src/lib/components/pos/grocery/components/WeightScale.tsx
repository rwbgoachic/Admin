import { useState, useEffect } from 'react';
import { cn } from '../../../ui/utils/cn';
import { Button } from '../../../ui/components/button';
import { Scale, RefreshCw } from 'lucide-react';

interface WeightScaleProps {
  onWeightChange: (weight: number) => void;
  unit?: 'kg' | 'lb' | 'oz';
  className?: string;
}

export function WeightScale({
  onWeightChange,
  unit = 'kg',
  className,
}: WeightScaleProps) {
  const [weight, setWeight] = useState<number | null>(null);
  const [isStable, setIsStable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate scale connection and reading
  useEffect(() => {
    setIsConnected(true);
    
    // Simulate weight fluctuation
    const interval = setInterval(() => {
      if (weight === null) {
        const initialWeight = 0.5 + Math.random() * 0.1;
        setWeight(initialWeight);
        setIsStable(false);
      } else {
        const fluctuation = (Math.random() - 0.5) * 0.01;
        const newWeight = Math.max(0, weight + fluctuation);
        setWeight(newWeight);
        setIsStable(Math.abs(fluctuation) < 0.005);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  useEffect(() => {
    if (isStable && weight !== null) {
      onWeightChange(weight);
    }
  }, [isStable, weight, onWeightChange]);

  function handleTare() {
    setWeight(0);
    setIsStable(false);
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-md p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Scale className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium">Digital Scale</h3>
        </div>
        <span className={cn(
          'px-2 py-1 text-sm font-medium rounded-full',
          isConnected
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        )}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="text-center py-6">
        <div className="text-4xl font-bold font-mono">
          {weight === null ? '---' : weight.toFixed(3)}
          <span className="text-2xl text-gray-500 ml-2">{unit}</span>
        </div>
        <div className="mt-2">
          <span className={cn(
            'text-sm font-medium',
            isStable ? 'text-green-600' : 'text-amber-600'
          )}>
            {isStable ? 'Stable' : 'Unstable'}
          </span>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleTare}
          variant="secondary"
          className="inline-flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tare
        </Button>
      </div>
    </div>
  );
}