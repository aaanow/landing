'use client';

import React, { createElement, Fragment } from 'react';
import type { LexicalNode, LexicalContent } from '@/types/cms';

interface RichTextProps {
  content: LexicalContent | null | undefined;
  className?: string;
}

// Lexical format bit flags
const FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
  SUBSCRIPT: 32,
  SUPERSCRIPT: 64,
} as const;

function applyTextFormat(text: string, format: number, key: number): React.ReactNode {
  let element: React.ReactNode = text;

  if (format & FORMAT.BOLD) element = <strong key={`bold-${key}`}>{element}</strong>;
  if (format & FORMAT.ITALIC) element = <em key={`italic-${key}`}>{element}</em>;
  if (format & FORMAT.UNDERLINE) element = <u key={`underline-${key}`}>{element}</u>;
  if (format & FORMAT.STRIKETHROUGH) element = <s key={`strike-${key}`}>{element}</s>;
  if (format & FORMAT.CODE) element = <code key={`code-${key}`}>{element}</code>;
  if (format & FORMAT.SUBSCRIPT) element = <sub key={`sub-${key}`}>{element}</sub>;
  if (format & FORMAT.SUPERSCRIPT) element = <sup key={`sup-${key}`}>{element}</sup>;

  return element;
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  const { type, text, children, format, tag, listType, url, fields } = node;
  const renderChildren = () => children?.map((c, i) => renderNode(c, i));

  switch (type) {
    case 'text': {
      const formatNum = typeof format === 'number' ? format : 0;
      return formatNum > 0 ? applyTextFormat(text || '', formatNum, index) : text;
    }

    case 'linebreak':
      return <br key={index} />;

    case 'paragraph':
      return <p key={index}>{renderChildren()}</p>;

    case 'heading': {
      const level = tag || 'h2';
      return createElement(level, { key: index }, renderChildren());
    }

    case 'list': {
      const listTag = listType === 'bullet' || format === 'ul' ? 'ul' : 'ol';
      return createElement(listTag, { key: index }, renderChildren());
    }

    case 'listitem':
      return <li key={index}>{renderChildren()}</li>;

    case 'link':
    case 'autolink': {
      const href = fields?.url || url || '#';
      const linkProps = fields?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
      return (
        <a key={index} href={href} {...linkProps}>
          {renderChildren()}
        </a>
      );
    }

    case 'quote':
      return <blockquote key={index}>{renderChildren()}</blockquote>;

    case 'table':
      return (
        <div key={index} className="rich-text-table-wrapper">
          <table>{renderChildren()}</table>
        </div>
      );

    case 'tablerow':
      return <tr key={index}>{renderChildren()}</tr>;

    case 'tablecell': {
      const headerState = (node as unknown as Record<string, unknown>).headerState;
      const Tag = headerState === 1 ? 'th' : 'td';
      return <Tag key={index}>{renderChildren()}</Tag>;
    }

    case 'upload': {
      const value = (node as unknown as Record<string, unknown>).value as
        | { url?: string; alt?: string }
        | undefined;
      if (value?.url) {
        return (
          <figure key={index}>
            <img src={value.url} alt={value.alt || ''} loading="lazy" />
          </figure>
        );
      }
      return null;
    }

    case 'root':
      return <Fragment key={index}>{renderChildren()}</Fragment>;

    default:
      return renderChildren() || null;
  }
}

export function RichText({ content, className }: RichTextProps) {
  if (!content?.root) return null;

  const rendered = content.root.children?.map((c, i) => renderNode(c, i));

  if (className) {
    return <div className={className}>{rendered}</div>;
  }

  return <>{rendered}</>;
}
