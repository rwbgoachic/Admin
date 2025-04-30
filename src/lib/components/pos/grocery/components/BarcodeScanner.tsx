import { useState, useEffect } from 'react';
import { cn } from '../../../ui/utils/cn';
import { Button } from '../../../ui/components/button';
import { Input } from '../../../ui/components/input';
import { Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onManualEntry?: (barcode: string) => void;
  className?: string;
}

export function BarcodeScanner({
  onScan,
  onManualEntry,
  className,
}: BarcodeScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    function handleKeyPress(e: KeyboardEvent) {
      if (!isScanning) return;

      // Simulate barcode scanner input
      if (e.key === 'Enter') {
        onScan(manualCode);
        setManualCode('');
      } else if (e.key.length === 1) {
        setManualCode(prev => prev + e.key);
        
        // Reset after delay (typical for barcode scanners)
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          setManualCode('');
        }, 100);
      }
    }

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeoutId);
    };
  }, [isScanning, manualCode, onScan]);

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    onManualEntry?.(manualCode);
    setManualCode('');
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setIsScanning(!isScanning)}
          className="inline-flex items-center"
        >
          {isScanning ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Stop Scanning
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </>
          )}
        </Button>
        {isScanning && (
          <span className="text-sm text-green-600 animate-pulse">
            Ready to scan...
          </span>
        )}
      </div>

      <form onSubmit={handleManualSubmit} className="flex space-x-2">
        <Input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Enter barcode manually..."
          className="flex-1"
        />
        <Button type="submit">
          Enter
        </Button>
      </form>
    </div>
  );
}