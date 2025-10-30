import { useState, useRef } from 'react';
import { User as UserIcon, Camera, Loader2, Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';
import { User } from '../types';
import { AccountDeletion } from './AccountDeletion';

interface ProfileSettingsProps {
  user: User;
  accessToken: string;
  onUpdateUser: (user: User) => void;
  onClose: () => void;
  onAccountDeleted: () => void;
}

export function ProfileSettings({ user, accessToken, onUpdateUser, onClose, onAccountDeleted }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', user.id);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41f20081/user/upload-avatar`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload avatar');
      }

      setAvatar(data.avatarUrl);
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41f20081/user/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name,
            email: email || undefined,
            avatar: avatar || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      onUpdateUser(data.user);
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2>Edit Profile</h2>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-purple-600" />
                )}
              </div>
              <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click the camera icon to upload a photo
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <div className="relative">
              <Edit2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Phone Field (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={user.phone}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-500">
              Phone number cannot be changed
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>

          {/* Danger Zone */}
          <div className="pt-6 border-t">
            <p className="text-sm text-gray-500 mb-3">Danger Zone</p>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Account Deletion Dialog */}
      {showDeleteDialog && (
        <AccountDeletion
          accessToken={accessToken}
          onClose={() => setShowDeleteDialog(false)}
          onDeleted={onAccountDeleted}
        />
      )}
    </div>
  );
}
