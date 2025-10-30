import { useState, useMemo, useEffect } from 'react';
import { UserType, VendorCategory, Vendor, User as UserProfile } from './types';
import { mockVendors, categories } from './data/mockData';
import { LoginScreen } from './components/LoginScreen';
import { UserTypeSelector } from './components/UserTypeSelector';
import { VendorOnboarding } from './components/VendorOnboarding';
import { VendorDashboard } from './components/VendorDashboard';
import { ProfileSettings } from './components/ProfileSettings';
import { EnvironmentStatus } from './components/EnvironmentStatus';
import { SearchBar } from './components/SearchBar';
import { VendorCard } from './components/VendorCard';
import { VendorDetails } from './components/VendorDetails';
import { FilterSheet } from './components/FilterSheet';
import { Home, Search, Heart, User, MapPin, Navigation, Settings } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { projectId, publicAnonKey } from './utils/supabase/info';

type TabType = 'home' | 'search' | 'favorites' | 'profile';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  // App state
  const [userType, setUserType] = useState<UserType | null>(null);
  const [vendorProfile, setVendorProfile] = useState<Partial<Vendor> | null>(null);
  const [showVendorOnboarding, setShowVendorOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | 'all'>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortByDistance, setSortByDistance] = useState(false);

  // Load user profile after authentication
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      loadUserProfile();
    }
  }, [isAuthenticated, accessToken]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41f20081/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setUserType(data.user.userType || 'individual');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLoginSuccess = (token: string, userId: string, phone: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
    
    // Set initial user data
    setCurrentUser({
      id: userId,
      phone,
      userType: 'individual',
      createdAt: new Date().toISOString(),
    });
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAccessToken('');
    setCurrentUser(null);
    setUserType(null);
    setVendorProfile(null);
    setShowVendorOnboarding(false);
    setActiveTab('home');
  };

  // Set default location on mount, user can click to detect
  useEffect(() => {
    if (userType && !currentLocation) {
      const defaultLocation = 'Downtown';
      setCurrentLocation(defaultLocation);
      setLocation(defaultLocation);
    }
  }, [userType, currentLocation]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          // For now, we'll simulate getting a location name
          const { latitude, longitude } = position.coords;
          
          // Simulate reverse geocoding with a random location from our suggestions
          const mockLocations = ['Downtown', 'Midtown', 'West End', 'East Side'];
          const detectedLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
          
          setCurrentLocation(detectedLocation);
          setLocation(detectedLocation);
          setIsLoadingLocation(false);
          
          toast.success(`Location detected: ${detectedLocation}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          
          // Fallback to a default location
          const defaultLocation = 'Downtown';
          setCurrentLocation(defaultLocation);
          setLocation(defaultLocation);
          
          // Handle different error types
          let errorMessage = 'Using default location.';
          if (error.code === 1) {
            errorMessage = 'Location permission denied. Using default location.';
          } else if (error.code === 2) {
            errorMessage = 'Location unavailable. Using default location.';
          } else if (error.code === 3) {
            errorMessage = 'Location request timeout. Using default location.';
          }
          
          toast.info(errorMessage);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setIsLoadingLocation(false);
      const defaultLocation = 'Downtown';
      setCurrentLocation(defaultLocation);
      setLocation(defaultLocation);
      toast.info('Using default location: Downtown');
    }
  };

  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    let vendors = mockVendors.filter((vendor) => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = location === '' || vendor.location.toLowerCase().includes(location.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
      
      return matchesSearch && matchesLocation && matchesCategory;
    });

    // Sort by distance if enabled
    if (sortByDistance || selectedCategory !== 'all') {
      vendors = [...vendors].sort((a, b) => a.distance - b.distance);
    }

    return vendors;
  }, [searchQuery, location, selectedCategory, sortByDistance]);

  const favoriteVendors = mockVendors.filter(v => favorites.has(v.id));

  const toggleFavorite = (vendorId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vendorId)) {
        newFavorites.delete(vendorId);
      } else {
        newFavorites.add(vendorId);
      }
      return newFavorites;
    });
  };

  const handleCategoryClick = (category: VendorCategory) => {
    setSelectedCategory(category);
    setSortByDistance(true);
    setActiveTab('search');
  };

  const handleSelectLocation = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setSortByDistance(true);
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    if (type === 'vendor') {
      setShowVendorOnboarding(true);
    }
  };

  const handleVendorOnboardingComplete = (vendor: Partial<Vendor>) => {
    setVendorProfile({
      ...vendor,
      id: Date.now().toString(),
    });
    setShowVendorOnboarding(false);
  };

  const handleVendorSignOut = () => {
    handleSignOut();
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Show user type selector if user type not selected
  if (!userType) {
    return <UserTypeSelector onSelect={handleUserTypeSelect} />;
  }

  // Show vendor onboarding
  if (userType === 'vendor' && showVendorOnboarding) {
    return (
      <VendorOnboarding
        onComplete={handleVendorOnboardingComplete}
        onBack={() => setUserType(null)}
      />
    );
  }

  // Show vendor dashboard
  if (userType === 'vendor' && vendorProfile) {
    return (
      <VendorDashboard
        vendor={vendorProfile}
        onUpdateVendor={setVendorProfile}
        onSignOut={handleVendorSignOut}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-b-3xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-100">Welcome back,</p>
                  <h1 className="text-white">
                    {currentUser?.name || (userType === 'individual' ? 'Event Planner' : 
                     userType === 'company' ? 'Event Company' : 'Corporate')}
                  </h1>
                </div>
                <button 
                  onClick={() => setShowProfileSettings(true)}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden hover:bg-white/30 transition-colors"
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-100">
                  <MapPin className="w-4 h-4" />
                  <span>{currentLocation || 'Downtown'}</span>
                </div>
                <button
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                >
                  {isLoadingLocation ? (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Detecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      <span>Update</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 px-6 -mt-8 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <p className="text-2xl mb-1">{mockVendors.length}+</p>
                <p className="text-xs text-gray-600">Vendors</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <p className="text-2xl mb-1">4.8★</p>
                <p className="text-xs text-gray-600">Avg Rating</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <p className="text-2xl mb-1">24/7</p>
                <p className="text-xs text-gray-600">Support</p>
              </div>
            </div>

            {/* Categories */}
            <div className="px-6 mb-6">
              <h2 className="mb-4">Popular Categories</h2>
              <div className="grid grid-cols-4 gap-3">
                {categories.slice(1, 9).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id as VendorCategory)}
                    className="aspect-square bg-purple-50 rounded-xl flex flex-col items-center justify-center text-2xl hover:bg-purple-100 transition-colors p-2"
                  >
                    <span className="mb-1">{category.icon}</span>
                    <span className="text-xs text-gray-700 text-center leading-tight">
                      {category.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nearby Vendors */}
            <div className="px-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2>Nearby Vendors</h2>
                  <p className="text-sm text-gray-600">Sorted by distance</p>
                </div>
                <button 
                  className="text-purple-600 text-sm"
                  onClick={() => setActiveTab('search')}
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[...mockVendors]
                  .sort((a, b) => a.distance - b.distance)
                  .slice(0, 3)
                  .map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      onClick={() => setSelectedVendor(vendor)}
                    />
                  ))}
              </div>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="pb-20">
            <div className="p-6">
              <h1 className="mb-6">Find Vendors</h1>
              <SearchBar
                searchQuery={searchQuery}
                location={location}
                onSearchChange={setSearchQuery}
                onLocationChange={setLocation}
                onSelectLocation={handleSelectLocation}
                onFilterClick={() => setFilterOpen(true)}
                onGetCurrentLocation={getCurrentLocation}
              />
            </div>

            <div className="px-6 mb-4 flex items-center gap-2 flex-wrap">
              {selectedCategory !== 'all' && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSortByDistance(false);
                  }}
                >
                  {selectedCategory} ✕
                </Badge>
              )}
              {(sortByDistance || selectedCategory !== 'all') && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Sorted by distance
                </Badge>
              )}
            </div>

            <div className="px-6">
              <p className="text-sm text-gray-600 mb-4">
                Found {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-4">
                {filteredVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onClick={() => setSelectedVendor(vendor)}
                  />
                ))}
              </div>
              {filteredVendors.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No vendors found</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="p-6 pb-20">
            <h1 className="mb-6">Favorites</h1>
            {favoriteVendors.length > 0 ? (
              <div className="space-y-4">
                {favoriteVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onClick={() => setSelectedVendor(vendor)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No favorites yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Start adding vendors to your favorites
                </p>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="p-6 pb-20">
            <h1 className="mb-6">Profile</h1>
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl p-6 mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10" />
                )}
              </div>
              <h2 className="text-center text-white">
                {currentUser?.name || (userType === 'individual' ? 'Individual User' : 
                 userType === 'company' ? 'Event Company' : 'Corporate Account')}
              </h2>
              <p className="text-center text-purple-100">
                {currentUser?.phone || 'Premium Member'}
              </p>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => setShowProfileSettings(true)}
                className="w-full p-4 bg-white border rounded-xl text-left hover:bg-gray-50 flex items-center justify-between"
              >
                <div>
                  <p>Edit Profile</p>
                  <p className="text-sm text-gray-500">Update your personal information</p>
                </div>
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full p-4 bg-white border rounded-xl text-left hover:bg-gray-50">
                <p>Saved Searches</p>
                <p className="text-sm text-gray-500">View your saved vendor searches</p>
              </button>
              <button className="w-full p-4 bg-white border rounded-xl text-left hover:bg-gray-50">
                <p>Booking History</p>
                <p className="text-sm text-gray-500">Track your vendor bookings</p>
              </button>
              <button className="w-full p-4 bg-white border rounded-xl text-left hover:bg-gray-50">
                <p>Help & Support</p>
                <p className="text-sm text-gray-500">Get help with your account</p>
              </button>
              <button 
                className="w-full p-4 bg-white border rounded-xl text-left hover:bg-gray-50 text-red-600"
                onClick={handleSignOut}
              >
                <p>Sign Out</p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Toaster />
      <EnvironmentStatus />
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        {renderContent()}

        {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === 'search' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative ${
              activeTab === 'favorites' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs">Favorites</span>
            {favorites.size > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {favorites.size}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {selectedVendor && (
        <VendorDetails
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}

      <FilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => {
          setSelectedCategory(category);
          if (category !== 'all') {
            setSortByDistance(true);
          }
        }}
      />

      {/* Profile Settings Modal */}
      {showProfileSettings && currentUser && (
        <ProfileSettings
          user={currentUser}
          accessToken={accessToken}
          onUpdateUser={(updatedUser) => {
            setCurrentUser(updatedUser);
          }}
          onClose={() => setShowProfileSettings(false)}
          onAccountDeleted={handleSignOut}
        />
      )}
      </div>
    </>
  );
}
