import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { LocationAutocomplete } from './LocationAutocomplete';

interface SearchBarProps {
  searchQuery: string;
  location: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSelectLocation: (value: string) => void;
  onFilterClick: () => void;
  onGetCurrentLocation?: () => void;
}

export function SearchBar({
  searchQuery,
  location,
  onSearchChange,
  onLocationChange,
  onSelectLocation,
  onFilterClick,
  onGetCurrentLocation,
}: SearchBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 h-12"
        />
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <LocationAutocomplete
            value={location}
            onChange={onLocationChange}
            onSelectLocation={onSelectLocation}
            placeholder="Search location..."
            showCurrentLocation={true}
            onGetCurrentLocation={onGetCurrentLocation}
          />
        </div>
        
        <button
          onClick={onFilterClick}
          className="h-12 px-4 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
