import React from "react";
import * as styles from "./grid-item.module.css";

export const GridItem = ({ children }) => {
  return <div className={styles.gridItem}>{children}</div>;
};
