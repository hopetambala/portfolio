/**
 * @jest-environment jsdom
 */

const { setTheme, toggleMode, getStoredTheme, getStoredMode } = require('../theme-controller');

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.mode;
});

describe('setTheme', () => {
  test('sets data-theme on html element', () => {
    setTheme('puente');
    expect(document.documentElement.dataset.theme).toBe('puente');
  });

  test('saves theme to localStorage', () => {
    setTheme('survivor-jungle');
    expect(localStorage.getItem('dlite-theme')).toBe('survivor-jungle');
  });

  test('accepts all valid theme ids', () => {
    const themes = ['kooky', 'puente', 'survivor', 'survivor-jungle', 'survivor-winter-holiday'];
    themes.forEach((id) => {
      setTheme(id);
      expect(document.documentElement.dataset.theme).toBe(id);
    });
  });
});

describe('toggleMode', () => {
  test('switches from light to dark', () => {
    document.documentElement.dataset.mode = 'light';
    toggleMode();
    expect(document.documentElement.dataset.mode).toBe('dark');
  });

  test('switches from dark to light', () => {
    document.documentElement.dataset.mode = 'dark';
    toggleMode();
    expect(document.documentElement.dataset.mode).toBe('light');
  });

  test('saves mode to localStorage', () => {
    document.documentElement.dataset.mode = 'light';
    toggleMode();
    expect(localStorage.getItem('dlite-mode')).toBe('dark');
  });

  test('defaults to dark if no current mode set', () => {
    toggleMode();
    expect(document.documentElement.dataset.mode).toBe('dark');
  });
});

describe('getStoredTheme', () => {
  test('returns kooky when localStorage is empty', () => {
    expect(getStoredTheme()).toBe('kooky');
  });

  test('returns stored theme value', () => {
    localStorage.setItem('dlite-theme', 'puente');
    expect(getStoredTheme()).toBe('puente');
  });
});

describe('getStoredMode', () => {
  test('returns light when localStorage is empty', () => {
    expect(getStoredMode()).toBe('light');
  });

  test('returns stored mode value', () => {
    localStorage.setItem('dlite-mode', 'dark');
    expect(getStoredMode()).toBe('dark');
  });
});
