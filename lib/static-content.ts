import fs from 'fs';
import path from 'path';

const staticExportPath = path.join(process.cwd(), 'static-pages');

/**
 * Rename legacy Webflow class names, IDs, and data attributes to project-native equivalents.
 * Applied to static HTML content at load time so the raw export files don't need modification.
 */
function transformClasses(html: string): string {
  // Class renames — longest-first to avoid partial matches
  const classRenames: [string, string][] = [
    // Container classes — remove (redundant with .container)
    ['w-layout-blockcontainer', ''],
    ['w-container', ''],
    // Form — specific before generic
    ['w-form-formradioinput--inputType-custom', 'radio-input--custom'],
    ['w-checkbox-input--inputType-custom', 'checkbox-input--custom'],
    ['w-backgroundvideo-backgroundvideoplaypausebutton', 'bg-video-play-pause'],
    ['w-background-video--control', 'bg-video--control'],
    ['w-background-video-atom', 'bg-video-atom'],
    ['w-background-video', 'bg-video'],
    ['w-checkbox-input', 'checkbox-input'],
    ['w-checkbox', 'checkbox'],
    ['w-form-done', 'form-success'],
    ['w-form-fail', 'form-error'],
    ['w-form-label', 'form-label'],
    ['w-form', 'form-block'],
    ['w-input', 'form-input'],
    ['w-select', 'form-select'],
    ['w-button', 'form-submit'],
    ['w-inline-block', 'inline-block'],
    // Collection
    ['w-dyn-bind-empty', 'collection-bind-empty'],
    ['w-dyn-empty', 'collection-empty'],
    ['w-dyn-items', 'collection-items'],
    ['w-dyn-item', 'collection-item'],
    ['w-dyn-list', 'collection-list'],
    ['w-dyn-hide', 'collection-hide'],
    // Tabs
    ['w-tab-content', 'tab-content'],
    ['w-tab-link', 'tab-link'],
    ['w-tab-pane', 'tab-pane'],
    ['w-tab-menu', 'tab-menu'],
    ['w-tabs', 'tabs'],
    // State
    ['w--redirected-checked', 'is-checked'],
    ['w--redirected-focus', 'is-focused'],
    ['w--tab-active', 'is-tab-active'],
    ['w--current', 'is-active'],
    ['w--open', 'is-open'],
    // Content
    ['w-richtext', 'richtext'],
    ['w-embed', 'embed'],
    ['w-hidden', 'is-hidden'],
    // Dropdown
    ['w-dropdown-toggle', 'dropdown-toggle'],
    ['w-dropdown-list', 'dropdown-list'],
    ['w-dropdown', 'dropdown'],
    // Media
    ['w-radio-input', 'radio-input'],
    ['w-radio', 'radio'],
    ['w-iframe', 'iframe'],
    // Nav (appears in HTML before static-content strips it, but rename anyway for completeness)
    ['w-nav-overlay-0', 'nav-overlay'],
    ['w-nav-button', 'nav-button'],
    ['w-nav-link', 'nav-link'],
    ['w-nav-menu', 'nav-menu'],
    ['w-nav-brand', 'nav-brand'],
    ['w-nav', 'nav-block'],
    // Utility
    ['w-condition-invisible', 'is-invisible'],
    ['wf-layout-layout', 'grid-layout'],
  ];

  let result = html;

  // Apply class renames as whole-word replacements
  for (const [oldClass, newClass] of classRenames) {
    const escaped = oldClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'g');
    result = result.replace(regex, newClass);
  }

  // Clean up double/trailing spaces in class attributes
  result = result.replace(/class="([^"]*)"/g, (_match, classes: string) => {
    const cleaned = classes.replace(/\s+/g, ' ').trim();
    return `class="${cleaned}"`;
  });

  // ID renames: w-node-* → node-*, wf-form-* → form-*
  result = result.replace(/id="w-node-/g, 'id="node-');
  result = result.replace(/id="wf-form-/g, 'id="form-');
  result = result.replace(/name="wf-form-/g, 'name="form-');

  // Variant class rename: w-variant-* → variant-*
  result = result.replace(/\bw-variant-/g, 'variant-');

  // Data attribute renames
  result = result.replace(/data-w-tab=/g, 'data-tab=');
  result = result.replace(/data-w-id=/g, 'data-id=');

  // Remove data-wf-* attributes (not used in CSS or JS)
  result = result.replace(/\s*data-wf-[a-z-]+="[^"]*"/g, '');

  return result;
}

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
      return transformClasses(content.trim());
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

  // Transform legacy class names to project-native equivalents
  content = transformClasses(content);

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
