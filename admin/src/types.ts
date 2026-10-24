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
