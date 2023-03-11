import { Link } from "gatsby";
import React from "react";
import * as styles from "./menu.module.css";

const MenuItem = ({ item }) => {
  const { title, slug } = item;
  return <Link to={`/${slug}`}>{title}</Link>;
};

export const Menu = ({ menuItems, className }) => {
  const classNames = [`menu ${styles.menu}`];
  if (className) classNames.push(className);

  return (
    <div className={classNames.join(" ")}>
      <div className={styles.menuHeaderList}>
        <div>
          <div>All Projects</div>
          <div className={styles.menuContent}>
            <MenuItem item={{ title: "Home", slug: "" }} />
            {menuItems.map((menuItem) => (
              <MenuItem item={menuItem} />
            ))}
          </div>
        </div>
        <a
          href="https://drive.google.com/drive/u/4/folders/1p--kNd2IKk_u2K2hKsYuD5h0lSRH1vm0"
          target=""
        >
          Resume
        </a>
        <a
          className={styles.primaryAction}
          href="mailto: hopetambala@gmail.com"
        >
          Hit me up!
        </a>
      </div>
    </div>
  );
};
