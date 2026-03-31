import "../css/_main.css";
import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import Layout from "../components/layout/layout";
import { Section } from "../components/section/section";
import * as styles from "./journal.module.css";

const Journal = () => {
  const data = useStaticQuery(graphql`
    query {
      allSanityPost(sort: { publishedAt: DESC }) {
        nodes {
          _id
          title
          slug
          mainImage {
            alt
            url
          }
        }
      }
    }
  `);

  const posts = data.allSanityPost.nodes;

  return (
    <Layout>
      <Section title="Beyond the Code" className={styles.journalHeader}>
        <p className={styles.journalSubtitle}>
          A photo journal of moments, places, and the world as I see it.
        </p>
      </Section>
      <div className={styles.masonry}>
        {posts.map((post) => {
          const imageUrl = post.mainImage?.url;
          if (!imageUrl) return null;
          return (
            <Link
              key={post._id}
              to={`/journal/${post.slug}`}
              className={styles.masonryItem}
            >
              <img
                src={`${imageUrl}?w=600&auto=format`}
                alt={post.mainImage?.alt || post.title}
                loading="lazy"
              />
              <div className={styles.masonryOverlay}>
                <span>{post.title}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
};

export default Journal;
