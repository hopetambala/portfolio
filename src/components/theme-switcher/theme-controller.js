const STORAGE_THEME = 'dlite-theme';
const STORAGE_MODE = 'dlite-mode';
const DEFAULT_THEME = 'kooky';
const DEFAULT_MODE = 'light';

function setTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem(STORAGE_THEME, themeId);
}

function toggleMode() {
  const current = document.documentElement.getAttribute('data-mode') || DEFAULT_MODE;
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-mode', next);
  localStorage.setItem(STORAGE_MODE, next);
}

function getStoredTheme() {
  return localStorage.getItem(STORAGE_THEME) || DEFAULT_THEME;
}

function getStoredMode() {
  return localStorage.getItem(STORAGE_MODE) || DEFAULT_MODE;
}

module.exports = { setTheme, toggleMode, getStoredTheme, getStoredMode };
