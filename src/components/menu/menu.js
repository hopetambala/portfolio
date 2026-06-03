import { Link } from "gatsby";
import React, { useState, useEffect } from "react";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import * as styles from "./menu.module.css";

const RESUME_URL =
  "https://drive.google.com/file/d/1iH8Yu5irK5jqEYz8NkCPPRHTGOabmDJ2/view?usp=sharing";

export const Menu = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const classNames = [`menu ${styles.menu}`];
  if (className) classNames.push(className);

  const handleLinkClick = () => setMobileMenuOpen(false);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [mobileMenuOpen]);

  return (
    <header className={classNames.join(" ")}>
      <div className={styles.inner}>
        <Link className={styles.home} to="/">
          <span className={styles.dot} aria-hidden="true" />
          Hope Tambala
        </Link>

        <div className={styles.right}>
          <nav
            className={`${styles.links} ${
              mobileMenuOpen ? styles.mobileMenuOpen : ""
            }`}
          >
            <Link to="/about" onClick={handleLinkClick}>
              About
            </Link>
            <Link to="/work" onClick={handleLinkClick}>
              Work
            </Link>
            <Link to="/journal" onClick={handleLinkClick}>
              Journal
            </Link>
            <a href={RESUME_URL} target="_blank" rel="noreferrer" onClick={handleLinkClick}>
              Résumé
            </a>
            <a
              className={styles.primaryAction}
              href="mailto:hopetambala@gmail.com"
              onClick={handleLinkClick}
            >
              Hit me up!
            </a>
          </nav>

          <ThemeSwitcher />

          <button
            className={`${styles.hamburger} ${
              mobileMenuOpen ? styles.hamburgerOpen : ""
            }`}
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </div>
    </header>
  );
};
