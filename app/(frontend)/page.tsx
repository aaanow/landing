import type { Metadata } from 'next';
import { HeroSectionSimple } from '@/components/HeroSectionSimple';
import { VideoShowcaseSection } from '@/components/VideoShowcaseSection';
import { getPayloadClient } from '@/src/payload';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.title} — ${SITE_CONFIG.ogTitle}`,
  description: SITE_CONFIG.description,
};

export const revalidate = 300;

export default async function Home() {
  const payload = await getPayloadClient();
  const videoShowcase = await payload.findGlobal({ slug: 'video-showcase' });

  return (
    <>
      <HeroSectionSimple />
      <VideoShowcaseSection
        heading={videoShowcase.heading}
        videoUrl={videoShowcase.videoUrl}
      />
    </>
  );
}
