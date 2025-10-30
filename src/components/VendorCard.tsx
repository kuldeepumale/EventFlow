import { Vendor } from '../types';
import { Star, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VendorCardProps {
  vendor: Vendor;
  onClick: () => void;
}

export function VendorCard({ vendor, onClick }: VendorCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="relative h-40">
        <ImageWithFallback
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
        {vendor.verified && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
            <CheckCircle className="w-4 h-4 text-blue-500" />
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <Badge className="bg-white text-black">{vendor.priceRange}</Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="line-clamp-1">{vendor.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{vendor.category}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{vendor.rating}</span>
          <span className="text-sm text-gray-500">({vendor.reviews})</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{vendor.location} • {vendor.distance} km</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Responds in {vendor.responseTime}</span>
        </div>
      </div>
    </Card>
  );
}
