import "../css/_main.css";
import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import Layout from "../components/layout/layout";
import { useStaggerReveal } from "../motion";

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
          gallery {
            images {
              url
            }
          }
        }
      }
    }
  `);

  const posts = data.allSanityPost.nodes;
  const galleryRef = useStaggerReveal(0.05, 60);

  return (
    <Layout>
      <div className="wrap pagehead ed">
        <span className="kicker">Journal</span>
        <h1 className="display" style={{ marginTop: "0.5rem" }}>
          Beyond the code.
        </h1>
        <div className="lead-row">
          <p className="lede">
            A photo journal of moments, places, and the world as I see it.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: "clamp(4rem, 9vw, 9rem)" }}>
        <div className="jgrid" ref={galleryRef}>
          {posts.map((post) => {
            const imageUrl = post.mainImage?.url;
            if (!imageUrl) return null;
            // Same count as the post page: main photo plus gallery photos.
            const photoCount =
              1 + (post.gallery?.images || []).filter((img) => img.url).length;
            return (
              <Link key={post._id} to={`/journal/${post.slug}`} className="jcard">
                <div className="media">
                  <img
                    src={`${imageUrl}?w=800&h=1000&fit=crop&auto=format`}
                    alt={post.mainImage?.alt || post.title}
                    loading="lazy"
                  />
                  <span className="media-cap">{post.title}</span>
                  <span className="media-count">
                    {photoCount} {photoCount === 1 ? "photo" : "photos"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Journal;
