import { useState } from 'react';
import { cn } from '../../../ui/utils/cn';
import { Input } from '../../../ui/components/input';
import { Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  unit?: string;
  category?: string;
}

interface QuickProductSearchProps {
  onSelect: (product: Product) => void;
  products: Product[];
  className?: string;
}

export function QuickProductSearch({
  onSelect,
  products,
  className,
}: QuickProductSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category?.toLowerCase().includes(query.toLowerCase())
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredProducts[selectedIndex]) {
          onSelect(filteredProducts[selectedIndex]);
          setQuery('');
        }
        break;
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedIndex(0);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        icon={<Search className="h-4 w-4 text-gray-400" />}
      />

      {query && filteredProducts.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => {
                onSelect(product);
                setQuery('');
              }}
              className={cn(
                'px-4 py-2 cursor-pointer',
                index === selectedIndex
                  ? 'bg-blue-50 text-blue-900'
                  : 'hover:bg-gray-50'
              )}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                  {product.unit && ` / ${product.unit}`}
                </span>
              </div>
              {product.category && (
                <span className="text-sm text-gray-500">
                  {product.category}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}