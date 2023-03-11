import React from "react";
import * as styles from "./section.module.css";

export const Section = ({
  children,
  title,
  isNoTitle,
  isAltBG,
  noPadding,
  className,
}) => {
  const id = title.replaceAll(" ", "").toLowerCase();
  const altBg = isAltBG ? `altBg ${styles.altBG}` : "";
  const clx = [`section ${styles.section} ${altBg}`];
  if (className) clx.push(className);
  const classNames = clx.join(" ");

  const contentClx = [`content ${styles.content}`];
  if (noPadding) contentClx.push(`noPadding ${styles.noPadding}`);
  const contentClassNames = contentClx.join(" ");

  return (
    <section id={id} className={classNames}>
      <div className={contentClassNames}>
        {!isNoTitle && <h2>{title}</h2>}
        {children}
      </div>
    </section>
  );
};
