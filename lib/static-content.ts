import fs from 'fs';
import path from 'path';

const staticExportPath = path.join(process.cwd(), 'webflow export');

/**
 * Extract the page content from a static HTML file
 * Returns the content inside .page__wrapper (excluding nav and scripts)
 */
export function getStaticPageContent(htmlFileName: string): string {
  const filePath = path.join(staticExportPath, htmlFileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`Static HTML file not found: ${filePath}`);
    return '';
  }

  const html = fs.readFileSync(filePath, 'utf-8');

  // Extract content between <div class="page__wrapper"> and closing </div> before scripts
  const pageWrapperStart = html.indexOf('<div class="page__wrapper">');
  if (pageWrapperStart === -1) {
    // Try to find just the body content
    const bodyStart = html.indexOf('<body');
    const bodyEnd = html.indexOf('</body>');
    if (bodyStart !== -1 && bodyEnd !== -1) {
      const bodyContentStart = html.indexOf('>', bodyStart) + 1;
      let content = html.substring(bodyContentStart, bodyEnd);
      // Remove nav element
      content = content.replace(/<div[^>]*class="[^"]*w-nav[^"]*"[^>]*>[\s\S]*?<\/nav>\s*<\/div>\s*<\/div>/gi, '');
      // Remove script tags
      content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
      return content.trim();
    }
    return '';
  }

  const contentStart = pageWrapperStart + '<div class="page__wrapper">'.length;

  // Find the end of page__wrapper - it's the </div> before the first <script> tag
  const scriptsStart = html.indexOf('<script', contentStart);
  const endDiv = html.lastIndexOf('</div>', scriptsStart);

  if (endDiv === -1) {
    return '';
  }

  let content = html.substring(contentStart, endDiv).trim();

  // Fix image paths - change "images/" to "/images/"
  content = content.replace(/src="images\//g, 'src="/images/');
  content = content.replace(/srcset="images\//g, 'srcset="/images/');

  // Fix href links - convert .html to / routes
  content = content.replace(/href="index\.html"/g, 'href="/"');
  content = content.replace(/href="([^"]+)\.html"/g, (_match, p1) => {
    // Handle nested paths
    return `href="/${p1}"`;
  });

  // Remove footer section (it's rendered by the layout)
  content = content.replace(/<section[^>]*class="[^"]*footer[^"]*"[^>]*>[\s\S]*?<\/section>/gi, '');

  // Remove CTA section (it's rendered by the CTASection component)
  content = content.replace(/<section[^>]*class="[^"]*section sticky last[^"]*"[^>]*>[\s\S]*?<\/section>/gi, '');

  // Strip stats section content between markers (replaced by StatsSection React component)
  // Keep the start marker so page.tsx can split on it to position the React component
  const statsStart = '<!-- STATS_SECTION -->';
  const statsEnd = '<!-- STATS_END -->';
  const statsStartIdx = content.indexOf(statsStart);
  const statsEndIdx = content.indexOf(statsEnd);
  if (statsStartIdx !== -1 && statsEndIdx !== -1) {
    content =
      content.substring(0, statsStartIdx + statsStart.length) +
      content.substring(statsEndIdx + statsEnd.length);
  }

  // Strip how-it-works section content between markers (replaced by HowItWorksSection React component)
  // Keep the start marker so page.tsx can split on it to position the React component
  const hiwStart = '<!-- HOW_IT_WORKS_SECTION -->';
  const hiwEnd = '<!-- HOW_IT_WORKS_END -->';
  const hiwStartIdx = content.indexOf(hiwStart);
  const hiwEndIdx = content.indexOf(hiwEnd);
  if (hiwStartIdx !== -1 && hiwEndIdx !== -1) {
    content =
      content.substring(0, hiwStartIdx + hiwStart.length) +
      content.substring(hiwEndIdx + hiwEnd.length);
  }

  // Strip testimonials section content between markers (replaced by TestimonialsSection React component)
  // Keep the start marker so page.tsx can split on it to position the React component
  const testStart = '<!-- TESTIMONIALS_SECTION -->';
  const testEnd = '<!-- TESTIMONIALS_END -->';
  const testStartIdx = content.indexOf(testStart);
  const testEndIdx = content.indexOf(testEnd);
  if (testStartIdx !== -1 && testEndIdx !== -1) {
    content =
      content.substring(0, testStartIdx + testStart.length) +
      content.substring(testEndIdx + testEnd.length);
  }

  return content;
}

/**
 * Get the list of all HTML files in the static export
 */
export function getStaticHtmlFiles(): string[] {
  if (!fs.existsSync(staticExportPath)) {
    return [];
  }

  return fs.readdirSync(staticExportPath)
    .filter(file => file.endsWith('.html'));
}
