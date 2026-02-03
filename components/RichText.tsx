'use client';

import React from 'react';

interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
  format?: string | number;
  direction?: string;
  indent?: number;
  version?: number;
  tag?: string;
  listType?: string;
  url?: string;
  fields?: {
    url?: string;
    linkType?: string;
    newTab?: boolean;
  };
}

interface LexicalContent {
  root: LexicalNode;
}

interface RichTextProps {
  content: unknown;
  className?: string;
}

// Lexical format flags for text formatting
const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;

function renderTextWithFormat(text: string, format: number, index: number): React.ReactNode {
  let element: React.ReactNode = text;

  if (format & IS_BOLD) {
    element = <strong key={`bold-${index}`}>{element}</strong>;
  }
  if (format & IS_ITALIC) {
    element = <em key={`italic-${index}`}>{element}</em>;
  }
  if (format & IS_UNDERLINE) {
    element = <u key={`underline-${index}`}>{element}</u>;
  }
  if (format & IS_STRIKETHROUGH) {
    element = <s key={`strike-${index}`}>{element}</s>;
  }
  if (format & IS_CODE) {
    element = <code key={`code-${index}`}>{element}</code>;
  }
  if (format & IS_SUBSCRIPT) {
    element = <sub key={`sub-${index}`}>{element}</sub>;
  }
  if (format & IS_SUPERSCRIPT) {
    element = <sup key={`sup-${index}`}>{element}</sup>;
  }

  return element;
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === 'text') {
    const text = node.text || '';
    const format = typeof node.format === 'number' ? node.format : 0;

    if (format > 0) {
      return renderTextWithFormat(text, format, index);
    }
    return text;
  }

  if (node.type === 'linebreak') {
    return <br key={index} />;
  }

  if (node.type === 'paragraph') {
    const children = node.children?.map((child, i) => renderNode(child, i)) || [];
    return <p key={index}>{children}</p>;
  }

  if (node.type === 'heading') {
    const children = node.children?.map((child, i) => renderNode(child, i)) || [];
    const level = node.tag?.replace('h', '') || '2';
    switch (level) {
      case '1': return <h1 key={index}>{children}</h1>;
      case '2': return <h2 key={index}>{children}</h2>;
      case '3': return <h3 key={index}>{children}</h3>;
      case '4': return <h4 key={index}>{children}</h4>;
      case '5': return <h5 key={index}>{children}</h5>;
      case '6': return <h6 key={index}>{children}</h6>;
      default: return <h2 key={index}>{children}</h2>;
    }
  }

  if (node.type === 'list') {
    const children = node.children?.map((child, i) => renderNode(child, i)) || [];
    const listType = node.listType || node.format;
    const Tag = listType === 'bullet' || listType === 'ul' ? 'ul' : 'ol';
    return <Tag key={index}>{children}</Tag>;
  }

  if (node.type === 'listitem') {
    const children = node.children?.map((child, i) => renderNode(child, i)) || [];
    return <li key={index}>{children}</li>;
  }

  if (node.type === 'link' || node.type === 'autolink') {
    const children = node.children?.map((child, i) => renderNode(child, i)) || [];
    const url = node.fields?.url || node.url || '#';
    const newTab = node.fields?.newTab;

    return (
      <a
        key={index}
        href={url}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  if (node.type === 'quote') {
    const children = node.children?.map((child, i) => renderNode(child, i)) || [];
    return <blockquote key={index}>{children}</blockquote>;
  }

  if (node.type === 'root') {
    return node.children?.map((child, i) => renderNode(child, i)) || null;
  }

  // Default: render children if they exist
  if (node.children) {
    return node.children.map((child, i) => renderNode(child, i));
  }

  return null;
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) {
    return null;
  }

  const lexicalContent = content as LexicalContent;

  if (!lexicalContent.root) {
    return null;
  }

  return (
    <div className={className}>
      {renderNode(lexicalContent.root, 0)}
    </div>
  );
}
