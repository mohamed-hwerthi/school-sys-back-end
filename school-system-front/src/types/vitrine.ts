// Vitrine (showcase website) types

export interface VitrineConfig {
  id: number;
  schoolDisplayName: string;
  slogan: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  themeTemplate: "modern" | "classic" | "minimal";
  contactPhone: string | null;
  contactEmail: string | null;
  contactAddress: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  whatsappNumber: string | null;
  metaDescription: string | null;
  published: boolean;
}

export interface VitrinePage {
  id: number;
  title: string;
  slug: string;
  displayOrder: number;
  visible: boolean;
  sections: VitrineSection[];
}

export interface VitrineSection {
  id: number;
  pageId: number;
  sectionType: "hero" | "text" | "gallery" | "stats" | "cta" | "testimonials" | "map" | "announcements";
  title: string | null;
  content: Record<string, unknown>;
  displayOrder: number;
  visible: boolean;
}

export interface VitrineGalleryItem {
  id: number;
  imageUrl: string;
  caption: string | null;
  category: string | null;
  displayOrder: number;
}

export interface VitrineAnnouncement {
  id: number;
  title: string;
  body: string | null;
  pinned: boolean;
  published: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface VitrineAnalytics {
  totalViews: number;
  viewsLast7Days: number;
  viewsLast30Days: number;
  viewsByPage: Array<{ page: string; views: number }>;
  viewsByDay: Array<{ date: string; views: number }>;
}

export interface VitrineContact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  replyText: string | null;
  repliedAt: string | null;
  createdAt: string;
}

export interface VitrinePublicData {
  slug: string;
  config: VitrineConfig;
  pages: VitrinePage[];
  announcements: VitrineAnnouncement[];
  gallery: VitrineGalleryItem[];
}
