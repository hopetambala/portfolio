import { Link } from "gatsby";
import React from "react";
import * as styles from "./menu.module.css";

export const Menu = ({ className }) => {
  const classNames = [`menu ${styles.menu}`];
  if (className) classNames.push(className);

  return (
    <div className={classNames.join(" ")}>
      <div className={styles.menuHeaderList}>
        <Link className={styles.home} to="/">
          Hope Tambala
        </Link>
        <div className={styles.menuHeaderListActions}>
          <Link to="/about">About</Link>
          <Link to="/#exploremywork">Projects</Link>
          <a
            href="https://drive.google.com/file/d/1iH8Yu5irK5jqEYz8NkCPPRHTGOabmDJ2/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
          <a
            className={styles.primaryAction}
            href="mailto:hopetambala@gmail.com"
          >
            Hit me up!
          </a>
        </div>
      </div>
    </div>
  );
};
