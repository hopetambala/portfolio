import * as styles from "./tag.module.css";
import React from "react";

const Tag = ({ text, className }) => {
  const clx = [`tag ${styles.tag}`];
  if (className) clx.push(className);
  const classNames = clx.join(" ");

  return <div className={classNames}>{text}</div>;
};
export { Tag };
