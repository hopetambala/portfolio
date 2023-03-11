import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Menu } from "../menu/menu";
import * as styles from "./layout.module.css";

const Layout = ({ menuItems, children, hasNoMenu, isPadded, className }) => {
  const clxNs = [`layout ${styles.layout}`];
  if (isPadded) clxNs.push(`isPadded ${styles.isPadded}`);
  if (className) clxNs.push(className);
  const classNames = clxNs.join(" ");
  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.menuWrapper}>
        {hasNoMenu ? null : <Menu menuItems={menuItems} />}
      </div>
      <div className={classNames}>{children}</div>
    </div>
  );
};

const LayoutContainer = ({ children, hasNoMenu, isPadded, className }) => {
  const data = useStaticQuery(
    graphql`
      query {
        allContentfulPortfolioItem {
          nodes {
            title
            slug
          }
        }
      }
    `
  );

  const menuItems = data.allContentfulPortfolioItem.nodes;

  return (
    <Layout
      menuItems={menuItems}
      children={children}
      hasNoMenu={hasNoMenu}
      isPadded={isPadded}
      className={className}
    />
  );
};

export default LayoutContainer;
