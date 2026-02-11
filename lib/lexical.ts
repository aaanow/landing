/**
 * Convert an HTML string to a Payload Lexical rich-text JSON structure.
 * Splits on block-level closing tags and decodes common HTML entities.
 */
export function htmlToLexical(html: string) {
  if (!html || html.trim() === '') {
    return {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: '', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  const blocks = html.split(/<\/(?:p|h[1-6]|blockquote|li|ul|ol|figure|figcaption|div)>/gi)

  const children = blocks
    .map((block) => {
      const cleaned = block
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()

      if (!cleaned || cleaned === '\u200D') return null

      return {
        type: 'paragraph',
        children: [{ type: 'text', text: cleaned, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      }
    })
    .filter(Boolean)

  if (children.length === 0) {
    children.push({
      type: 'paragraph',
      children: [{ type: 'text', text: '', version: 1 }],
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      version: 1,
    })
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
