'use client';

import { useEffect } from 'react';

interface WebflowContentProps {
  html: string;
}

export default function WebflowContent({ html }: WebflowContentProps) {
  useEffect(() => {
    // Initialize Webflow interactions after content loads
    if (typeof window !== 'undefined' && (window as any).Webflow) {
      (window as any).Webflow.destroy();
      (window as any).Webflow.ready();
      (window as any).Webflow.require('ix2').init();
    }
  }, [html]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
