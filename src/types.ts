export type ServiceCategory = 'hair' | 'braids' | 'sewins' | 'nails' | 'brows_lashes' | 'makeup' | 'skin_facials' | 'others';

export interface Deal {
  id: string;
  stylistName: string;
  stylistAvatar: string;
  salonName: string;
  neighborhood: string;
  serviceTitle: string;
  category: ServiceCategory;
  durationMinutes: number;
  originalPrice: number;
  discountedPrice: number;
  timeSlot: string; // e.g., "Today at 2:30 PM"
  dateLabel: string;
  availableSpots: number;
  calendlyUrl?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string; // e.g. "50% OFF", "Flash Deal", "1 Slot Left"
}

export interface ClientLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  neighborhood: string;
  services: ServiceCategory[];
  createdAt: string;
}

export interface ProLead {
  id: string;
  name: string;
  businessName?: string;
  serviceType: string;
  neighborhood: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  discountPercentage: number;
  airtableEmbedUrl: string;
  calendlyBaseUrl: string;
  googleFormEmbedUrl: string;
  contactEmail: string;
  googleSheetUrl?: string;
  googleSheetId?: string;
  googleSheetWebhookUrl?: string;
  policyNotes: {
    upfrontPayment: boolean;
    nonRefundable: boolean;
    goodwillCredit: boolean;
  };
}
