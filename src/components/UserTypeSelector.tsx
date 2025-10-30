import { UserType } from '../types';
import { Building2, User, Users, Store } from 'lucide-react';
import { Card } from './ui/card';

interface UserTypeSelectorProps {
  onSelect: (type: UserType) => void;
}

export function UserTypeSelector({ onSelect }: UserTypeSelectorProps) {
  const userTypes = [
    {
      type: 'individual' as UserType,
      icon: User,
      title: 'Individual',
      description: 'Planning a personal event',
    },
    {
      type: 'company' as UserType,
      icon: Users,
      title: 'Event Company',
      description: 'Professional event organizer',
    },
    {
      type: 'corporate' as UserType,
      icon: Building2,
      title: 'Corporate',
      description: 'Business events & functions',
    },
    {
      type: 'vendor' as UserType,
      icon: Store,
      title: 'Vendor',
      description: 'Offer your services to clients',
    },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-50 to-white z-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="mb-2">Welcome to EventConnect</h1>
          <p className="text-gray-600">Find the perfect vendors for your event</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 px-1">I am a/an:</p>
          {userTypes.map(({ type, icon: Icon, title, description }) => (
            <Card
              key={type}
              className="p-6 cursor-pointer transition-all hover:shadow-lg hover:border-purple-500 active:scale-[0.98]"
              onClick={() => onSelect(type)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3>{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
