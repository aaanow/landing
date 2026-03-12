/**
 * Site configuration and constants
 */

export const SITE_CONFIG = {
  title: 'Scorecard by AAAnow',
  description:
    'The first solution to productise client retention and revenue growth for agencies. Use 3.7 trillion data points, and 25 years results to map Website Value and Risk - create actionable intelligence your commercial teams can use daily.',
  ogTitle: 'Scorecard — Fundamentals of online - confirmed',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aisc.aaanow.ai',
} as const;

export const EXTERNAL_URLS = {
  typekitId: 'rch0hpl',
  linkedin: 'https://www.linkedin.com/company/aaanow',
} as const;

export const NAV_LINKS = [
  { href: '/about-aisc', label: 'About' },
  { href: '/articles', label: 'Articles' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/lifecycle-alignment', label: 'Client Lifecycle' },
] as const;

// Note: ISR revalidation times must be literal numbers in page files
// Next.js requires static analysis of export const revalidate = <number>
// Standard values used: 300 (5 min), 3600 (1 hour), 86400 (24 hours)
