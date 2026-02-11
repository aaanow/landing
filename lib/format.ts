/**
 * Formatting utilities
 */

/**
 * Format a date string for display
 * @param dateString - ISO date string or undefined
 * @returns Formatted date string (e.g., "January 15, 2024") or empty string
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
