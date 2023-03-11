import React from "react";
import * as styles from "./section.module.css";

export const Section = ({
  children,
  title,
  isNoTitle,
  isAltBG,
  noHorizontalPadding,
  noVerticalPadding,
  className,
}) => {
  const id = title.replaceAll(" ", "").toLowerCase();
  const altBg = isAltBG ? `altBg ${styles.altBG}` : "";
  const clx = [`section ${styles.section} ${altBg}`];
  if (noVerticalPadding)
    clx.push(`noVerticalPadding ${styles.noVerticalPadding}`);
  if (className) clx.push(className);
  const classNames = clx.join(" ");

  const contentClx = [`content ${styles.content}`];
  if (noHorizontalPadding)
    contentClx.push(`noHorizontalPadding ${styles.noHorizontalPadding}`);

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
