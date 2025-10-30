import { Vendor } from '../types';
import { X, Star, MapPin, Phone, Mail, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mockReviews } from '../data/mockData';
import { Avatar, AvatarFallback } from './ui/avatar';

interface VendorDetailsProps {
  vendor: Vendor;
  onClose: () => void;
}

export function VendorDetails({ vendor, onClose }: VendorDetailsProps) {
  const vendorReviews = mockReviews.filter(r => r.vendorId === vendor.id);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header Image */}
      <div className="relative h-64">
        <ImageWithFallback
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>
        {vendor.verified && (
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Verified</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1>{vendor.name}</h1>
            <p className="text-gray-600 capitalize">{vendor.category}</p>
          </div>
          <Badge variant="secondary">{vendor.priceRange}</Badge>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>{vendor.rating}</span>
            <span className="text-gray-500">({vendor.reviews} reviews)</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span>{vendor.location} • {vendor.distance} km away</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="w-5 h-5 text-gray-400" />
            <span>Typically responds in {vendor.responseTime}</span>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Description */}
        <div className="mb-6">
          <h2 className="mb-3">About</h2>
          <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h2 className="mb-3">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {vendor.services.map((service, index) => (
              <Badge key={index} variant="outline">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Reviews */}
        {vendorReviews.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-4">Reviews</h2>
            <div className="space-y-4">
              {vendorReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <Avatar>
                      <AvatarFallback>{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">{review.author}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{review.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t space-y-2">
          <Button className="w-full" size="lg">
            <Phone className="w-5 h-5 mr-2" />
            Call Now
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            <Mail className="w-5 h-5 mr-2" />
            Send Message
          </Button>
        </div>

        {/* Bottom padding to prevent content being hidden by fixed buttons */}
        <div className="h-32"></div>
      </div>
    </div>
  );
}
