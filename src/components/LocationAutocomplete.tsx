import { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Input } from './ui/input';
import { locationSuggestions } from '../data/mockData';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectLocation: (location: string) => void;
  placeholder?: string;
  showCurrentLocation?: boolean;
  onGetCurrentLocation?: () => void;
}

export function LocationAutocomplete({
  value,
  onChange,
  onSelectLocation,
  placeholder = "Search location...",
  showCurrentLocation = true,
  onGetCurrentLocation,
}: LocationAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.trim()) {
      const filtered = locationSuggestions.filter((location) =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(locationSuggestions);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (location: string) => {
    onChange(location);
    onSelectLocation(location);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange('');
    onSelectLocation('');
    setShowSuggestions(false);
  };

  const handleGetCurrentLocation = () => {
    if (onGetCurrentLocation) {
      onGetCurrentLocation();
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-10 h-12"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border max-h-64 overflow-y-auto">
          {showCurrentLocation && onGetCurrentLocation && (
            <>
              <button
                onClick={handleGetCurrentLocation}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors text-left border-b"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-purple-600">Use current location</p>
                  <p className="text-xs text-gray-500">Get vendors near you</p>
                </div>
              </button>
            </>
          )}

          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((location, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestion(location)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{location}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">
              No locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
