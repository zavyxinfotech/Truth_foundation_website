export interface DonationOption {
  amount: number;
  meals: number;
  label: string;
  description: string;
  popular?: boolean;
}

export interface DonorDetails {
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isEightYGRequired: boolean;
  isAnonymous: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Donor' | 'Volunteer' | 'Teacher' | 'CSR Partner';
  location: string;
  avatar: string;
  comment: string;
  rating: number;
  date: string;
  verified: boolean;
  donatedAmount?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Meals' | 'Education' | 'Medical' | 'Volunteers' | 'Events' | 'Kitchen' | 'Smiles';
  image: ImagetoolsPicture;
  location: string;
  date: string;
  description: string;
  quote?: string;
  aspectRatio?: 'tall' | 'square' | 'wide' | 'standard';
  impactStat?: { label: string; value: string };
  beneficiaries?: string;
  storyDetails?: string;
  readTime?: string;
}

export interface MonthlyGivingOptions {
  enabled: boolean;
  suggestedAmounts: number[];
  defaultAmount: number;
  perks: string[];
  impactDescription: string;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  heroImage: string;
  targetMeals: number;
  mealsServed: number;
  donorsCount: number;
  minAmount: number;
  suggestedAmounts: number[];
  badge: string;
  description: string;
  monthlyOptions?: MonthlyGivingOptions;
}

export interface PixelEvent {
  id: string;
  timestamp: string;
  eventName: string;
  platform: 'Meta Pixel' | 'GA4' | 'GTM';
  payload: Record<string, any>;
}
