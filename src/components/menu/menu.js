import { Link } from "gatsby";
import React, { useState, useEffect } from "react";
import * as styles from "./menu.module.css";

export const Menu = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const classNames = [`menu ${styles.menu}`];
  if (className) classNames.push(className);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [mobileMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const menu = document.querySelector(`.${styles.menu}`);
      if (menu && !menu.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [mobileMenuOpen]);

  return (
    <div className={classNames.join(" ")}>
      <div className={styles.menuHeaderList}>
        <Link className={styles.home} to="/">
          Hope Tambala
        </Link>
        
        {/* Hamburger toggle button */}
        <button 
          className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        <div className={`${styles.menuHeaderListActions} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link to="/about" onClick={handleLinkClick}>About</Link>
          <Link to="/#exploremywork" onClick={handleLinkClick}>Work</Link>
          <Link to="/journal" onClick={handleLinkClick}>Journal</Link>
          <a
            href="https://drive.google.com/file/d/1iH8Yu5irK5jqEYz8NkCPPRHTGOabmDJ2/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            onClick={handleLinkClick}
          >
            Resume
          </a>
          <a
            className={styles.primaryAction}
            href="mailto:hopetambala@gmail.com"
            onClick={handleLinkClick}
          >
            Hit me up!
          </a>
        </div>
      </div>
    </div>
  );
};
