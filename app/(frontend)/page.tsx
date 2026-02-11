import { getStaticPageContent } from '@/lib/static-content';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { LogoMarquee } from '@/components/LogoMarqueeServer';
import { HeroSection } from '@/components/HeroSection';

const TESTIMONIALS_MARKER = '<!-- TESTIMONIALS_SECTION -->';

export default function Home() {
  const pageContent = getStaticPageContent('index.html');
  const parts = pageContent.split(TESTIMONIALS_MARKER);

  return (
    <>
      <HeroSection />
      <div dangerouslySetInnerHTML={{ __html: parts[0] }} />
      {parts.length > 1 && <LogoMarquee />}
      {parts.length > 1 && <TestimonialsSection />}
      {parts.length > 1 && <div dangerouslySetInnerHTML={{ __html: parts[1] }} />}
    </>
  );
}
