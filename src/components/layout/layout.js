import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Menu } from "../menu/menu";

const Layout = ({ menuItems, children, hasNoMenu }) => {
  return (
    <div>
      {hasNoMenu ? null : <Menu menuItems={menuItems} />}
      {children}
    </div>
  );
};

const LayoutContainer = ({ children, hasNoMenu }) => {
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
    <Layout menuItems={menuItems} children={children} hasNoMenu={hasNoMenu} />
  );
};

export default LayoutContainer;
