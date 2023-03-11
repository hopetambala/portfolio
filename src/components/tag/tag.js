import * as styles from "./tag.module.css";
import React from "react";

const Tag = ({ text }) => <div className={styles.tag}>{text}</div>;
export { Tag };
