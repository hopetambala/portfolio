import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../theme/theme-provider";
import { MODES, MODE_LABEL, MODE_ICON, brandFor } from "../../theme/brands";
import * as styles from "./theme-switcher.module.css";

function DualSwatch({ brand }) {
  return (
    <span className={styles.swatch} aria-hidden="true">
      <span style={{ background: brand.primary }} />
      <span style={{ background: brand.secondary }} />
    </span>
  );
}

export const ThemeSwitcher = () => {
  const { brand, mode, brands, setBrand, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = brandFor(brand);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.switcher} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Switch theme"
        onClick={() => setOpen((o) => !o)}
      >
        <DualSwatch brand={current} />
        <span className={styles.triggerLabel}>{current.label}</span>
        <span className={styles.triggerMode}>{MODE_ICON[mode]}</span>
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label="Theme switcher">
          <div className={styles.cap}>Brand · theme</div>
          <div className={styles.brands}>
            {brands.map((b) => (
              <button
                key={b.path}
                type="button"
                className={`${styles.brand} ${b.path === brand ? styles.isActive : ""}`}
                onClick={() => setBrand(b.path)}
              >
                <DualSwatch brand={b} />
                <span className={styles.brandText}>
                  <span className={styles.brandName}>{b.label}</span>
                  <span className={styles.brandSub}>{b.sub}</span>
                </span>
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
              </button>
            ))}
          </div>

          <div className={`${styles.cap} ${styles.capMt}`}>Appearance</div>
          <div className={styles.modes} role="group" aria-label="Appearance">
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                className={`${styles.mode} ${m === mode ? styles.isActive : ""}`}
                onClick={() => setMode(m)}
              >
                <span className={styles.modeIco}>{MODE_ICON[m]}</span>
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>

          <div className={styles.foot}>
            Live tokens from <code>style-dictionary-dlite-tokens</code>
          </div>
        </div>
      )}
    </div>
  );
};
