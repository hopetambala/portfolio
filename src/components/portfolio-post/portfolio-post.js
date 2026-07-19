import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../layout/layout";
import { useScrollReveal } from "../../motion";

const CATEGORY_LABELS = {
  "design-systems": "Design Systems",
  nonprofit: "Nonprofit Engineering",
  apps: "Shipped App",
  personal: "Personal Websites",
  prototypes: "App Prototypes",
  professional: "Professional Work",
};

const LINK_LABELS = { appstore: "App Store", github: "GitHub", npm: "npm", live: "Live demo" };

export default function Post({ data }) {
  const { frontmatter, html } = data.markdownRemark;
  const { title, role, category, links, image, date, tech } = frontmatter;
  const categoryLabel = CATEGORY_LABELS[category] || category;
  const year = date ? new Date(date).getFullYear() : null;

  const heroRef = useScrollReveal();
  const contentRef = useScrollReveal();

  return (
    <Layout>
      <article className="wrap ed" style={{ paddingBottom: "clamp(4rem, 9vw, 9rem)" }}>
        <nav className="postcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link to="/work">Work</Link>
          <span aria-hidden="true"> / </span>
          <span>{title}</span>
        </nav>

        <header className="pagehead" style={{ paddingTop: "clamp(1.5rem, 4vw, 3rem)" }}>
          <span className="kicker">{categoryLabel}</span>
          <h1 className="h-xl" style={{ marginTop: "0.8rem" }}>
            {title}
          </h1>
          <div className="postmeta">
            {role && <span className="mono">{role}</span>}
            {year && <span className="mono">{year}</span>}
            {(tech || []).map((t) => (
              <span className="stk" key={t}>
                {t}
              </span>
            ))}
          </div>
          {links && (
            <div className="btn-row" style={{ marginTop: "1.5rem" }}>
              {["appstore", "live", "github", "npm"].map((k) =>
                links[k] ? (
                  <a
                    key={k}
                    className={`btn ${k === (links.appstore ? "appstore" : "live") ? "btn-primary" : "btn-ghost"}`}
                    href={links[k]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {k === "live" && links.appstore ? "Web app" : LINK_LABELS[k]}{" "}
                    <span className="arr">→</span>
                  </a>
                ) : null
              )}
            </div>
          )}
        </header>

        {image && (
          <div ref={heroRef} className="scroll-reveal posthero">
            <img src={image} alt={`${title} screenshot`} loading="lazy" />
          </div>
        )}

        <div
          ref={contentRef}
          className="scroll-reveal postbody body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
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
        tech
        links {
          appstore
          github
          npm
          live
        }
        image
      }
    }
  }
`;
