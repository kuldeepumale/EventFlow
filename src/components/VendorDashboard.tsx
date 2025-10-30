import { useState } from 'react';
import { Vendor, VendorService, Notification, Message } from '../types';
import { Bell, Plus, Home, MessageSquare, Settings, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { VendorServiceForm } from './VendorServiceForm';
import { VendorNotifications } from './VendorNotifications';
import { VendorSettings } from './VendorSettings';
import { VendorMessages } from './VendorMessages';
import { mockMessages } from '../data/mockData';

type VendorTab = 'dashboard' | 'services' | 'messages' | 'settings';

interface VendorDashboardProps {
  vendor: Partial<Vendor>;
  onUpdateVendor: (vendor: Partial<Vendor>) => void;
  onSignOut: () => void;
}

export function VendorDashboard({ vendor, onUpdateVendor, onSignOut }: VendorDashboardProps) {
  const [activeTab, setActiveTab] = useState<VendorTab>('dashboard');
  const [services, setServices] = useState<VendorService[]>([
    {
      id: '1',
      vendorId: vendor.id || '1',
      name: 'Wedding Photography',
      description: 'Full day wedding coverage with 2 photographers',
      price: '$2,500',
      duration: '8 hours',
    },
    {
      id: '2',
      vendorId: vendor.id || '1',
      name: 'Event Coverage',
      description: 'Corporate event photography',
      price: '$1,200',
      duration: '4 hours',
    },
  ]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<VendorService | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      vendorId: vendor.id || '1',
      type: 'message',
      title: 'New message from Sarah Johnson',
      description: 'Interested in your wedding photography package',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: false,
    },
    {
      id: '2',
      vendorId: vendor.id || '1',
      type: 'like',
      title: 'Someone saved your service',
      description: 'A user added you to their favorites',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: false,
    },
    {
      id: '3',
      vendorId: vendor.id || '1',
      type: 'review',
      title: 'New 5-star review',
      description: 'Michael Chen left a positive review',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length + messages.filter(m => !m.read).length;

  const handleAddService = (service: Omit<VendorService, 'id' | 'vendorId'>) => {
    const newService: VendorService = {
      ...service,
      id: Date.now().toString(),
      vendorId: vendor.id || '1',
    };
    setServices([...services, newService]);
    setShowServiceForm(false);
  };

  const handleUpdateService = (service: Omit<VendorService, 'id' | 'vendorId'>) => {
    if (editingService) {
      setServices(services.map(s => 
        s.id === editingService.id 
          ? { ...s, ...service }
          : s
      ));
      setEditingService(null);
      setShowServiceForm(false);
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleEditService = (service: VendorService) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-2xl mb-1">{vendor.reviews || 0}</p>
          <p className="text-sm text-gray-600">Total Reviews</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl mb-1">{vendor.rating?.toFixed(1) || '0.0'}★</p>
          <p className="text-sm text-gray-600">Average Rating</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl mb-1">{services.length}</p>
          <p className="text-sm text-gray-600">Active Services</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl mb-1">{unreadCount}</p>
          <p className="text-sm text-gray-600">Unread Messages</p>
        </Card>
      </div>

      {/* Recent Notifications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>Recent Activity</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('messages')}
          >
            View All
          </Button>
        </div>
        <div className="space-y-2">
          {notifications.slice(0, 3).map((notification) => (
            <Card key={notification.id} className={`p-4 ${!notification.read ? 'bg-purple-50 border-purple-200' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.type === 'message' ? 'bg-blue-100' :
                  notification.type === 'like' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  {notification.type === 'message' ? '💬' :
                   notification.type === 'like' ? '❤️' : '⭐'}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.title}</p>
                  <p className="text-xs text-gray-600">{notification.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>My Services</h2>
          <p className="text-sm text-gray-600">Manage your service offerings</p>
        </div>
        <Button onClick={() => {
          setEditingService(null);
          setShowServiceForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3>{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary">{service.price}</Badge>
                  {service.duration && (
                    <span className="text-xs text-gray-600">{service.duration}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditService(service)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {services.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No services added yet</p>
            <p className="text-sm mt-2">Click "Add Service" to get started</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'services':
        return renderServices();
      case 'messages':
        return (
          <div className="space-y-6">
            <VendorMessages
              messages={messages}
              onSendReply={(messageId, reply) => {
                setMessages(messages.map(m =>
                  m.id === messageId ? { ...m, read: true } : m
                ));
              }}
            />
            <div className="border-t pt-6">
              <VendorNotifications
                notifications={notifications}
                onMarkAsRead={(id) => {
                  setNotifications(notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                  ));
                }}
                onMarkAllAsRead={() => {
                  setNotifications(notifications.map(n => ({ ...n, read: true })));
                }}
              />
            </div>
          </div>
        );
      case 'settings':
        return (
          <VendorSettings
            vendor={vendor}
            onUpdate={onUpdateVendor}
            onSignOut={onSignOut}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white">{vendor.name}</h1>
            <p className="text-purple-100 text-sm">{vendor.category}</p>
          </div>
          <button
            onClick={() => setActiveTab('messages')}
            className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        {vendor.verified && (
          <Badge className="bg-white/20">✓ Verified</Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6 pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === 'services' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Eye className="w-6 h-6" />
            <span className="text-xs">Services</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative ${
              activeTab === 'messages' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs">Messages</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>

      {/* Service Form Modal */}
      {showServiceForm && (
        <VendorServiceForm
          service={editingService}
          onSave={editingService ? handleUpdateService : handleAddService}
          onClose={() => {
            setShowServiceForm(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
}
