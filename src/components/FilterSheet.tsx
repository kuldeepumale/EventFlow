import { VendorCategory } from '../types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { categories } from '../data/mockData';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: VendorCategory | 'all';
  onCategoryChange: (category: VendorCategory | 'all') => void;
}

export function FilterSheet({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
}: FilterSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filter Vendors</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <h3 className="mb-4">Category</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id as VendorCategory | 'all');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-sm">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onCategoryChange('all')}
            >
              Reset
            </Button>
            <Button
              className="flex-1"
              onClick={onClose}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
