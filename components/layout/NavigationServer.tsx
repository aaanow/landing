import { getPayloadClient } from '@/src/payload';
import type { NavigationGlobal } from '@/types/cms';
import { NavigationClient } from './Navigation';

export async function Navigation() {
  let nav: NavigationGlobal = {};

  try {
    const payload = await getPayloadClient();
    nav = await payload.findGlobal({ slug: 'navigation' }) as NavigationGlobal;
  } catch (error) {
    console.error('Navigation: Failed to fetch navigation global:', error);
  }

  const { links, ctaLabel } = nav;

  return <NavigationClient links={links} ctaLabel={ctaLabel} />;
}
