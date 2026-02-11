import { getPayloadClient } from '@/src/payload';
import type { NavigationGlobal } from '@/types/cms';
import { NavigationClient } from './Navigation';

export async function Navigation() {
  let links: NavigationGlobal['links'];
  let ctaLabel: NavigationGlobal['ctaLabel'];

  try {
    const payload = await getPayloadClient();
    const nav = await payload.findGlobal({ slug: 'navigation' }) as NavigationGlobal | null;
    links = nav?.links;
    ctaLabel = nav?.ctaLabel;
  } catch (error) {
    console.error('Navigation: Failed to fetch navigation global:', error);
  }

  return <NavigationClient links={links} ctaLabel={ctaLabel} />;
}
