/**
 * Convert an HTML string to a Payload Lexical rich-text JSON structure.
 * Properly parses HTML elements into Lexical nodes preserving formatting.
 *
 * All nodes include the full set of properties required by the Payload
 * Lexical editor so that imported content is editable in the admin panel.
 */

interface LexicalTextNode {
  type: 'text';
  text: string;
  format: number;
  detail: number;
  mode: 'normal';
  style: string;
  version: 1;
}

interface LexicalLinebreakNode {
  type: 'linebreak';
  version: 1;
}

interface LexicalBlockNode {
  type: string;
  children: LexicalAnyNode[];
  direction: 'ltr';
  format: string;
  indent: number;
  version: 1;
  tag?: string;
  listType?: string;
  start?: number;
  value?: number;
  textFormat?: number;
  textStyle?: string;
}

type LexicalAnyNode = LexicalTextNode | LexicalLinebreakNode | LexicalBlockNode;

// Lexical format bit flags
const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;
const FORMAT_STRIKETHROUGH = 4;
const FORMAT_UNDERLINE = 8;
const FORMAT_CODE = 16;

function decodeEntities(str: string): string {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function makeText(text: string, format = 0): LexicalTextNode {
  return {
    type: 'text',
    text: decodeEntities(text),
    format,
    detail: 0,
    mode: 'normal',
    style: '',
    version: 1,
  };
}

function makeBlock(
  type: string,
  children: LexicalAnyNode[],
  extra?: Partial<LexicalBlockNode>,
): LexicalBlockNode {
  return {
    type,
    children: children.length > 0 ? children : [makeText('')],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    ...extra,
  };
}

/**
 * Simple recursive HTML parser that converts HTML elements into Lexical nodes.
 * Uses regex-based tag matching for lightweight parsing without DOM dependencies.
 */
function parseInline(html: string, parentFormat = 0): LexicalAnyNode[] {
  const nodes: LexicalAnyNode[] = [];
  let remaining = html;

  while (remaining.length > 0) {
    // Find the next HTML tag
    const tagMatch = remaining.match(
      /^([\s\S]*?)<(\/?)(\w+)([^>]*)>/,
    );

    if (!tagMatch) {
      // No more tags, add remaining text
      const text = remaining.trim() ? remaining : remaining;
      if (text) {
        nodes.push(makeText(text, parentFormat));
      }
      break;
    }

    const [fullMatch, before, isClosing, tagName, attrs] = tagMatch;
    const tag = tagName.toLowerCase();

    // Add text before the tag
    if (before) {
      nodes.push(makeText(before, parentFormat));
    }

    if (isClosing) {
      // Closing tag — stop here and return what we have
      remaining = remaining.slice(fullMatch.length);
      break;
    }

    // Self-closing tags
    if (tag === 'br' || attrs.endsWith('/')) {
      nodes.push({ type: 'linebreak', version: 1 });
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    if (tag === 'img') {
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    // Find the matching closing tag
    remaining = remaining.slice(fullMatch.length);
    const closePattern = new RegExp(`^([\\s\\S]*?)<\\/${tag}>`, 'i');
    const closeMatch = remaining.match(closePattern);

    if (!closeMatch) {
      // No closing tag found, treat as self-closing
      continue;
    }

    const innerHtml = closeMatch[1];
    remaining = remaining.slice(closeMatch[0].length);

    // Handle inline formatting tags
    switch (tag) {
      case 'strong':
      case 'b':
        nodes.push(...parseInline(innerHtml, parentFormat | FORMAT_BOLD));
        break;
      case 'em':
      case 'i':
        nodes.push(...parseInline(innerHtml, parentFormat | FORMAT_ITALIC));
        break;
      case 'u':
        nodes.push(...parseInline(innerHtml, parentFormat | FORMAT_UNDERLINE));
        break;
      case 's':
      case 'del':
      case 'strike':
        nodes.push(...parseInline(innerHtml, parentFormat | FORMAT_STRIKETHROUGH));
        break;
      case 'code':
        nodes.push(...parseInline(innerHtml, parentFormat | FORMAT_CODE));
        break;
      case 'sup':
        nodes.push(...parseInline(innerHtml, parentFormat));
        break;
      case 'a': {
        const hrefMatch = attrs.match(/href=["']([^"']*)["']/);
        const href = hrefMatch ? decodeEntities(hrefMatch[1]) : '#';
        const targetMatch = attrs.match(/target=["']([^"']*)["']/);
        const newTab = targetMatch?.[1] === '_blank';
        const linkNode: LexicalBlockNode = {
          type: 'link',
          children: parseInline(innerHtml, parentFormat),
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        };
        // Add fields for the link
        (linkNode as unknown as Record<string, unknown>).fields = { url: href, newTab };
        nodes.push(linkNode);
        break;
      }
      case 'span':
        // Pass through spans, preserving any inherited format
        nodes.push(...parseInline(innerHtml, parentFormat));
        break;
      default:
        // Unknown inline tag, just parse its contents
        nodes.push(...parseInline(innerHtml, parentFormat));
        break;
    }
  }

  return nodes;
}

function parseBlocks(html: string): LexicalAnyNode[] {
  const blocks: LexicalAnyNode[] = [];
  let remaining = html.trim();

  while (remaining.length > 0) {
    // Match the next block-level opening tag
    const blockMatch = remaining.match(
      /^[\s]*<(p|h[1-6]|blockquote|ul|ol|li|div|figure|figcaption|hr|table)([^>]*)>/i,
    );

    if (!blockMatch) {
      // No block tag found — treat remaining as inline content in a paragraph
      const text = remaining.replace(/<[^>]*>/g, '').trim();
      if (text) {
        blocks.push(makeBlock('paragraph', [makeText(text)], { textFormat: 0, textStyle: '' }));
      }
      break;
    }

    // Skip any text before the block tag
    const beforeBlock = remaining.slice(0, blockMatch.index).trim();
    if (beforeBlock) {
      const cleanText = beforeBlock.replace(/<[^>]*>/g, '').trim();
      if (cleanText) {
        blocks.push(makeBlock('paragraph', parseInline(beforeBlock), { textFormat: 0, textStyle: '' }));
      }
    }

    const tag = blockMatch[1].toLowerCase();
    remaining = remaining.slice((blockMatch.index || 0) + blockMatch[0].length);

    // Self-closing block elements
    if (tag === 'hr') {
      blocks.push(makeBlock('paragraph', [makeText('---')], { textFormat: 0, textStyle: '' }));
      continue;
    }

    // Find matching closing tag (handle nesting for lists)
    const innerContent = extractUntilClose(remaining, tag);
    remaining = innerContent.rest;

    switch (tag) {
      case 'p':
      case 'div':
      case 'figcaption': {
        const inlineNodes = parseInline(innerContent.inner);
        if (inlineNodes.length > 0 || innerContent.inner.trim()) {
          blocks.push(makeBlock('paragraph', inlineNodes.length > 0 ? inlineNodes : [makeText('')], { textFormat: 0, textStyle: '' }));
        }
        break;
      }
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const inlineNodes = parseInline(innerContent.inner);
        blocks.push(makeBlock('heading', inlineNodes.length > 0 ? inlineNodes : [makeText('')], { tag }));
        break;
      }
      case 'blockquote': {
        const inlineNodes = parseInline(innerContent.inner.replace(/<\/?p[^>]*>/gi, ''));
        blocks.push(makeBlock('quote', inlineNodes.length > 0 ? inlineNodes : [makeText('')]));
        break;
      }
      case 'ul':
      case 'ol': {
        const listItems = parseListItems(innerContent.inner);
        const listType = tag === 'ul' ? 'bullet' : 'number';
        blocks.push(makeBlock('list', listItems, { listType, start: 1, tag }));
        break;
      }
      case 'table': {
        const rows = parseTableRows(innerContent.inner);
        blocks.push(makeBlock('table', rows));
        break;
      }
      case 'figure': {
        // Skip figures (images) — could be enhanced later
        break;
      }
      default:
        break;
    }
  }

  return blocks;
}

function extractUntilClose(html: string, tag: string): { inner: string; rest: string } {
  let depth = 1;
  let pos = 0;
  const openPattern = new RegExp(`<${tag}[\\s>]`, 'gi');
  const closePattern = new RegExp(`</${tag}>`, 'gi');

  while (depth > 0 && pos < html.length) {
    openPattern.lastIndex = pos;
    closePattern.lastIndex = pos;

    const nextOpen = openPattern.exec(html);
    const nextClose = closePattern.exec(html);

    if (!nextClose) {
      // No closing tag found, treat rest as inner content
      return { inner: html.slice(0, html.length), rest: '' };
    }

    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++;
      pos = nextOpen.index + nextOpen[0].length;
    } else {
      depth--;
      if (depth === 0) {
        return {
          inner: html.slice(0, nextClose.index),
          rest: html.slice(nextClose.index + nextClose[0].length),
        };
      }
      pos = nextClose.index + nextClose[0].length;
    }
  }

  return { inner: html, rest: '' };
}

function parseListItems(html: string): LexicalAnyNode[] {
  const items: LexicalAnyNode[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  let itemIndex = 1;

  while ((match = liRegex.exec(html)) !== null) {
    const inlineNodes = parseInline(match[1].replace(/<\/?p[^>]*>/gi, ''));
    items.push(makeBlock('listitem', inlineNodes.length > 0 ? inlineNodes : [makeText('')], { value: itemIndex }));
    itemIndex++;
  }

  return items.length > 0 ? items : [makeBlock('listitem', [makeText('')], { value: 1 })];
}

function parseTableRows(html: string): LexicalAnyNode[] {
  const rows: LexicalAnyNode[] = [];
  // Match rows from thead, tbody, or directly under table
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;

  while ((trMatch = trRegex.exec(html)) !== null) {
    const cells: LexicalAnyNode[] = [];
    const cellRegex = /<(th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
      const isHeader = cellMatch[1].toLowerCase() === 'th';
      const cellContent = cellMatch[2].replace(/<\/?p[^>]*>/gi, '');
      const inlineNodes = parseInline(cellContent);
      const cellNode = makeBlock('tablecell', [
        makeBlock('paragraph', inlineNodes.length > 0 ? inlineNodes : [makeText('')], { textFormat: 0, textStyle: '' }),
      ]);
      (cellNode as unknown as Record<string, unknown>).headerState = isHeader ? 1 : 0;
      cells.push(cellNode);
    }

    if (cells.length > 0) {
      rows.push(makeBlock('tablerow', cells));
    }
  }

  return rows.length > 0 ? rows : [makeBlock('tablerow', [makeBlock('tablecell', [makeBlock('paragraph', [makeText('')], { textFormat: 0, textStyle: '' })])])];
}

export function htmlToLexical(html: string) {
  if (!html || html.trim() === '') {
    return {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [makeText('')],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            textStyle: '',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    };
  }

  const blocks = parseBlocks(html);

  if (blocks.length === 0) {
    blocks.push(makeBlock('paragraph', [makeText('')], { textFormat: 0, textStyle: '' }));
  }

  return {
    root: {
      type: 'root',
      children: blocks,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  };
}
