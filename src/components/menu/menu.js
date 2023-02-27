import { Link } from "gatsby";
import React, { useState } from "react";
import { Button } from "../button/button";
import * as styles from "./menu.module.css";

const MenuItem = ({ item }) => {
  const { title, slug } = item;
  return <Link to={`/${slug}`}>{title}</Link>;
};

export const Menu = ({ menuItems, className }) => {
  const classNames = [`menu ${styles.menu}`];
  if (className) classNames.push(className);

  const [open, setOpen] = useState(false);

  return (
    <div className={classNames.join(" ")}>
      <div className={styles.menuButtonRow}>
        <Button text="Menu" onClick={() => setOpen(!open)} />
      </div>
      {open && (
        <div className={styles.menuItems}>
          <MenuItem item={{ title: "Home", slug: "" }} />
          {menuItems.map((menuItem) => (
            <div className={styles.menuItem}>
              <MenuItem item={menuItem} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
