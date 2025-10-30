import { useState } from 'react';
import { VendorCategory, Vendor } from '../types';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { categories } from '../data/mockData';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VendorOnboardingProps {
  onComplete: (vendor: Partial<Vendor>) => void;
  onBack: () => void;
}

export function VendorOnboarding({ onComplete, onBack }: VendorOnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '' as VendorCategory | '',
    description: '',
    location: '',
    phone: '',
    email: '',
    priceRange: '$$' as '$' | '$$' | '$$$' | '$$$$',
    responseTime: '< 1 hour',
    services: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.category) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else if (step === 2) {
      if (!formData.description || !formData.location) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    if (!formData.phone || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const vendor: Partial<Vendor> = {
      name: formData.name,
      category: formData.category as VendorCategory,
      description: formData.description,
      location: formData.location,
      phone: formData.phone,
      email: formData.email,
      priceRange: formData.priceRange,
      responseTime: formData.responseTime,
      services: formData.services.split(',').map(s => s.trim()).filter(s => s),
      rating: 0,
      reviews: 0,
      distance: 0,
      verified: false,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    };

    onComplete(vendor);
    toast.success('Vendor profile created successfully!');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your business name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.id !== 'all').map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image">Business Photo</Label>
              <div className="mt-1 border-2 border-dashed rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your services..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter your business location"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="priceRange">Price Range</Label>
              <Select
                value={formData.priceRange}
                onValueChange={(value) => handleInputChange('priceRange', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">$ - Budget</SelectItem>
                  <SelectItem value="$$">$$ - Moderate</SelectItem>
                  <SelectItem value="$$$">$$$ - Premium</SelectItem>
                  <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="services">Services (comma separated)</Label>
              <Input
                id="services"
                value={formData.services}
                onChange={(e) => handleInputChange('services', e.target.value)}
                placeholder="e.g., Wedding Photography, Event Coverage"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="responseTime">Typical Response Time</Label>
              <Select
                value={formData.responseTime}
                onValueChange={(value) => handleInputChange('responseTime', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="< 15 min">Less than 15 minutes</SelectItem>
                  <SelectItem value="< 30 min">Less than 30 minutes</SelectItem>
                  <SelectItem value="< 1 hour">Less than 1 hour</SelectItem>
                  <SelectItem value="< 2 hours">Less than 2 hours</SelectItem>
                  <SelectItem value="< 24 hours">Within 24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm">
                <strong>Review your information:</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Business: {formData.name}<br />
                Category: {formData.category}<br />
                Location: {formData.location}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-md mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 sticky top-0 z-10">
          <button
            onClick={step === 1 ? onBack : () => setStep(step - 1)}
            className="flex items-center gap-2 mb-4 hover:opacity-80"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-white">Vendor Registration</h1>
          <p className="text-purple-100">Step {step} of 3</p>

          {/* Progress bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {renderStep()}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {step < 3 ? (
              <Button onClick={handleNext} className="w-full">
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="w-full">
                Complete Registration
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
