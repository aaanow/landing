import fs from 'fs';
import path from 'path';

const webflowExportPath = path.join(process.cwd(), 'webflow export');

/**
 * Extract the page content from a Webflow HTML file
 * Returns the content inside .page__wrapper (excluding nav and scripts)
 */
export function getWebflowPageContent(htmlFileName: string): string {
  const filePath = path.join(webflowExportPath, htmlFileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`Webflow HTML file not found: ${filePath}`);
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
  content = content.replace(/href="([^"]+)\.html"/g, (match, p1) => {
    // Handle nested paths
    return `href="/${p1}"`;
  });

  return content;
}

/**
 * Get the list of all HTML files in the Webflow export
 */
export function getWebflowHtmlFiles(): string[] {
  if (!fs.existsSync(webflowExportPath)) {
    return [];
  }

  return fs.readdirSync(webflowExportPath)
    .filter(file => file.endsWith('.html'));
}
