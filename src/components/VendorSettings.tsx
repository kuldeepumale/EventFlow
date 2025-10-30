import { useState } from 'react';
import { Vendor } from '../types';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Edit2, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VendorSettingsProps {
  vendor: Partial<Vendor>;
  onUpdate: (vendor: Partial<Vendor>) => void;
  onSignOut: () => void;
}

export function VendorSettings({ vendor, onUpdate, onSignOut }: VendorSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: vendor.name || '',
    description: vendor.description || '',
    location: vendor.location || '',
    phone: vendor.phone || '',
    email: vendor.email || '',
    responseTime: vendor.responseTime || '< 1 hour',
    priceRange: vendor.priceRange || '$$',
  });

  const [notifications, setNotifications] = useState({
    messages: true,
    likes: true,
    reviews: true,
    bookings: true,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate({ ...vendor, ...formData });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: vendor.name || '',
      description: vendor.description || '',
      location: vendor.location || '',
      phone: vendor.phone || '',
      email: vendor.email || '',
      responseTime: vendor.responseTime || '< 1 hour',
      priceRange: vendor.priceRange || '$$',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>Profile Information</h2>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>

        <Card className="p-4 space-y-4">
          <div>
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="responseTime">Response Time</Label>
            <Select
              value={formData.responseTime}
              onValueChange={(value) => handleInputChange('responseTime', value)}
              disabled={!isEditing}
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

          <div>
            <Label htmlFor="priceRange">Price Range</Label>
            <Select
              value={formData.priceRange}
              onValueChange={(value) => handleInputChange('priceRange', value)}
              disabled={!isEditing}
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
        </Card>
      </div>

      {/* Notification Preferences */}
      <div>
        <h2 className="mb-4">Notification Preferences</h2>
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">New Messages</p>
              <p className="text-xs text-gray-600">Get notified about new inquiries</p>
            </div>
            <Switch
              checked={notifications.messages}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, messages: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Likes & Favorites</p>
              <p className="text-xs text-gray-600">When users save your services</p>
            </div>
            <Switch
              checked={notifications.likes}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, likes: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">New Reviews</p>
              <p className="text-xs text-gray-600">Get notified about new reviews</p>
            </div>
            <Switch
              checked={notifications.reviews}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, reviews: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Booking Requests</p>
              <p className="text-xs text-gray-600">When someone wants to book</p>
            </div>
            <Switch
              checked={notifications.bookings}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, bookings: checked })
              }
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            View My Public Profile
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Business Hours & Availability
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Payment & Banking
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Help & Support
          </Button>
        </div>
      </div>

      {/* Sign Out */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={onSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
