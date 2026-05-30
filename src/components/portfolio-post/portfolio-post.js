import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../layout/layout";
import { Tag } from "../tag/tag";
import { useScrollReveal } from "../../motion";
import * as styles from "./portfolio-post.module.css";

const CATEGORY_LABELS = {
  "design-systems": "Design Systems",
  nonprofit: "Nonprofit Engineering",
  personal: "Personal Projects",
  prototypes: "Fun Prototypes",
  professional: "Professional Work",
};

export default function Post({ data }) {
  const { frontmatter, html } = data.markdownRemark;
  const { title, role, category, links, image } = frontmatter;
  const categoryLabel = CATEGORY_LABELS[category] || category;

  const linksRef = useScrollReveal();
  const contentRef = useScrollReveal();

  return (
    <Layout isPadded className={styles.portfolioPost}>
      <nav className={styles.breadcrumbs}>
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to={`/projects/${category}`}>{categoryLabel}</Link>
        <span> / </span>
        <span>{title}</span>
      </nav>
      <h1>{title}</h1>
      {role && <Tag text={role} />}
      {image && (
        <img
          src={image}
          alt={`${title} screenshot`}
          className={styles.projectImage}
        />
      )}
      {links && (
        <div ref={linksRef} className={`scroll-reveal ${styles.externalLinks}`}>
          {links.github && (
            <a href={links.github} target="_blank" rel="noreferrer">
              GitHub →
            </a>
          )}
          {links.npm && (
            <a href={links.npm} target="_blank" rel="noreferrer">
              npm →
            </a>
          )}
          {links.live && (
            <a href={links.live} target="_blank" rel="noreferrer">
              Live Demo →
            </a>
          )}
        </div>
      )}
      <div
        ref={contentRef}
        className={`scroll-reveal ${styles.content}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Layout>
  );
}

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        slug
        role
        category
        date
        links {
          github
          npm
          live
        }
        image
      }
    }
  }
`;
