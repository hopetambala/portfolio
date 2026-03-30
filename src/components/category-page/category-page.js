import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../layout/layout";
import { Section } from "../section/section";
import { Grid } from "../grid/grid";
import { GridItem } from "../grid/grid-item/grid-item";
import { Card } from "../card/card";
import { Tag } from "../tag/tag";
import * as styles from "./category-page.module.css";

const CATEGORY_LABELS = {
  "design-systems": "Design Systems",
  nonprofit: "Nonprofit Engineering",
  personal: "Personal Projects",
  prototypes: "Fun Prototypes",
  professional: "Professional Work",
};

const CATEGORY_DESCRIPTIONS = {
  "design-systems":
    "Open-source design engineering — components, tokens, and tools for building consistent interfaces.",
  nonprofit:
    "Technology built for underserved communities — mobile apps and platforms for real-world impact.",
  personal:
    "Photography, creative work, and personal exploration.",
  prototypes:
    "Weekend experiments, side projects, and fun ideas brought to life.",
  professional:
    "Case studies and projects from industry roles.",
};

export default function CategoryPage({ data, pageContext }) {
  const { category } = pageContext;
  const projects = data.allMarkdownRemark.nodes;
  const label = CATEGORY_LABELS[category] || category;
  const description = CATEGORY_DESCRIPTIONS[category] || "";

  return (
    <Layout isPadded>
      <nav className={styles.breadcrumbs}>
        <Link to="/">Home</Link>
        <span> / </span>
        <span>{label}</span>
      </nav>
      <Section title={label}>
        <p className={styles.categoryDescription}>{description}</p>
        <Grid spacing="small">
          {projects.map((node) => (
            <GridItem key={node.frontmatter.slug}>
              <Card link={`/${node.frontmatter.slug}`}>
                <strong>{node.frontmatter.title}</strong>
                <Tag text={node.frontmatter.role} />
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Section>
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
          role
          date
        }
      }
    }
  }
`;
