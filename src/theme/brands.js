export const BRANDS = [
  { path: "survivor/default", label: "Survivor", sub: "Warm / earthy", primary: "#de6f1b", secondary: "#006210" },
  { path: "survivor/jungle", label: "Survivor Jungle", sub: "Deep green", primary: "#0b5223", secondary: "#42a383" },
  { path: "survivor/winter-holiday", label: "Survivor Winter", sub: "Festive red", primary: "#bf3813", secondary: "#006210" },
  { path: "puente/default", label: "Puente", sub: "Clean & pro", primary: "#3d80fc", secondary: "#ffe680" },
  { path: "kooky/default", label: "Kooky", sub: "Playful display", primary: "#00abad", secondary: "#ffdd00" },
];

export const STORAGE_KEY = "dlite-portfolio-theme-v1";
export const DEFAULT_BRAND = "survivor/default";
export const DEFAULT_MODE = "system"; // "light" | "dark" | "system"

export const MODES = ["light", "dark", "system"];
export const MODE_LABEL = { light: "Light", dark: "Dark", system: "Auto" };
export const MODE_ICON = { light: "☀", dark: "☾", system: "◐" };

export function brandFor(path) {
  return BRANDS.find((b) => b.path === path) || BRANDS[0];
}

export function resolveMode(mode) {
  if (mode === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return mode;
}
