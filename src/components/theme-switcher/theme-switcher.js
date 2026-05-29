import React, { useState, useEffect } from 'react';
import { setTheme, toggleMode, getStoredTheme, getStoredMode } from './theme-controller';
import * as styles from './theme-switcher.module.css';

const THEMES = [
  { id: 'kooky', label: 'Kooky' },
  { id: 'puente', label: 'Puente' },
  { id: 'survivor', label: 'Survivor' },
  { id: 'survivor-jungle', label: 'Survivor: Jungle' },
  { id: 'survivor-winter-holiday', label: 'Survivor: Winter Holiday' },
];

const ThemeSwitcher = () => {
  const [activeTheme, setActiveTheme] = useState('kooky');
  const [activeMode, setActiveMode] = useState('light');

  useEffect(() => {
    setActiveTheme(getStoredTheme());
    setActiveMode(getStoredMode());
  }, []);

  const handleThemeChange = (e) => {
    const id = e.target.value;
    setTheme(id);
    setActiveTheme(id);
  };

  const handleModeToggle = () => {
    toggleMode();
    setActiveMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={styles.switcher}>
      <select
        className={styles.select}
        value={activeTheme}
        onChange={handleThemeChange}
        aria-label="Select theme"
      >
        {THEMES.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
      <button
        className={styles.modeToggle}
        onClick={handleModeToggle}
        aria-label={`Switch to ${activeMode === 'light' ? 'dark' : 'light'} mode`}
      >
        {activeMode === 'light' ? '☽' : '☀'}
      </button>
    </div>
  );
};

export { ThemeSwitcher };
