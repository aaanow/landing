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
}

interface LexicalContent {
  root: LexicalNode;
}

interface RichTextProps {
  content: unknown;
  className?: string;
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === 'text') {
    return node.text || '';
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
    const Tag = node.format === 'bullet' ? 'ul' : 'ol';
    return <Tag key={index}>{children}</Tag>;
  }

  if (node.type === 'listitem') {
    const children = node.children?.map((child, i) => renderNode(child, i)) || [];
    return <li key={index}>{children}</li>;
  }

  if (node.type === 'link') {
    const children = node.children?.map((child, i) => renderNode(child, i)) || [];
    return (
      <a key={index} href="#">
        {children}
      </a>
    );
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
