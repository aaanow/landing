'use client';

import { useState } from 'react';

interface FooterAccordionProps {
  title: string;
  children: React.ReactNode;
}

export function FooterAccordion({ title, children }: FooterAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 flex-1 justify-start items-start w-full">
      {/* Desktop: always-visible heading */}
      <h5 className="hidden md:block font-heading font-bold text-[20px] leading-[28px] !text-button">
        {title}
      </h5>
      <div className="hidden md:flex flex-col">{children}</div>

      {/* Mobile: collapsible accordion */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex md:hidden w-full items-center justify-between py-3 border-b border-white/10"
      >
        <h5 className="font-heading font-bold text-[18px] leading-[26px] !text-button">
          {title}
        </h5>
        <svg
          className={`w-5 h-5 text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`md:hidden flex flex-col overflow-hidden transition-all duration-200 ${open ? 'max-h-[500px] opacity-100 pb-2' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}
