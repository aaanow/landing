/**
 * CMS Types - Centralized type definitions for Payload CMS collections
 */

// Base interface for all CMS items
export interface BaseItem {
  id: string;
  name: string;
  slug: string;
  status?: 'draft' | 'published';
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
  featuredImage?: string;
  thumbnailImage?: string;
  excerpt?: string;
  content?: LexicalContent;
  publishedAt?: string;
  status?: 'draft' | 'published';
  category?: string;
  tag?: string;
  author?: string;
  externalLink?: string;
}

// Popups collection (used for about pages)
export interface Popup extends BaseItem {
  icon?: string;
  image?: string;
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
  sidebarImage?: string;
  sidebarQuote?: string;
  meta?: {
    title?: string;
    description?: string;
  };
  status?: 'draft' | 'published';
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

// Resources collection
export interface Resource extends BaseItem {
  chapter?: ResourceChapter | string;
  snippet?: string;
  order?: number;
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
  href: string;
  external?: boolean;
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
  logo?: string;
  image?: string;
  linkLabel?: string;
  linkHref?: string;
  id?: string;
}

export interface ClientLogo {
  image: string;
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

// Page props for dynamic routes (Next.js 15 pattern)
export interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}
