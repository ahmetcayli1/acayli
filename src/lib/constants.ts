// Countries available for selection
export const COUNTRIES = [
  {
    id: 'germany',
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    available: true,
    description: 'Top engineering and research programs',
    gradient: 'from-gray-900 via-red-600 to-yellow-500',
  },
  {
    id: 'italy',
    name: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    available: true,
    description: 'Rich academic heritage',
    gradient: 'from-green-600 via-white to-red-600',
  },
  {
    id: 'poland',
    name: 'Poland',
    code: 'PL',
    flag: '🇵🇱',
    available: true,
    description: 'Growing education hub',
    gradient: 'from-white to-red-600',
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    code: 'NL',
    flag: '🇳🇱',
    available: false,
    description: 'Innovative programs in English',
    gradient: 'from-red-600 via-white to-blue-700',
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    available: false,
    description: 'World-class universities',
    gradient: 'from-blue-900 via-red-600 to-white',
  },
  {
    id: 'canada',
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    available: false,
    description: 'Excellent study opportunities',
    gradient: 'from-red-600 via-white to-red-600',
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    available: false,
    description: 'High-quality education programs',
    gradient: 'from-blue-900 via-white to-red-600',
  },
  {
    id: 'usa',
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    available: false,
    description: 'Leading global universities',
    gradient: 'from-blue-900 via-white to-red-600',
  },
  {
    id: 'france',
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    available: false,
    description: 'Excellence in arts and sciences',
    gradient: 'from-blue-700 via-white to-red-600',
  },
  {
    id: 'spain',
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    available: false,
    description: 'Vibrant culture and education',
    gradient: 'from-red-600 via-yellow-500 to-red-600',
  },
  {
    id: 'hungary',
    name: 'Hungary',
    code: 'HU',
    flag: '🇭🇺',
    available: false,
    description: 'Strong academic programs',
    gradient: 'from-red-600 via-white to-green-600',
  },
  {
    id: 'greece',
    name: 'Greece',
    code: 'GR',
    flag: '🇬🇷',
    available: false,
    description: 'Ancient wisdom meets modern education',
    gradient: 'from-blue-600 via-white to-blue-600',
  },
  {
    id: 'portugal',
    name: 'Portugal',
    code: 'PT',
    flag: '🇵🇹',
    available: false,
    description: 'Affordable quality education',
    gradient: 'from-green-600 via-red-600 to-yellow-500',
  },
]

// Language options
export const LANGUAGES = [
  { id: 'EN', name: 'English', flag: '🇬🇧' },
  { id: 'DE', name: 'German', flag: '🇩🇪' },
  { id: 'IT', name: 'Italian', flag: '🇮🇹' },
  { id: 'PL', name: 'Polish', flag: '🇵🇱' },
  { id: 'FR', name: 'French', flag: '🇫🇷' },
  { id: 'ES', name: 'Spanish', flag: '🇪🇸' },
  { id: 'PT', name: 'Portuguese', flag: '🇵🇹' },
]

// Landing page city images (royalty-free from Unsplash)
export const CITY_IMAGES = {
  left: [
    { city: 'Paris', country: 'France', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop' },
    { city: 'Berlin', country: 'Germany', url: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&h=600&fit=crop' },
    { city: 'Rome', country: 'Italy', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=600&fit=crop' },
    { city: 'Warsaw', country: 'Poland', url: 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400&h=600&fit=crop' },
    { city: 'London', country: 'UK', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=600&fit=crop' },
    { city: 'Amsterdam', country: 'Netherlands', url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=600&fit=crop' },
    { city: 'Vienna', country: 'Austria', url: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&h=600&fit=crop' },
    { city: 'Barcelona', country: 'Spain', url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=600&fit=crop' },
  ],
  right: [
    { city: 'New York', country: 'USA', url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=600&fit=crop' },
    { city: 'Boston', country: 'USA', url: 'https://images.unsplash.com/photo-1501979376754-1d87f7b0f6e8?w=400&h=600&fit=crop' },
    { city: 'Toronto', country: 'Canada', url: 'https://images.unsplash.com/photo-1517090504531-3b24c9274378?w=400&h=600&fit=crop' },
    { city: 'Sydney', country: 'Australia', url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=600&fit=crop' },
    { city: 'Washington DC', country: 'USA', url: 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=400&h=600&fit=crop' },
    { city: 'San Francisco', country: 'USA', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop' },
    { city: 'Chicago', country: 'USA', url: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=600&fit=crop' },
    { city: 'Melbourne', country: 'Australia', url: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=400&h=600&fit=crop' },
  ],
}

// Pricing configuration
export const PRICING = {
  listPrice: 239900, // in cents: $2399.00
  discountPercent: 64,
  finalPrice: 86364, // in cents: $863.64
  currency: 'usd',
}

// Profile wizard steps
export const WIZARD_STEPS = [
  { id: 1, title: 'Country Selection', icon: 'Globe' },
  { id: 2, title: 'Personal Profile', icon: 'User' },
  { id: 3, title: 'Academic Scores', icon: 'GraduationCap' },
  { id: 4, title: 'Preferences', icon: 'Settings' },
  { id: 5, title: 'Review & Submit', icon: 'CheckCircle' },
]

// Test requirements by country
export const COUNTRY_TEST_PRIORITY: Record<string, {
  language: string[];
  standardized: string[];
  notes: Record<string, string>;
}> = {
  germany: {
    language: ['IELTS', 'TOEFL', 'TestDaF'],
    standardized: ['GRE'],
    notes: {
      TestDaF: 'Required for German-taught programs',
      GRE: 'Optional, may strengthen application',
    },
  },
  italy: {
    language: ['IELTS', 'TOEFL', 'CELI'],
    standardized: ['GRE', 'GMAT'],
    notes: {
      CELI: 'Required for Italian-taught programs',
    },
  },
  poland: {
    language: ['IELTS', 'TOEFL'],
    standardized: [],
    notes: {
      IELTS: 'Most commonly accepted',
    },
  },
}

// Match score weights
export const MATCH_WEIGHTS = {
  similarity: 0.35,
  preScore: 0.25,
  llmScore: 0.40,
}

// Entitlement types
export const ENTITLEMENT_TYPES = {
  FULL_RESULTS_UNLOCK: 'FULL_RESULTS_UNLOCK',
}

// Result limits
export const RESULTS_LIMITS = {
  previewCount: 3,
  minCount: 10,
  maxCount: 50,
  defaultCount: 20,
}
