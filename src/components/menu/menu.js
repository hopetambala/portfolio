import { Link } from "gatsby";
import React from "react";
import * as styles from "./menu.module.css";
import { Popover } from "../popover/popover";

const MenuItem = ({ item, className }) => {
  const { title, slug } = item;
  return (
    <Link className={className} to={`/${slug}`}>
      {title}
    </Link>
  );
};

export const Menu = ({ menuItems, className }) => {
  const classNames = [`menu ${styles.menu}`];
  if (className) classNames.push(className);

  return (
    <div className={classNames.join(" ")}>
      <div className={styles.menuHeaderList}>
        <MenuItem className={styles.home} item={{ title: "Home", slug: "" }} />
        <div className={styles.menuHeaderListActions}>
          <div>
            <Popover trigger={<div>All Projects</div>}>
              <div className={styles.menuContent}>
                {menuItems.map((menuItem) => (
                  <MenuItem item={menuItem} />
                ))}
              </div>
            </Popover>
          </div>
          <a
            href="https://drive.google.com/file/d/1qzyOJV0OklvxV6LniOSvQLjWld5lkJg2/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
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
    </div>
  );
};
