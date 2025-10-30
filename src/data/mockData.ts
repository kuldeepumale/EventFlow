import { Vendor, Review } from "../types";

export const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Gourmet Catering Co.",
    category: "catering",
    description:
      "Premium catering services for weddings, corporate events, and special occasions. Specializing in international cuisine and custom menus.",
    image:
      "https://images.unsplash.com/photo-1732259495388-af40b972c311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMHNlcnZpY2UlMjBmb29kfGVufDF8fHx8MTc2MTczMDU4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 156,
    location: "Downtown",
    distance: 2.3,
    priceRange: "$$$",
    verified: true,
    responseTime: "< 1 hour",
    services: [
      "Wedding Catering",
      "Corporate Events",
      "Custom Menus",
      "Buffet Service",
    ],
    phone: "+1 (555) 123-4567",
    email: "info@gourmetcatering.com",
  },
  {
    id: "2",
    name: "Moments Photography",
    category: "photography",
    description:
      "Professional event photography capturing your special moments. Over 10 years of experience in weddings and corporate events.",
    image:
      "https://images.unsplash.com/photo-1614607653708-0777e6d003b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MTcwNjU5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 203,
    location: "Midtown",
    distance: 1.5,
    priceRange: "$$",
    verified: true,
    responseTime: "< 30 min",
    services: [
      "Wedding Photography",
      "Event Coverage",
      "Portrait Sessions",
      "Photo Albums",
    ],
    phone: "+1 (555) 234-5678",
    email: "hello@momentsphotography.com",
  },
  {
    id: "3",
    name: "Grand Ballroom Venue",
    category: "venue",
    description:
      "Elegant ballroom venue perfect for weddings, galas, and corporate events. Capacity up to 500 guests with modern amenities.",
    image:
      "https://images.unsplash.com/photo-1670529776180-60e4132ab90c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmVudWV8ZW58MXx8fHwxNzYxNzI5NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 89,
    location: "West End",
    distance: 5.2,
    priceRange: "$$$$",
    verified: true,
    responseTime: "< 2 hours",
    services: [
      "Wedding Venue",
      "Corporate Events",
      "Gala Events",
      "A/V Equipment",
    ],
    phone: "+1 (555) 345-6789",
    email: "bookings@grandballroom.com",
  },
  {
    id: "4",
    name: "Elegant Decor Studio",
    category: "decoration",
    description:
      "Creative event decoration and design services. Transform any space into a magical experience with our custom designs.",
    image:
      "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGRlY29yYXRpb258ZW58MXx8fHwxNzYxNzMwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 124,
    location: "East Side",
    distance: 3.8,
    priceRange: "$$",
    verified: true,
    responseTime: "< 1 hour",
    services: [
      "Event Styling",
      "Floral Arrangements",
      "Backdrop Design",
      "Table Settings",
    ],
    phone: "+1 (555) 456-7890",
    email: "design@elegantdecor.com",
  },
  {
    id: "5",
    name: "Beat Masters DJ Service",
    category: "music",
    description:
      "Professional DJ and entertainment services for all types of events. Keep your guests dancing all night long!",
    image:
      "https://images.unsplash.com/photo-1620704075906-27bfa0d54f3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMG11c2ljJTIwZXZlbnR8ZW58MXx8fHwxNzYxNjYxNTMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 167,
    location: "Downtown",
    distance: 2.1,
    priceRange: "$$$",
    verified: true,
    responseTime: "< 30 min",
    services: [
      "DJ Services",
      "Sound Equipment",
      "Lighting",
      "MC Services",
    ],
    phone: "+1 (555) 567-8901",
    email: "bookings@beatmasters.com",
  },
  {
    id: "6",
    name: "Perfect Events Planning",
    category: "planning",
    description:
      "Full-service event planning and coordination. We handle every detail so you can enjoy your special day stress-free.",
    image:
      "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBsYW5uaW5nfGVufDF8fHx8MTc2MTYxODU2OXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5.0,
    reviews: 98,
    location: "Midtown",
    distance: 1.2,
    priceRange: "$$$$",
    verified: true,
    responseTime: "< 15 min",
    services: [
      "Full Planning",
      "Day-of Coordination",
      "Vendor Management",
      "Budget Planning",
    ],
    phone: "+1 (555) 678-9012",
    email: "info@perfectevents.com",
  },
  {
    id: "7",
    name: "Bloom & Blossom Florist",
    category: "florist",
    description:
      "Stunning floral designs for weddings and events. Fresh flowers sourced daily with custom arrangements available.",
    image:
      "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGRlY29yYXRpb258ZW58MXx8fHwxNzYxNzMwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 142,
    location: "North District",
    distance: 4.5,
    priceRange: "$$",
    verified: true,
    responseTime: "< 1 hour",
    services: [
      "Bridal Bouquets",
      "Centerpieces",
      "Ceremony Flowers",
      "Delivery & Setup",
    ],
    phone: "+1 (555) 789-0123",
    email: "flowers@bloomblossom.com",
  },
  {
    id: "8",
    name: "Cinema Dreams Videography",
    category: "videography",
    description:
      "Cinematic event videography that tells your story. Professional editing and same-day highlights available.",
    image:
      "https://images.unsplash.com/photo-1614607653708-0777e6d003b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MTcwNjU5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 176,
    location: "South Bay",
    distance: 6.3,
    priceRange: "$$$",
    verified: true,
    responseTime: "< 30 min",
    services: [
      "Wedding Videos",
      "Drone Footage",
      "Same-day Edits",
      "Live Streaming",
    ],
    phone: "+1 (555) 890-1234",
    email: "contact@cinemadreams.com",
  },
];

export const mockReviews: Review[] = [
  {
    id: "1",
    vendorId: "1",
    author: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely amazing service! The food was delicious and the presentation was beautiful. Highly recommend!",
    date: "2025-10-15",
    avatar: "SJ",
  },
  {
    id: "2",
    vendorId: "1",
    author: "Michael Chen",
    rating: 4,
    comment:
      "Great catering service for our corporate event. Professional and timely.",
    date: "2025-10-10",
    avatar: "MC",
  },
  {
    id: "3",
    vendorId: "2",
    author: "Emily Davis",
    rating: 5,
    comment:
      "The best photographer we could have asked for! Captured every special moment perfectly.",
    date: "2025-10-20",
    avatar: "ED",
  },
];

export const categories = [
  { id: "all", name: "All", icon: "🎯" },
  { id: "catering", name: "Catering", icon: "🍽️" },
  { id: "photography", name: "Photography", icon: "📸" },
  { id: "videography", name: "Videography", icon: "🎥" },
  { id: "venue", name: "Venues", icon: "🏛️" },
  { id: "decoration", name: "Decoration", icon: "🎨" },
  { id: "music", name: "Music & DJ", icon: "🎵" },
  { id: "florist", name: "Florist", icon: "💐" },
  { id: "lighting", name: "Lighting", icon: "💡" },
  { id: "planning", name: "Planning", icon: "📋" },
];

// Location suggestions for autocomplete
export const locationSuggestions = [
  "Downtown",
  "Midtown",
  "West End",
  "East Side",
  "North District",
  "South Bay",
  "Central Business District",
  "Riverfront",
  "Uptown",
  "Historic District",
  "Arts District",
  "Financial District",
  "Beach Area",
  "Suburbs",
  "Old Town",
];

// Mock messages for vendors
export const mockMessages = [
  {
    id: "1",
    vendorId: "1",
    senderId: "user1",
    senderName: "Sarah Johnson",
    message: "Hi! I'm interested in your wedding catering package for 150 guests. Could you provide more details?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
  },
  {
    id: "2",
    vendorId: "1",
    senderId: "user2",
    senderName: "Michael Chen",
    message: "Do you offer corporate lunch catering? We need it for next Tuesday.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
  },
];