import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Menu } from "../menu/menu";
import * as styles from "./layout.module.css";

const Layout = ({ menuItems, children, hasNoMenu, isPadded, className }) => {
  const classNames = [`layout ${styles.layout}`];
  if (isPadded) classNames.push(`isPadded ${styles.isPadded}`);
  if (className) classNames.push(className);
  return (
    <div>
      {hasNoMenu ? null : <Menu menuItems={menuItems} />}
      <div className={classNames.join(" ")}>{children}</div>
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
