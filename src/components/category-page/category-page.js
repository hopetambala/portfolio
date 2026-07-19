import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../layout/layout";
import { WorkCard, CATEGORY_LABELS } from "../work-card/work-card";
import { useStaggerReveal } from "../../motion";

const CATEGORY_DESCRIPTIONS = {
  "design-systems":
    "Open-source design engineering: components, tokens, and tools for building consistent interfaces.",
  nonprofit:
    "Technology built for underserved communities: mobile apps and platforms for real-world impact.",
  apps: "Real products with real users, shipped to the App Store and running in production.",
  personal: "Personal websites and small builds, made for the love of it.",
  prototypes:
    "Weekend experiments, side projects, and fun ideas brought to life.",
  professional: "Case studies and projects from industry roles.",
};

export default function CategoryPage({ data, pageContext }) {
  const { category } = pageContext;
  const projects = data.allMarkdownRemark.nodes;
  const label = CATEGORY_LABELS[category] || category;
  const description = CATEGORY_DESCRIPTIONS[category] || "";

  const gridRef = useStaggerReveal();

  return (
    <Layout>
      <div className="wrap pagehead ed">
        <nav className="postcrumbs" style={{ paddingTop: 0 }} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link to="/work">Work</Link>
          <span aria-hidden="true"> / </span>
          <span>{label}</span>
        </nav>
        <h1 className="display" style={{ marginTop: "0.5rem" }}>
          {label}
        </h1>
        {description && (
          <div className="lead-row">
            <p className="lede">{description}</p>
          </div>
        )}
      </div>

      <div className="wrap" style={{ paddingBottom: "clamp(4rem, 9vw, 9rem)" }}>
        <div className="workgrid" ref={gridRef}>
          {projects.map((node) => (
            <WorkCard key={node.frontmatter.slug} node={node} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query ($category: String!) {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/data/projects/" }
        frontmatter: { category: { eq: $category } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        frontmatter {
          title
          slug
          category
          role
          date
          description
          tech
          image
          links {
            appstore
            live
            github
          }
        }
      }
    }
  }
`;
