import { Link } from "gatsby";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import * as styles from "./menu.module.css";

const RESUME_URL =
  "https://drive.google.com/file/d/1iH8Yu5irK5jqEYz8NkCPPRHTGOabmDJ2/view?usp=sharing";

export const Menu = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const classNames = [`menu ${styles.menu}`];
  if (className) classNames.push(className);

  useEffect(() => setMounted(true), []);

  const handleLinkClick = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMobileMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const drawer = (
    <>
      {/* Dim backdrop — tap anywhere outside the drawer to close */}
      <div
        className={`${styles.mobileBackdrop} ${mobileMenuOpen ? styles.mobileBackdropOpen : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      {/* Right-side drawer — z-index below the sticky nav so × is always tappable */}
      <div
        className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileDrawerOpen : ""}`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className={styles.mobileLinks}>
          <Link to="/about" onClick={handleLinkClick}>About</Link>
          <Link to="/work" onClick={handleLinkClick}>Work</Link>
          <Link to="/journal" onClick={handleLinkClick}>Journal</Link>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" onClick={handleLinkClick}>Résumé</a>
          <a className={styles.mobilePrimaryAction} href="mailto:hopetambala@gmail.com" onClick={handleLinkClick}>
            Hit me up!
          </a>
        </nav>
      </div>
    </>
  );

  return (
    <>
      <header className={classNames.join(" ")}>
        <div className={styles.inner}>
          <Link className={styles.home} to="/">
            <span className={styles.dot} aria-hidden="true" />
            Hope Tambala
          </Link>

          <div className={styles.right}>
            <nav className={styles.links}>
              <Link to="/about">About</Link>
              <Link to="/work">Work</Link>
              <Link to="/journal">Journal</Link>
              <a href={RESUME_URL} target="_blank" rel="noreferrer">Résumé</a>
              <a className={styles.primaryAction} href="mailto:hopetambala@gmail.com">
                Hit me up!
              </a>
            </nav>

            <ThemeSwitcher />

            <button
              className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ""}`}
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          </div>
        </div>
      </header>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
};
