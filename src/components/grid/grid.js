import React from "react";
import * as styles from "./grid.module.css";

export const Grid = ({ children, position, spacing, className }) => {
  const classNames = [`group ${styles.group}`];
  if (position) classNames.push(`${position} ${styles[position]}`);
  if (spacing)
    classNames.push(`spacing${spacing} ${styles[`spacing${spacing}`]}`);
  if (className) classNames.push(className);
  return <div className={classNames.join(" ")}>{children}</div>;
};
