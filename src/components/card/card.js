import React from "react";
import * as styles from "./card.module.css";
import { navigate } from "gatsby";

export const Card = ({ children, link, className, style }) => {
  const clx = [`card ${styles.card}`];
  if (className) clx.push(className);
  const classNames = clx.join(" ");

  const toNavigation = (location) => navigate(location);

  const CardWapper = ({ children }) =>
    link ? (
      <div
        className={classNames}
        style={style}
        onClick={() => toNavigation(link)}
        onKeyDown={() => toNavigation(link)}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    ) : (
      <div className={classNames} style={style}>{children}</div>
    );
  return <CardWapper>{children}</CardWapper>;
};
