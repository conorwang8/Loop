export interface Recommendation {
  id: string
  title: string
  category: string
  description: string
  location: string
  author: string | { name: string; avatar: string }
  rating: number
  image: string
  createdAt: Date
}

export interface Service {
  id: string
  name: string
  category: string
  description: string
  address: string
  phone?: string
  hours?: string
  rating: number
  image?: string
}

export const categories = [
  { id: "food", name: "Food & Dining", icon: "🍽️" },
  { id: "health", name: "Health & Wellness", icon: "🏥" },
  { id: "entertainment", name: "Entertainment", icon: "🎭" },
  { id: "shopping", name: "Shopping", icon: "🛍️" },
  { id: "services", name: "Services", icon: "🔧" },
  { id: "parks", name: "Parks & Recreation", icon: "🌳" },
  { id: "misc", name: "Miscellaneous", icon: "..." },
]

export const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Best Coffee in Downtown",
    category: "food",
    description: "Amazing espresso and cozy atmosphere. Perfect spot for remote work!",
    location: "Downtown District",
    author: { name: "Sarah Chen", avatar: "/diverse-woman-portrait.png" },
    rating: 4.8,
    image: "/cozy-coffee-shop.png",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    title: "Hidden Gem: Riverside Park",
    category: "parks",
    description: "Peaceful walking trails with stunning river views. Great for morning jogs.",
    location: "Riverside",
    author: { name: "Mike Johnson", avatar: "/man.jpg" },
    rating: 4.9,
    image: "/park-with-river.jpg",
    createdAt: new Date("2025-01-14"),
  },
  {
    id: "3",
    title: "Affordable Yoga Studio",
    category: "health",
    description: "Community-focused yoga classes for all levels. First class is free!",
    location: "Midtown",
    author: "Emma Davis",
    image: "/woman-doing-yoga.png",
    rating: 4.7,
    createdAt: new Date("2025-01-13"),
  },
]

export const mockServices: Service[] = [
  {
    id: "1",
    name: "City Health Clinic",
    category: "health",
    description: "Walk-in clinic with experienced doctors. No appointment needed.",
    address: "123 Main St, Downtown",
    phone: "(555) 123-4567",
    hours: "Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM",
    rating: 4.6,
    image: "/modern-clinic.jpg",
  },
  {
    id: "2",
    name: "Quick Fix Repairs",
    category: "services",
    description: "Same-day home repair services. Plumbing, electrical, and more.",
    address: "456 Oak Ave, Westside",
    phone: "(555) 234-5678",
    hours: "24/7 Emergency Service",
    rating: 4.8,
    image: "/repair-service.jpg",
  },
  {
    id: "3",
    name: "Central Farmers Market",
    category: "shopping",
    description: "Fresh local produce and artisan goods every weekend.",
    address: "Central Plaza",
    hours: "Sat-Sun: 7AM-2PM",
    rating: 4.9,
    image: "/bustling-farmers-market.png",
  },
  {
    id: "4",
    name: "Sunrise Yoga Studio",
    category: "fitness",
    description: "Peaceful yoga and meditation classes for all levels.",
    address: "12 Maple Blvd, Uptown",
    phone: "(555) 345-6789",
    hours: "Mon-Sat: 6AM-8PM",
    rating: 4.7,
    image: "/yoga-studio.jpg",
  },
  {
    id: "5",
    name: "The Coffee Corner",
    category: "food",
    description: "Cozy café serving locally roasted coffee and homemade pastries.",
    address: "98 Elm St, Midtown",
    phone: "(555) 456-7890",
    hours: "Mon-Sun: 7AM-7PM",
    rating: 4.5,
    image: "/coffee-shop.jpg",
  },
  {
    id: "6",
    name: "Bright Minds Tutoring",
    category: "education",
    description: "Personalized tutoring for K-12 and college students.",
    address: "245 Pine Ave, Eastside",
    phone: "(555) 567-8901",
    hours: "Mon-Fri: 3PM-9PM, Sat: 10AM-4PM",
    rating: 4.9,
    image: "/tutoring-center.jpg",
  },
  {
    id: "7",
    name: "Downtown Gym & Fitness",
    category: "fitness",
    description: "Modern gym with top-tier equipment and personal trainers.",
    address: "77 Broadway, Downtown",
    phone: "(555) 678-9012",
    hours: "Mon-Sun: 5AM-11PM",
    rating: 4.8,
    image: "/modern-gym.png",
  },
  {
    id: "8",
    name: "Happy Paws Pet Grooming",
    category: "services",
    description: "Professional pet grooming and care for cats and dogs.",
    address: "301 Birch Rd, Northside",
    phone: "(555) 789-0123",
    hours: "Mon-Sat: 9AM-6PM",
    rating: 4.7,
    image: "/pet-grooming.jpg",
  },
  {
    id: "9",
    name: "CineStar Theaters",
    category: "entertainment",
    description: "Luxury movie theater with reclining seats and gourmet snacks.",
    address: "890 Movie Ln, Midtown",
    phone: "(555) 890-1234",
    hours: "Mon-Sun: 10AM-12AM",
    rating: 4.6,
    image: "/movie-theater.jpg",
  },
  {
    id: "10",
    name: "Taste of Italy",
    category: "food",
    description: "Authentic Italian restaurant known for handmade pasta and pizza.",
    address: "222 Olive St, Downtown",
    phone: "(555) 901-2345",
    hours: "Mon-Sun: 11AM-10PM",
    rating: 4.8,
    image: "/italian-restaurant.jpg",
  },
  {
    id: "11",
    name: "TechWise Electronics",
    category: "shopping",
    description: "Latest gadgets, phones, and accessories at unbeatable prices.",
    address: "555 Tech Park Dr, Eastside",
    phone: "(555) 012-3456",
    hours: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM",
    rating: 4.5,
    image: "/electronics-store.jpg",
  },
  {
    id: "12",
    name: "GreenLeaf Spa",
    category: "health",
    description: "Relaxing massages, facials, and wellness treatments.",
    address: "400 Willow St, Lakeside",
    phone: "(555) 678-4321",
    hours: "Mon-Sun: 9AM-9PM",
    rating: 4.9,
    image: "/spa-center.jpg",
  },
  {
    id: "13",
    name: "Urban Bike Rentals",
    category: "services",
    description: "Affordable daily and hourly bike rentals around the city.",
    address: "61 Riverwalk Blvd",
    phone: "(555) 314-1592",
    hours: "Mon-Sun: 7AM-9PM",
    rating: 4.6,
    image: "/bike-rental.jpg",
  },
  {
    id: "14",
    name: "Bloom Boutique",
    category: "shopping",
    description: "Trendy fashion boutique featuring local and sustainable brands.",
    address: "37 Cherry Ln, Uptown",
    phone: "(555) 926-8472",
    hours: "Mon-Sat: 10AM-7PM",
    rating: 4.7,
    image: "/shopping-boutique.jpg",
  },
  {
    id: "15",
    name: "City Library",
    category: "education",
    description: "Public library offering books, study spaces, and free Wi-Fi.",
    address: "10 Knowledge Dr, Downtown",
    phone: "(555) 481-0923",
    hours: "Mon-Fri: 9AM-8PM, Sat: 10AM-6PM",
    rating: 4.8,
    image: "/city-library.jpg",
  },
]
