/**
 * CMS Types - Centralized type definitions for Payload CMS collections
 */

// Media (Vercel Blob-backed upload)
export interface Media {
  id: string;
  url: string;
  alt: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}

/** Extract URL from a populated media field (object) or unpopulated (string ID). */
export function getMediaUrl(media: Media | string | undefined | null): string | undefined {
  if (!media) return undefined;
  if (typeof media === 'string') return undefined; // unpopulated ID — no URL available
  return media.url;
}

// Base interface for CMS items
export interface BaseItem {
  id: string;
  name: string;
  slug: string;
  _status?: 'draft' | 'published';
}

// Lexical editor content types
export interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
  format?: string | number;
  tag?: string;
  listType?: string;
  url?: string;
  fields?: {
    url?: string;
    newTab?: boolean;
  };
}

export interface LexicalContent {
  root: LexicalNode;
}

// Blog posts collection
export interface Post {
  id: string;
  title: string;
  slug: string;
  featuredImage?: Media | string;
  excerpt?: string;
  content?: LexicalContent;
  publishedAt?: string;
  _status?: 'draft' | 'published';
  category?: string;
  tags?: string[];
  author?: { id: string; email: string; name?: string } | string;
  externalLink?: string;
  meta?: {
    title?: string;
    description?: string;
  };
}

// Popups collection (used for about pages)
export interface Popup extends BaseItem {
  icon?: Media | string;
  image?: Media | string;
  shortDescription?: string;
  content?: LexicalContent;
  link?: string;
  aboutPage?: string;
}

// Pages collection (used for audience pages)
export interface Page {
  id: string;
  title: string;
  slug: string;
  subheading?: string;
  content?: LexicalContent;
  quote?: string;
  quoteAuthor?: string;
  popups?: Popup[] | string[];
  sidebarImage?: Media | string;
  sidebarQuote?: string;
  meta?: {
    title?: string;
    description?: string;
  };
  _status?: 'draft' | 'published';
}

// Legal pages collection
export interface LegalPage extends BaseItem {
  content?: LexicalContent;
  order?: number;
}

// Resource chapters collection
export interface ResourceChapter {
  id: string;
  name: string;
  slug: string;
  order?: number;
}

// FAQs collection
export interface FAQ {
  id: string;
  question: string;
  slug: string;
  answer?: LexicalContent;
  order?: number;
  showOnLanding?: boolean;
}

// Resources collection
export interface Resource extends BaseItem {
  chapter?: ResourceChapter | string;
  snippet?: string;
  order?: number;
  richText?: LexicalContent;
  quote?: string;
  tag?: string;
  pdf?: string;
  icon?: string;
  blogArticle?: string;
  externalLink?: string;
  type?: 'blog-post' | 'external-link' | 'resource';
  location?: string;
}

// Scorecards collection
export interface Scorecard extends BaseItem {
  link?: string;
}

// Product panels
export interface ProductPanel {
  heading: string;
  content?: LexicalContent;
  buttonLabel?: string;
  buttonLink?: string;
  panelColor?: 'default' | 'dark-green' | 'light-green' | 'purple';
  mediaType?: 'image' | 'video';
  image?: Media | string;
  videoUrl?: string;
  id?: string;
}

// Products collection
export interface Product {
  id: string;
  title: string;
  slug: string;
  subheading?: string;
  panels?: ProductPanel[];
  meta?: {
    title?: string;
    description?: string;
  };
  _status?: 'draft' | 'published';
}

// Navigation global
export interface NavLink {
  label: string;
  href: string;
  id?: string;
}

export interface NavigationGlobal {
  links?: NavLink[];
  ctaLabel?: string;
}

// Footer global
export interface FooterLink {
  label: string;
  linkType: 'internal' | 'external';
  reference?: {
    relationTo: 'pages' | 'popups' | 'legals' | 'scorecards' | 'posts';
    value: { slug: string; name?: string; title?: string; link?: string } | string;
  };
  url?: string;
  indent?: boolean;
  id?: string;
}

export interface FooterLinkGroup {
  title: string;
  links?: FooterLink[];
  id?: string;
}

export interface FooterGlobal {
  linkGroups?: FooterLinkGroup[];
  disclaimerText?: string;
  copyrightText?: string;
  logo?: string;
  attributionText?: string;
  attributionLink?: string;
}

// Testimonials & Logos global
export interface CaseStudy {
  quote: string;
  logo?: Media | string;
  image?: Media | string;
  linkLabel?: string;
  linkHref?: string;
  id?: string;
}

export interface ClientLogo {
  image: Media | string;
  alt?: string;
  link?: string;
  id?: string;
}

export interface TestimonialsGlobal {
  heading?: string;
  subheading?: string;
  caseStudies?: CaseStudy[];
  clientLogosHeading?: string;
  clientLogos?: ClientLogo[];
}

// Logo Marquee global
export interface MarqueeLogo {
  image: Media | string;
  alt?: string;
  link?: string;
  id?: string;
}

export interface LogoMarqueeGlobal {
  heading?: string;
  logos?: MarqueeLogo[];
  speed?: number;
  direction?: 'forward' | 'backward';
}

// Hero global
export interface HeroTag {
  label: string;
  icon?: Media | string;
  id?: string;
}

export interface HeroSlide {
  image: Media | string;
  alt?: string;
  id?: string;
}

export interface HeroGlobal {
  pillText?: string;
  pillIcon?: Media | string;
  title?: string;
  subtitle?: string;
  tags?: HeroTag[];
  slides?: HeroSlide[];
  autoplayDuration?: number;
  videoUrl?: string;
}

// How It Works global
export interface HowItWorksStep {
  label: string
  title: string
  description?: string
  id?: string
}

export interface HowItWorksTab {
  number: string
  timeLabel: string
  outcomeLabel: string
  actionTitle: string
  actionDescription?: string
  steps?: HowItWorksStep[]
  outcomeTitle?: string
  outcomeDescription?: string
  image?: Media | string
  id?: string
}

export interface HowItWorksGlobal {
  heading?: string
  tabs?: HowItWorksTab[]
}

// CTA global
export interface CTAGlobal {
  heading?: string;
  body?: string;
  buttonText?: string;
  buttonAction?: 'modal' | 'link';
  buttonLink?: string;
}

// Research Stats global
export interface ResearchStat {
  value: string;
  description: string;
  id?: string;
}

export interface ResearchStatsGlobal {
  heading?: string;
  stats?: ResearchStat[];
  ctaText?: string;
  ctaLink?: string;
}

// Resource Sidebar global
export interface ResourceSidebarItem {
  name: string;
  icon?: 'document' | 'pdf';
  url?: string;
  id?: string;
}

export interface ResourceSidebarGlobal {
  items?: ResourceSidebarItem[];
}

// Page props for dynamic routes (Next.js 15 pattern)
export interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}
