import "../css/_main.css";
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import { Section } from "../components/section/section";
import { SectionDivider } from "../components/section/section-divider/section-divider";
import { Grid } from "../components/grid/grid";
import { GridItem } from "../components/grid/grid-item/grid-item";

import * as styles from "./index.module.css";
import { Card } from "../components/card/card";
import Layout from "../components/layout/layout";

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
      <Section title="Hiya!">
        <Grid>
          <GridItem>{intro && renderRichText(intro)}</GridItem>
        </Grid>
      </Section>

      <SectionDivider />

      <Section title="Selected Projects" isAltBG className={styles.details}>
        <Grid position="center">
          {nodes
            .filter((node) => node.selectedProject)
            .map((node) => (
              <GridItem>
                {/* <Image alt="Wedding Couple" source={wedding} size="ml" /> */}
                <Card>
                  <h3>{node.title}</h3>
                  <strong>{node.role}</strong>
                  {/* <p>4:30 pm @ Corona del Mar Community Church</p>
              <p>611 Heliotrope Ave, Corona Del Mar, CA 92625</p>
              <p>
                We are honored to have friends and family witness our exchange
                of vows as we officially become husband and wife!
              </p>
              <em>Attire: Cocktail</em> */}
                </Card>
              </GridItem>
            ))}
        </Grid>
      </Section>

      {/*

      <SectionDivider isTop />

      <Section title="Getting Here">
        <p>
          Orange County, California is home to some of California’s most
          beautiful beaches, and we hope that you will take some time to explore
          a place that holds great meaning to both of us!
        </p>
        <h3>Flying</h3>
        <Grid>
          <GridItem>
            <p>
              If you will be flying to Orange County for our wedding, please
              consider the following options:
            </p>
            <p>
              The closest airport to our wedding ceremony and reception is John
              Wayne International Airport (SNA), which is just 2.5 miles (10
              minutes) from our reception venue. Although it is a smaller
              airport, there are regular flights to SNA from many major
              metropolitan cities, including Chicago, Houston, and New York.
            </p>
            <p>
              Long Beach Airport (LGB) is 20 miles (30 minutes depending on
              traffic) from our reception venue. Although LGB is a smaller
              airport, non-stop flights, particularly on Southwest, are
              available to/from some cities.
            </p>
            <p>
              Los Angeles International Airport (LAX) is 40 miles (45
              minutes-1.5 hours depending on traffic) from our reception venue.
              LAX is a large international hub with many affordable flights from
              all major airlines. Los Angeles is also a fun and exciting city if
              you would like to extend your travel plans! To get to Orange
              County from LAX, consider any of the following options: 1) Rent a
              car 2) take an Uber/Lyft ($60-70 one-way), or 3) take the FlyAway
              bus from LAX to Union Station and connect to either the Metrolink
              or Surfliner trains which both make stops in Orange County.
            </p>
            <p>
              San Diego International Airport (SAN) is 86 miles (1.5 hours) from
              our reception venue. Although this is a bit farther than the other
              options, if you are interested in exploring San Diego while out on
              the west coast, this could be a great option!
            </p>
          </GridItem>
          <GridItem>
            <Image alt="Airplane Pic" source={flying} size="xl" isCentered />
          </GridItem>
        </Grid>
        <h3>Getting around while you're here</h3>

        <Grid>
          <GridItem>
            <p>
              Please note that there is very limited public transportation in
              Orange County. Depending on your plans, you may want to consider
              renting a car. Uber/Lyft is also readily available, which may be a
              good option for those guests who will only be in town for a short
              visit.
            </p>
          </GridItem>
          <GridItem>
            <Image alt="Uber Pic" source={uber} size="l" isCentered />
          </GridItem>
        </Grid>
      </Section>

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
