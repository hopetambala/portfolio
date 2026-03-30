import "../css/_main.css";
import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

import { Image } from "../components/image/image";
import { Section } from "../components/section/section";
import { Grid } from "../components/grid/grid";
import { GridItem } from "../components/grid/grid-item/grid-item";
import { Card } from "../components/card/card";
import Layout from "../components/layout/layout";
import { Tag } from "../components/tag/tag";

import * as styles from "./index.module.css";

const CATEGORY_META = {
  "design-systems": {
    label: "Design Systems",
    description: "Open-source design engineering — components, tokens, and tools",
    color: "var(--color-teal-200)",
  },
  nonprofit: {
    label: "Nonprofit Engineering",
    description: "Technology for underserved communities",
    color: "var(--color-yellow-300)",
  },
  personal: {
    label: "Personal Projects",
    description: "Photography, creative work, and exploration",
    color: "var(--color-pink-300)",
  },
  prototypes: {
    label: "Fun Prototypes",
    description: "Weekend experiments and wild ideas",
    color: "var(--color-purple-300)",
  },
  professional: {
    label: "Professional Work",
    description: "Case studies from industry roles",
    color: "var(--color-blue-100)",
  },
};

const Home = ({ data }) => {
  const landing = data.landing.nodes[0]?.frontmatter;
  const landingBody = data.landing.nodes[0]?.html;
  const projects = data.projects.nodes;
  const selectedProjects = projects.filter(
    (node) => node.frontmatter.selectedProject
  );
  const workExperiences = data.workExperiences.nodes;
  const categories = Object.keys(CATEGORY_META);

  return (
    <Layout>
      {/* 1. Hero */}
      <Section title="landing" isNoTitle noHorizontalPadding noVerticalPadding>
        <Grid spacing="none">
          <GridItem>
            <div className={styles.landingTextContainer}>
              <p className={styles.brandHook}>{landing?.brandHook}</p>
              <h2>{landing?.title}</h2>
              <p>{landing?.subtitle}</p>
            </div>
          </GridItem>
          <GridItem>
            <div className={styles.landingImageContainer}>
              {landing?.profileImage && (
                <Image
                  alt="Hope Tambala"
                  source={landing.profileImage}
                  size="xxl"
                  isCentered
                />
              )}
            </div>
          </GridItem>
        </Grid>
      </Section>

      {/* 2. Hiya — Intro */}
      <Section title="Hiya" className={styles.hiya}>
        <div
          className={styles.introContent}
          dangerouslySetInnerHTML={{ __html: landingBody }}
        />
      </Section>

      {/* 3. Explore My Work — Category Cards */}
      <Section title="Explore My Work" className={styles.explore}>
        <Grid spacing="small">
          {categories.map((cat) => (
            <GridItem key={cat}>
              <Card
                link={`/projects/${cat}`}
                className={styles.categoryCard}
                style={{ backgroundColor: CATEGORY_META[cat].color }}
              >
                <div className={styles.categoryCardInner}>
                  <strong>{CATEGORY_META[cat].label}</strong>
                  <p className={styles.categoryDescription}>
                    {CATEGORY_META[cat].description}
                  </p>
                </div>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Section>

      {/* 3. Dive Deep — Selected Projects */}
      <Section
        title="Selected Projects"
        isAltBG
        className={styles.selectedProjects}
      >
        <Grid spacing="small">
          {selectedProjects.map((node) => (
            <GridItem key={node.frontmatter.slug}>
              <Card link={`/${node.frontmatter.slug}`}>
                <strong>{node.frontmatter.title}</strong>
                <Tag text={node.frontmatter.role} />
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Section>

      {/* 4. Work Experiences */}
      <Section
        title="Work Experiences"
        isNoTitle
        noHorizontalPadding
        noVerticalPadding
        className={styles.workExperiences}
      >
        <div className={styles.workDescription}>
          <h2>I've worked at some cool places</h2>
          <p>
            And have built some serious engineering and design chops along the
            way. Whether you're in need of a new design system or a new mobile
            app front-to-back, I have the skills and know-how to make the rubber
            meet the road with your ideas and bring delight to your users!
          </p>
          <a
            href="https://www.linkedin.com/in/hope-tambala/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Check out my Linkedin →</strong>
          </a>
        </div>

        <Grid spacing="none" className={styles.infoRectangleWrapper}>
          {workExperiences.map(({ html, frontmatter }) => (
            <GridItem key={frontmatter.company}>
              <div className={styles.infoRectangle}>
                <h3>{frontmatter.company}</h3>
                <strong>{frontmatter.role}</strong>
                <div className={styles.skillTags}>
                  {frontmatter.skills &&
                    frontmatter.skills.map((skill) => (
                      <Tag key={skill} text={skill} />
                    ))}
                </div>
                <div dangerouslySetInnerHTML={{ __html: html }} />
                <p>{frontmatter.time}</p>
              </div>
            </GridItem>
          ))}
        </Grid>
      </Section>

      {/* 5. Contact CTA */}
      <Section
        title="Let's Build Something"
        className={styles.contactCta}
      >
        <div className={styles.contactContent}>
          <p>
            Whether you need a design system, a mobile app, or just want to
            chat about building great experiences — I'd love to hear from you.
          </p>
          <div className={styles.contactActions}>
            <a
              className={styles.primaryAction}
              href="mailto:hopetambala@gmail.com"
            >
              Hit me up
            </a>
            <a
              href="https://drive.google.com/file/d/1iH8Yu5irK5jqEYz8NkCPPRHTGOabmDJ2/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              View Resume →
            </a>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

const Container = () => {
  const data = useStaticQuery(
    graphql`
      query {
        landing: allMarkdownRemark(
          filter: { frontmatter: { type: { eq: "landing" } } }
        ) {
          nodes {
            html
            frontmatter {
              title
              subtitle
              brandHook
              profileImage
            }
          }
        }
        projects: allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/data/projects/" } }
          sort: { frontmatter: { date: DESC } }
        ) {
          nodes {
            frontmatter {
              title
              slug
              selectedProject
              role
              category
              date
            }
          }
        }
        workExperiences: allMarkdownRemark(
          filter: { frontmatter: { type: { eq: "work-experience" } } }
          sort: { frontmatter: { order: DESC } }
        ) {
          nodes {
            html
            frontmatter {
              company
              role
              skills
              time
              order
            }
          }
        }
      }
    `
  );

  return <Home data={data} />;
};

export default Container;
