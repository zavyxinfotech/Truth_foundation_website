export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Donation {
  id: number;
  donor_name: string;
  email: string;
  phone?: string;
  pan_number?: string;
  amount: number | string;
  currency: string;
  frequency: 'One-time' | 'Monthly';
  is_eighty_g: boolean;
  payment_method: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  status: string;
  receipt_number?: string;
  notes?: string;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  title?: string;
  category: string;
  image_url: string;
  cloudinary_public_id?: string;
  description?: string;
  created_at: string;
}

export interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'READ' | 'CONTACTED';
  created_at: string;
}

export interface DashboardStats {
  totalAmount: number;
  totalDonors: number;
  mealsFunded: number;
  monthlyRecurringAmount: number;
  last30DaysAmount: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  tagline: string;
  subtitle: string;
  badge: string;
  tag: string;
  image_url: string;
  cloudinary_public_id?: string;
}

export interface AboutProgram {
  id: string;
  title: string;
  location?: string;
  tag?: string;
  badge?: string;
  image_url: string;
  description: string;
  details?: string[];
}

export interface SiteContentData {
  home_hero?: {
    slides: HeroSlide[];
  };
  home_stats?: {
    daily_meals?: number;
    staff_count?: number;
    elderly_seniors?: number;
    resident_orphans?: number;
    tuition_students?: number;
    years_of_service?: number;
    special_needs_kids?: number;
  };
  about_page?: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_tagline?: string;
    hero_image_url?: string;
    mission_statement?: string;
    vision_statement?: string;
    founder_name?: string;
    founder_title?: string;
    founder_bio?: string;
    founder_image_url?: string;
    trustee_name?: string;
    trustee_title?: string;
    trustee_bio?: string;
    trustee_image_url?: string;
    programs?: AboutProgram[];
    cta_title?: string;
    cta_subtitle?: string;
    cta_image_url?: string;
  };
  gallery_page?: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_image_url?: string;
  };
  contact_page?: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_image_url?: string;
    redhills_name?: string;
    redhills_address?: string;
    redhills_phone?: string;
    redhills_email?: string;
    kolathur_name?: string;
    kolathur_address?: string;
    kolathur_phone?: string;
    kolathur_email?: string;
    whatsapp_number?: string;
    timings?: string;
  };
}
