import type { Resource } from '@/types/cms';

// Icon mapping for resources
export const getIconPath = (icon: string | null | undefined) => {
  const iconMap: Record<string, string> = {
    'user': '/images/icon-user-1.svg',
    'happy': '/images/icon-happy.svg',
    'face': '/images/icon-face.svg',
    'light-bulb': '/images/icon-light-bulb.svg',
    'museum': '/images/icon-musuem.svg',
    'search': '/images/icon-search.svg',
    'pdf': '/images/icon-pdf.svg',
  };
  return icon && iconMap[icon] ? iconMap[icon] : '/images/icon-light-bulb.svg';
};

// Get the link for a resource based on its type
export const getResourceLink = (resource: Resource): string => {
  if (resource.externalLink) return resource.externalLink;
  if (resource.blogArticle) return resource.blogArticle;
  if (resource.pdf) return resource.pdf;
  return '#';
};

// Format resource type for display
export const formatResourceType = (resource: Resource): string => {
  if (resource.tag) return resource.tag;
  if (resource.type === 'blog-post') return 'Blog Post';
  if (resource.type === 'external-link') return 'External Link';
  if (resource.pdf) return 'PDF';
  return 'Resource';
};
