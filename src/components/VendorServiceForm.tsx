import { useState, useEffect } from 'react';
import { VendorService } from '../types';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VendorServiceFormProps {
  service: VendorService | null;
  onSave: (service: Omit<VendorService, 'id' | 'vendorId'>) => void;
  onClose: () => void;
}

export function VendorServiceForm({ service, onSave, onClose }: VendorServiceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration || '',
      });
    }
  }, [service]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSave(formData);
    toast.success(service ? 'Service updated successfully!' : 'Service added successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Wedding Photography Package"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what's included in this service..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="e.g., $2,500 or Starting from $1,000"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can use ranges or starting prices
            </p>
          </div>

          <div>
            <Label htmlFor="duration">Duration (optional)</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g., 8 hours, Full day, 2-3 days"
              className="mt-1"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {service ? 'Update' : 'Add'} Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
