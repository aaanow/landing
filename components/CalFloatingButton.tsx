'use client';

import Script from 'next/script';

export function CalFloatingButton() {
  return (
    <Script
      id="cal-embed"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function (C, A, L) {
            let p = function (a, ar) { a.q.push(ar); };
            let d = C.document;
            C.Cal = C.Cal || function () {
              let cal = C.Cal;
              let ar = arguments;
              if (!cal.loaded) {
                cal.ns = {};
                cal.q = cal.q || [];
                d.head.appendChild(d.createElement("script")).src = A;
                cal.loaded = true;
              }
              if (ar[0] === L) {
                const api = function () { p(api, arguments); };
                const namespace = ar[1];
                api.q = api.q || [];
                if (typeof namespace === "string") {
                  cal.ns[namespace] = cal.ns[namespace] || api;
                  p(cal.ns[namespace], ar);
                  p(cal, ["initNamespace", namespace]);
                } else p(cal, ar);
                return;
              }
              p(cal, ar);
            };
          })(window, "https://app.cal.eu/embed/embed.js", "init");
          Cal("init", "aisc-prove", { origin: "https://app.cal.eu" });
          Cal.ns["aisc-prove"]("ui", {
            cssVarsPerTheme: {
              light: { "cal-brand": "#ffffff" },
              dark: { "cal-brand": "#004552" },
            },
            hideEventTypeDetails: false,
            layout: "month_view",
          });
        `,
      }}
    />
  );
}
