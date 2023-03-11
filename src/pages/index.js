import "../css/_main.css";
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { renderRichText } from "gatsby-source-contentful/rich-text";

import { Image } from "../components/image/image";
import { Section } from "../components/section/section";
import { Grid } from "../components/grid/grid";
import { GridItem } from "../components/grid/grid-item/grid-item";
import { Card } from "../components/card/card";
import Layout from "../components/layout/layout";
import { Tag } from "../components/tag/tag";

import * as styles from "./index.module.css";

const Home = ({ data }) => {
  const { landingPageTitle, landingPageSubtitle, intro, pictureOfMe } =
    data.allContentfulLandingPage.nodes[0];

  const { nodes } = data.allContentfulPortfolioItem;

  const { nodes: workExperiences } = data.allContentfulWorkExperience;
  return (
    <Layout>
      <Section title="landing" isNoTitle noHorizontalPadding noVerticalPadding>
        <Grid spacing="none">
          <GridItem>
            <div className={styles.landingTextContainer}>
              <h2>{landingPageTitle}</h2>
              <p>{landingPageSubtitle}</p>
            </div>
          </GridItem>
          <GridItem>
            <div className={styles.landingImageContainer}>
              <Image
                alt="Funny Profile Pic"
                source={pictureOfMe.file.url}
                size="xxl"
                isCentered
              />
            </div>
          </GridItem>
        </Grid>
      </Section>
      <Section title="Hiya" className={styles.hiya}>
        <div>{intro && renderRichText(intro)}</div>
      </Section>

      <Section
        title="Selected Projects"
        isAltBG
        className={styles.selectedProjects}
      >
        <Grid spacing="small">
          {nodes
            .filter((node) => node.selectedProject)
            .map((node) => (
              <GridItem>
                <Card link={`${node.slug}`}>
                  <strong>{node.title}</strong>
                  <Tag text={node.role} />
                </Card>
              </GridItem>
            ))}
        </Grid>
      </Section>

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
          {workExperiences &&
            workExperiences.map(
              ({ company, role, skills, descriptionRich, time }) => (
                <GridItem>
                  <div className={styles.infoRectangle}>
                    <h3>{company}</h3>
                    <strong>{role}</strong>
                    <div className={styles.skillTags}>
                      {skills && skills.map((skill) => <Tag text={skill} />)}
                    </div>
                    {descriptionRich && renderRichText(descriptionRich)}
                    <p>{time}</p>
                  </div>
                </GridItem>
              )
            )}
        </Grid>
      </Section>
    </Layout>
  );
};

const Container = () => {
  const data = useStaticQuery(
    graphql`
      query {
        allContentfulLandingPage {
          nodes {
            pictureOfMe {
              file {
                url
              }
            }
            landingPageSubtitle
            landingPageTitle
            intro {
              raw
            }
          }
        }
        allContentfulPortfolioItem(sort: { date: DESC }) {
          nodes {
            title
            slug
            selectedProject
            role
            date
          }
        }
        allContentfulWorkExperience(sort: { updatedAt: ASC }) {
          nodes {
            company
            role
            descriptionRich {
              raw
            }
            skills
            time
          }
        }
      }
    `
  );

  return <Home data={data} />;
};

export default Container;
