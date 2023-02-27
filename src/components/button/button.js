import React from "react";
import * as styles from "./button.module.css";

export const Button = ({ className, text, onClick }) => {
  const classNames = [`button ${styles.button}`];
  if (className) classNames.push(className);
  return (
    <button onClick={onClick} className={classNames.join(" ")}>
      {text}
    </button>
  );
};
