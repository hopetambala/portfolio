import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Footer } from "../footer/footer";
import { Menu } from "../menu/menu";
import * as styles from "./layout.module.css";

const Layout = ({ menuItems, children, hasNoMenu, isPadded, className }) => {
  const clxNs = [`layout ${styles.layout}`];
  if (isPadded) clxNs.push(`isPadded ${styles.isPadded}`);
  if (className) clxNs.push(className);
  const classNames = clxNs.join(" ");
  return (
    <div className={styles.layoutWrapper}>
      {hasNoMenu ? null : <Menu menuItems={menuItems} />}
      <div className={classNames}>{children}</div>
      <Footer />
    </div>
  );
};

const LayoutContainer = ({ children, hasNoMenu, isPadded, className }) => {
  const data = useStaticQuery(
    graphql`
      query {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/data/projects/" } }
        ) {
          nodes {
            frontmatter {
              title
              slug
            }
          }
        }
      }
    `
  );

  const menuItems = data.allMarkdownRemark.nodes.map((node) => ({
    title: node.frontmatter.title,
    slug: node.frontmatter.slug,
  }));

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
