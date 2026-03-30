import React from "react";
import * as styles from "./card.module.css";
import { Link } from "gatsby";

export const Card = ({ children, link, className, style }) => {
  const clx = [`card ${styles.card}`];
  if (className) clx.push(className);
  const classNames = clx.join(" ");

  if (link) {
    return (
      <Link to={link} className={classNames} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classNames} style={style}>
      {children}
    </div>
  );
};
