// Truth Foundation CMS Data Fetcher
const API_BASE = '/api';

export interface DynamicHeroSlide {
  id: string;
  title: string;
  tagline: string;
  subtitle: string;
  badge: string;
  tag: string;
  image_url: string;
}

export interface DynamicProgram {
  id: string;
  title: string;
  location?: string;
  tag?: string;
  badge?: string;
  image_url: string;
  description: string;
  details?: string[];
}

export interface DynamicSiteContent {
  home_hero?: {
    slides: DynamicHeroSlide[];
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
    programs?: DynamicProgram[];
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

export interface DynamicGalleryItem {
  id: number;
  title?: string;
  category: string;
  image_url: string;
  description?: string;
}

let cachedContent: DynamicSiteContent | null = null;

export async function fetchSiteContent(): Promise<DynamicSiteContent | null> {
  if (cachedContent) return cachedContent;
  try {
    const res = await fetch(`${API_BASE}/content`);
    if (!res.ok) return null;
    const json = await res.json();
    cachedContent = json.content || null;
    return cachedContent;
  } catch (err) {
    console.warn('Could not fetch dynamic CMS content, using default assets:', err);
    return null;
  }
}

export async function fetchGalleryImages(category?: string): Promise<DynamicGalleryItem[] | null> {
  try {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/gallery${query}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.images || null;
  } catch (err) {
    console.warn('Could not fetch dynamic gallery photos, using defaults:', err);
    return null;
  }
}
