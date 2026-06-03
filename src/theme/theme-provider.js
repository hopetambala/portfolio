import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BRANDS,
  STORAGE_KEY,
  DEFAULT_BRAND,
  DEFAULT_MODE,
  resolveMode,
} from "./brands";

const ThemeContext = createContext(null);

function load() {
  if (typeof window === "undefined") return { brand: DEFAULT_BRAND, mode: DEFAULT_MODE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.brand) return { brand: p.brand, mode: p.mode || DEFAULT_MODE };
    }
  } catch (e) {}
  return { brand: DEFAULT_BRAND, mode: DEFAULT_MODE };
}

/** Write the resolved attributes the scoped CSS keys off of. */
function applyToDocument(brand, mode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-brand", brand);
  root.setAttribute("data-mode", resolveMode(mode));
  root.setAttribute("data-mode-pref", mode);
}

export function ThemeProvider({ children }) {
  const [{ brand, mode }, setState] = useState(load);

  // Apply on mount + whenever brand/mode changes; persist the user's choice.
  useEffect(() => {
    applyToDocument(brand, mode);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ brand, mode }));
    } catch (e) {}
  }, [brand, mode]);

  // Re-resolve when the OS theme flips and the user is on "Auto".
  useEffect(() => {
    if (mode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyToDocument(brand, "system");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [brand, mode]);

  const value = {
    brand,
    mode,
    resolvedMode: resolveMode(mode),
    brands: BRANDS,
    setBrand: (b) => setState((s) => ({ ...s, brand: b })),
    setMode: (m) => setState((s) => ({ ...s, mode: m })),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
