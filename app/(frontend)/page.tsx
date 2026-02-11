import { getStaticPageContent } from '@/lib/static-content';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { LogoMarquee } from '@/components/LogoMarqueeServer';
import { HeroSection } from '@/components/HeroSection';
import { CTASection } from '@/components/CTASection';
import { HowItWorksSection } from '@/components/HowItWorksSection';

const HOW_IT_WORKS_MARKER = '<!-- HOW_IT_WORKS_SECTION -->';
const TESTIMONIALS_MARKER = '<!-- TESTIMONIALS_SECTION -->';

export default function Home() {
  const pageContent = getStaticPageContent('index.html');

  // Split around how-it-works marker to inject React component
  const [beforeHIW, afterHIW = ''] = pageContent.split(HOW_IT_WORKS_MARKER);

  // Split remaining content for testimonials
  const [middleContent, afterTestimonials] = afterHIW.split(TESTIMONIALS_MARKER);

  return (
    <>
      <HeroSection />
      <LogoMarquee />
      <div dangerouslySetInnerHTML={{ __html: beforeHIW }} />
      <HowItWorksSection />
      {middleContent && <div dangerouslySetInnerHTML={{ __html: middleContent }} />}
      {afterTestimonials != null && <TestimonialsSection />}
      {afterTestimonials && <div dangerouslySetInnerHTML={{ __html: afterTestimonials }} />}
      <CTASection />
    </>
  );
}
