import React from "react";
import { ThemeProvider } from "./src/theme/theme-provider";
import { BRANDS, STORAGE_KEY, DEFAULT_BRAND, DEFAULT_MODE } from "./src/theme/brands";

// Wrap every page (SSR side) so useTheme() works during build/render.
export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);

// Seed the SSR markup with the default combo so first paint is themed.
export const onRenderBody = ({ setHtmlAttributes, setHeadComponents, setPreBodyComponents }) => {
  setHtmlAttributes({
    lang: "en",
    "data-brand": DEFAULT_BRAND,
    "data-mode": "light",
    "data-mode-pref": DEFAULT_MODE,
  });

  setHeadComponents([
    <link key="gf-pre1" rel="preconnect" href="https://fonts.googleapis.com" />,
    <link
      key="gf-pre2"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="gf-css"
      rel="stylesheet"
      href={
        "https://fonts.googleapis.com/css2?" +
        "family=Plus+Jakarta+Sans:wght@400;500;600;700;800&" +
        "family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&" +
        "family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&" +
        "family=Source+Code+Pro:wght@400;500&display=swap"
      }
    />,
  ]);

  // No-flash script: read the persisted choice and set the data-* attributes
  // BEFORE first paint, so the correct brand/mode is applied with no FOUC.
  const noFlash = `
(function(){
  try {
    var KEY = ${JSON.stringify(STORAGE_KEY)};
    var brand = ${JSON.stringify(DEFAULT_BRAND)};
    var mode = ${JSON.stringify(DEFAULT_MODE)};
    var raw = localStorage.getItem(KEY);
    if (raw) { var p = JSON.parse(raw); var VALID = ${JSON.stringify(BRANDS.map((b) => b.path))}; if (p && p.brand && VALID.indexOf(p.brand) !== -1) { brand = p.brand; mode = (["light","dark","system"].indexOf(p.mode) !== -1 ? p.mode : mode); } }
    var resolved = mode;
    if (mode === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var el = document.documentElement;
    el.setAttribute('data-brand', brand);
    el.setAttribute('data-mode', resolved);
    el.setAttribute('data-mode-pref', mode);
  } catch (e) {}
})();`;

  setPreBodyComponents([
    <script key="dlite-no-flash" dangerouslySetInnerHTML={{ __html: noFlash }} />,
  ]);
};
