'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLenis } from '@/components/AnimationProvider';
import type { LexicalContent, LexicalNode } from '@/types/cms';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractText(node: LexicalNode): string {
  if (node.text) return node.text;
  if (node.children) return node.children.map(extractText).join('');
  return '';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractHeadings(content: LexicalContent): TocItem[] {
  const headings: TocItem[] = [];
  if (!content?.root?.children) return headings;

  for (const node of content.root.children) {
    if (node.type === 'heading' && node.tag) {
      const level = parseInt(node.tag.replace('h', ''), 10);
      if (level >= 1 && level <= 3) {
        const text = extractText(node);
        if (text.trim()) {
          headings.push({
            id: slugify(text),
            text: text.trim(),
            level,
          });
        }
      }
    }
  }

  return headings;
}

interface TableOfContentsProps {
  content: LexicalContent;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const lenis = useLenis();
  const headings = extractHeadings(content);

  const handleScroll = useCallback(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    // Find the heading closest to the top of the viewport
    let current = '';
    for (const el of headingElements) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) {
        current = el.id;
      } else {
        break;
      }
    }

    setActiveId(current);
  }, [headings]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (headings.length < 2) return null;

  // Find the minimum heading level to normalize indentation
  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav className="toc" aria-label="Table of contents">
      <ul className="toc__list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc__item toc__item--level-${heading.level - minLevel}${activeId === heading.id ? ' toc__item--active' : ''}`}
          >
            <a
              href={`#${heading.id}`}
              className="toc__link"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  lenis?.scrollTo(el, { offset: -100 });
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
