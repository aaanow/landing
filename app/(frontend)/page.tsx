import { getStaticPageContent } from '@/lib/static-content';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { LogoMarquee } from '@/components/LogoMarqueeServer';
import { HeroSection } from '@/components/HeroSection';
import { CTASection } from '@/components/CTASection';
import { HowItWorksSectionServer } from '@/components/HowItWorksSectionServer';
import { StatsSection } from '@/components/StatsSection';

const STATS_MARKER = '<!-- STATS_SECTION -->';
const HOW_IT_WORKS_MARKER = '<!-- HOW_IT_WORKS_SECTION -->';
const TESTIMONIALS_MARKER = '<!-- TESTIMONIALS_SECTION -->';

export default function Home() {
  const pageContent = getStaticPageContent('index.html');

  // Split around stats marker to inject React component
  const [beforeStats, afterStats = ''] = pageContent.split(STATS_MARKER);

  // Split around how-it-works marker
  const [betweenStatsAndHIW, afterHIW = ''] = afterStats.split(HOW_IT_WORKS_MARKER);

  // Split remaining content for testimonials
  const [middleContent, afterTestimonials] = afterHIW.split(TESTIMONIALS_MARKER);

  return (
    <>
      <HeroSection />
      {beforeStats && <div dangerouslySetInnerHTML={{ __html: beforeStats }} />}
      {betweenStatsAndHIW && <div dangerouslySetInnerHTML={{ __html: betweenStatsAndHIW }} />}
      <HowItWorksSectionServer />
      {middleContent && <div dangerouslySetInnerHTML={{ __html: middleContent }} />}
      {afterTestimonials !== undefined && <TestimonialsSection />}
      {afterTestimonials && <div dangerouslySetInnerHTML={{ __html: afterTestimonials }} />}
      <LogoMarquee />
      <StatsSection />
      <CTASection />
    </>
  );
}
