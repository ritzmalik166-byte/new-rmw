/* Diwali touches for every page, mounted in app/layout.tsx behind DIWALI_THEME.
   Inner pages get string lights under the header and a rangoli in the corner (the
   homepage hero has its own decor); every page gets a small greeting diya.
   Styles: src/styles/festive/diwali-dark.css */

import { StringLights } from "@/components/festive/DiwaliHero";

export function DiwaliSiteLights() {
  return (
    <>
      <div className="dw-site dw-decor theme-keep" aria-hidden>
        <span className="dw-glow" />
        <StringLights />
        <span className="dw-site-rangoli" />
      </div>
      <p className="dw-greeting">
        <span className="dw-greeting-diya theme-keep" aria-hidden />
        <span lang="hi">शुभ दीपावली</span>
      </p>
    </>
  );
}
