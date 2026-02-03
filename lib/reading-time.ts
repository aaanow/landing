/**
 * Utility for calculating reading time from Lexical rich text content
 */

interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
}

interface LexicalContent {
  root?: LexicalNode;
}

const WORDS_PER_MINUTE = 225;

/**
 * Recursively extracts all text content from a Lexical node tree
 */
function extractText(node: LexicalNode): string {
  if (node.type === 'text' && node.text) {
    return node.text;
  }

  if (node.children) {
    return node.children.map(extractText).join(' ');
  }

  return '';
}

/**
 * Counts words in a string
 */
function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Calculates the estimated reading time for Lexical rich text content
 * @param content - Lexical content object
 * @returns Reading time in minutes (minimum 1)
 */
export function calculateReadingTime(content: unknown): number {
  if (!content || typeof content !== 'object') {
    return 1;
  }

  const lexicalContent = content as LexicalContent;

  if (!lexicalContent.root) {
    return 1;
  }

  const text = extractText(lexicalContent.root);
  const wordCount = countWords(text);
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return Math.max(1, minutes);
}

/**
 * Formats reading time as a human-readable string
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
