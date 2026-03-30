import "../css/_main.css";
import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import Layout from "../components/layout/layout";
import { Section } from "../components/section/section";
import { Grid } from "../components/grid/grid";
import { GridItem } from "../components/grid/grid-item/grid-item";
import { Card } from "../components/card/card";
import * as styles from "./about.module.css";

const AboutPage = () => {
  const data = useStaticQuery(
    graphql`
      query {
        markdownRemark(frontmatter: { type: { eq: "about" } }) {
          html
          frontmatter {
            title
            funFacts
          }
        }
        selectedProjects: allMarkdownRemark(
          filter: {
            fileAbsolutePath: { regex: "/data/projects/" }
            frontmatter: { selectedProject: { eq: true } }
          }
          sort: { frontmatter: { date: DESC } }
          limit: 3
        ) {
          nodes {
            frontmatter {
              title
              slug
              role
            }
          }
        }
      }
    `
  );

  const about = data.markdownRemark;
  const highlights = data.selectedProjects.nodes;

  return (
    <Layout>
      <Section title={about.frontmatter.title} className={styles.aboutSection}>
        <div
          className={styles.bio}
          dangerouslySetInnerHTML={{ __html: about.html }}
        />
      </Section>

      {about.frontmatter.funFacts && (
        <Section title="Get to Know Me" isAltBG className={styles.funFacts}>
          <ol className={styles.funFactsList}>
            {about.frontmatter.funFacts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ol>
        </Section>
      )}

      {highlights.length > 0 && (
        <Section title="Highlights" className={styles.highlights}>
          <Grid spacing="small">
            {highlights.map((node) => (
              <GridItem key={node.frontmatter.slug}>
                <Card link={`/${node.frontmatter.slug}`}>
                  <strong>{node.frontmatter.title}</strong>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Section>
      )}

      <Section title="Let's Connect" className={styles.connect}>
        <div className={styles.connectContent}>
          <a
            className={styles.primaryAction}
            href="mailto:hopetambala@gmail.com"
          >
            Say hello
          </a>
        </div>
      </Section>
    </Layout>
  );
};

export default AboutPage;
