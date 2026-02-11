'use client';

import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';

export function CalFloatingButton() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'aisc-prove' });
      cal('floatingButton', {
        calLink: 'aaanow-ljs/aisc-prove',
        config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
      });
      cal('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': '#ffffff' },
          dark: { 'cal-brand': '#004552' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return null;
}
