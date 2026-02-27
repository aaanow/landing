import { HeroSectionSimple } from '@/components/HeroSectionSimple';
import { VideoShowcaseSection } from '@/components/VideoShowcaseSection';
import { getPayloadClient } from '@/src/payload';

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
