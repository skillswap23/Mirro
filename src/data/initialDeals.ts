import { Deal, SiteConfig } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'The Mirro',
  tagline: 'Last-minute beauty appointments, up to 50% off, near you',
  discountPercentage: 50,
  airtableEmbedUrl: 'https://airtable.com/embed/appExampleView?viewControls=on',
  calendlyBaseUrl: 'https://calendly.com/themirro-beauty',
  googleFormEmbedUrl: 'https://tally.so/embed/mB0pLK?alignLeft=1&hideTitle=1&transparentBackground=1',
  contactEmail: 'faith@themirro.com',
  googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbw6TMJQdgvO1PHQ3Si63Lzv6H9L7UK-grhzWCvVYkzndneEMKRyLuMJIau1qqhIly_UjA/exec',
  policyNotes: {
    upfrontPayment: true,
    nonRefundable: true,
    goodwillCredit: true,
  },
};

export const INITIAL_DEALS: Deal[] = [];
