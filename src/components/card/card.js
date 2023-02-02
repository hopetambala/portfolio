import React from "react";
import * as styles from "./card.module.css";

export const Card = ({ children, className }) => {
  const classNames = [`card ${styles.card}`];
  if (className) classNames.push(className);
  return <div className={classNames.join(" ")}>{children}</div>;
};
