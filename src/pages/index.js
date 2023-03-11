import "../css/_main.css";
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import { Section } from "../components/section/section";
import { Grid } from "../components/grid/grid";
import { GridItem } from "../components/grid/grid-item/grid-item";
import { Card } from "../components/card/card";
import Layout from "../components/layout/layout";
import { Tag } from "../components/tag/tag";
import * as styles from "./index.module.css";

const Home = ({ data }) => {
  const { landingPageTitle, landingPageSubtitle, intro } =
    data.allContentfulLandingPage.nodes[0];

  const { nodes } = data.allContentfulPortfolioItem;
  return (
    <Layout>
      <Section title="landing" isNoTitle className={styles.landing}>
        <h1>{landingPageTitle}</h1>
        <h2>{landingPageSubtitle}</h2>
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
                <Card link={`${node.slug}`} className={styles.card}>
                  {/* <Image alt="Wedding Couple" source={wedding} size="ml" /> */}

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
        noPadding
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
          <GridItem>
            <div className={styles.infoRectangle}>hi</div>
          </GridItem>
          <GridItem>
            <div className={styles.infoRectangle}>hi</div>
          </GridItem>
          <GridItem>
            <div className={styles.infoRectangle}>hi</div>
          </GridItem>
          <GridItem>
            <div className={styles.infoRectangle}>hi</div>
          </GridItem>
        </Grid>
      </Section>

      {/*
      <Section title="Lodging">
        <h3>Hotels</h3>
        <p>
          Here are some options of places to stay nearby. We recommend booking
          early - the hotels will be very busy in August and accomodations can
          book up months in advance.
        </p>
        <p>
          The first option (Costa Mesa Mariott) has a room block for our wedding
          and the second option (Avenue of Arts) has a 15% off discount. Both
          are within walking distance from OCMA, the instructions for booking
          each are in the description.
        </p>

        <Grid>
          <GridItem>
            <div>
              <h3>Costa Mesa Marriott</h3>
              <p>
                <em>500 Anton Blvd, Costa Mesa, CA 92626</em>
              </p>
              <p>(714) 957-1100</p>
              <a
                href="https://www.marriott.com/events/start.mi?id=1673297268997&key=GRP"
                target="_blank"
                rel="noreferrer"
              >
                Website link for $199 stay per night and $20 parking per night
              </a>
            </div>
          </GridItem>
          <GridItem>
            <div>
              <h3>Avenue of the Arts Costa Mesa</h3>
              <p>
                <em>3350 Avenue of the Arts, Costa Mesa, CA 92626</em>
              </p>
              <p>(714) 751-5100</p>
              <a
                href="https://marriott.com/reservation/availability.mi?propertyCode=CSMTX&cc=K6Y"
                target="_blank"
                rel="noreferrer"
              >
                Website link for a 15% off Standard and Deluxe guest room rates
                and free parking per night
              </a>
            </div>
          </GridItem>
        </Grid>
        <h3>Airbnbs</h3>
        <p>
          Airbnbs are a great option, especially for those interested in staying
          on or close to the beach. The most convenient locations for our
          ceremony/reception are the following: Newport Beach, Corona del Mar,
          Costa Mesa, and Irvine. (Please note that Orange County is comprised
          of many small towns, so pay attention to the distance to our ceremony
          and reception locations, rather than the name of the city, when
          booking an Airbnb.)
        </p>
      </Section>

      <SectionDivider />

      <Section title="Things To Do" isAltBG>
        <h3>Check out the beach!</h3>
        <Grid>
          <GridItem>
            <h4>Beach bod ready?</h4>
            <p>
              Although you really can’t go wrong with any of Orange County's beaches, we recommend Newport
              Beach Municipal Beach, Aliso Beach, Crystal Cove State Park, and
              Huntington City Beach.
            </p>
            <h4>Balboa Island</h4>
            <p>
              Drive or take the ferry to Balboa Island for a classic boardwalk
              experience, where you can rent bikes and ride the ferris wheel in
              the Balboa Fun Zone, and be sure to try a frozen banana (”There’s
              always money in the banana stand!”).
            </p>
            <h4>Laguna Beach</h4>
            <p>
              Home to 100+ art galleries, Laguna Beach is a beloved, local “art
              colony.” Take a stroll through downtown Laguna Beach and check out
              the independent shops, restaurants, and art galleries that dot the
              coastline.
            </p>
          </GridItem>
          <GridItem>
            <Image alt="Bonfire Pic" source={beach} size="xl" isCentered />
          </GridItem>
        </Grid>
        <h3>Looking for some adventure?</h3>
        <Grid>
          <GridItem>
            <Image alt="Hiking Pic" source={adventure} size="xl" />
          </GridItem>
          <GridItem>
            <h4>El Moro Canyon Loop</h4>
            <p>
              Hike the El Moro Canyon Loop for spectacular views of the
              coastline. Located inside Crystal Cove State Park, El Moro has
              several trails ranging from 3 to 9 miles, which take you through
              the canyon with views of the ocean.
            </p>
            <h4>Catalina Island</h4>
            <p>
              For a real adventure, take the Catalina Flyer, a 75-minute ferry
              ride, from Newport Beach to Catalina Island. Catalina Island is
              known for its wildlife, beaches, and hiking. Make it a day trip,
              or you can camp or stay in a hotel for an overnight visit.
            </p>
          </GridItem>
        </Grid>
        <h3>Anyone say grub? 🍖 🍗 🍔 🍟 🍕 🥐 🥖 🫓 🥨</h3>
        <Grid>
          <GridItem>
            <p>
              We&rsquo;re big fans of some of the food around the area! While in
              town, enjoy Playa Mesa, which has some bomb Mexican food. Try
              anything on the menu with Birria; you won&rsquo;t regret it
              (unless you&rsquo;re vegetarian). Tacos Manuel is pretty delicious
              as well. In-N-Out continues to divide popular opinion as the best
              fast-food burger to exist (apparently). You could try their burger
              &ldquo;animal style&rdquo; and let us know your thoughts!
            </p>

            <p>
              If you&rsquo;re itching for sweets, we suggest a doughnut from
              Sidecar Doughnuts. One of us loves the CHOC-A-LOT, and the other
              loves the MAPLE BACON.
            </p>
          </GridItem>

          <GridItem>
            <Image alt="Taco Pic" source={taco} size="xl" isCentered />
          </GridItem>
        </Grid>
        <h3>Los Angeles</h3>
        <Grid>
          <GridItem>
            <Image alt="Traffic Pic" source={traffic} size="xl" />
          </GridItem>
          <GridItem>
            <p>We legit know nothing about L.A. Womp!</p>
            <p>
              (kidding...) While we aren't LA experts, we're happy to give a few
              recs based on our limited experience! Los Angeles is about an hour
              away from Orange County (if you’re lucky with traffic). It’s home
              to some amazing museums, including The Getty, The Broad, and
              Griffith Observatory. Grab a bite to eat in Little Tokyo or
              Koreatown. Venice Beach and Santa Monica are oceanside
              neighborhoods with a lot of character and dozens of restaurants
              and shops. And, of course, you can enjoy the glitz and glamor of
              Hollywood with a backlot studio tour, the Walk of Fame, and the
              Chinese Theatre!
            </p>
          </GridItem>
        </Grid>
      </Section>

      <SectionDivider isTop />


      <Section title="Registry">
        <p>
          Your presence at our wedding is the greatest gift we could ask for! If
          you do choose to purchase a gift, we’ve included our registry link
          below. Thank you in advance, and we can’t wait to celebrate with you
          soon!
        </p>
        <a
          href="https://registry.theknot.com/--august-2023-ny/57706136"
          target="_blank"
          rel="noreferrer"
        >
          Registry
        </a>
      </Section>
      <Section title=""></Section> */}
    </Layout>
  );
};

const Container = () => {
  const data = useStaticQuery(
    graphql`
      query {
        allContentfulLandingPage {
          nodes {
            landingPageSubtitle
            landingPageTitle
            intro {
              raw
            }
          }
        }
        allContentfulPortfolioItem {
          nodes {
            title
            slug
            selectedProject
            role
          }
        }
      }
    `
  );

  return <Home data={data} />;
};

export default Container;
