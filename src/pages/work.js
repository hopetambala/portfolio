import "../css/_main.css";
import React, { useMemo, useState } from "react";
import { useStaticQuery, graphql, navigate } from "gatsby";
import Layout from "../components/layout/layout";
import { WorkCard } from "../components/work-card/work-card";

// Display order for the Work archive. "professional" is intentionally out of
// scope (dropped per the redesign brief).
const CATEGORIES = [
  { key: "design-systems", label: "Design Systems", slug: "design-systems" },
  { key: "nonprofit",       label: "Nonprofit",       slug: "nonprofit"       },
  { key: "prototypes",      label: "App Prototypes",  slug: "prototypes"      },
  { key: "personal",        label: "Personal Websites", slug: "personal"      },
];
const IN_SCOPE = CATEGORIES.map((c) => c.key);

// This page is used both for /work (all projects) and for /work/{category}
// (gatsby-node creates those static pages and passes initialCategory via context).
const WorkPage = ({ pageContext = {} }) => {
  const { initialCategory = "all" } = pageContext;

  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/data/projects/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          frontmatter {
            title
            slug
            category
            description
            tech
            image
            links {
              live
              github
            }
          }
        }
      }
    }
  `);

  const projects = useMemo(
    () => data.projects.nodes.filter((n) => IN_SCOPE.includes(n.frontmatter.category)),
    [data]
  );

  const [active, setActive] = useState(initialCategory);

  const counts = useMemo(() => {
    const c = { all: projects.length };
    for (const cat of IN_SCOPE) {
      c[cat] = projects.filter((p) => p.frontmatter.category === cat).length;
    }
    return c;
  }, [projects]);

  // Ordered DS → Nonprofit → Prototypes → Personal for the "All" view.
  const ordered = useMemo(() => {
    const out = [];
    for (const cat of IN_SCOPE) {
      out.push(...projects.filter((p) => p.frontmatter.category === cat));
    }
    return out;
  }, [projects]);

  const visible =
    active === "all"
      ? ordered
      : ordered.filter((p) => p.frontmatter.category === active);

  const pad2 = (n) => String(n).padStart(2, "0");

  // Navigate to the canonical URL for the selected filter.
  const handleFilter = (key) => {
    setActive(key);
    navigate(key === "all" ? "/work/" : `/work/${key}/`, { replace: true });
  };

  // Re-sync if the page is reached via direct URL (e.g. browser back/forward).
  // pageContext only changes on a full page load, so we don't need an effect —
  // the useState initializer already reads initialCategory on mount.

  return (
    <Layout>
      <div className="wrap pagehead">
        <span className="kicker">Selected work</span>
        <h1 className="display" style={{ marginTop: "0.5rem" }}>
          Everything I've shipped.
        </h1>
        <div className="lead-row">
          <p className="lede">
            Design systems, nonprofit tools, and weekend prototypes — a working
            archive of the things I've built.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: "clamp(4rem, 9vw, 9rem)" }}>
        <nav className="filterbar" aria-label="Filter projects">
          <button
            className={`filter ${active === "all" ? "is-active" : ""}`}
            onClick={() => handleFilter("all")}
            aria-current={active === "all" ? "page" : undefined}
          >
            All <span className="c">{pad2(counts.all)}</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={`filter ${active === c.key ? "is-active" : ""}`}
              onClick={() => handleFilter(c.key)}
              aria-current={active === c.key ? "page" : undefined}
            >
              {c.label} <span className="c">{pad2(counts[c.key] || 0)}</span>
            </button>
          ))}
        </nav>

        {visible.length > 0 ? (
          <div className="workgrid">
            {visible.map((node) => (
              <WorkCard key={node.frontmatter.slug} node={node} />
            ))}
          </div>
        ) : (
          <p className="emptynote">Nothing here yet — check back soon.</p>
        )}
      </div>
    </Layout>
  );
};

export default WorkPage;
