import React from "react";
import { Link } from "gatsby";

export const CATEGORY_LABELS = {
  "design-systems": "Design Systems",
  nonprofit: "Nonprofit",
  prototypes: "App Prototypes",
  personal: "Personal Websites",
  professional: "Professional Work",
};

function primaryLink(links) {
  if (!links) return null;
  if (links.live) return { href: links.live, label: "Visit" };
  if (links.github) return { href: links.github, label: "GitHub" };
  return null;
}

export const WorkCard = ({ node }) => {
  const fm = node.frontmatter;
  const go = primaryLink(fm.links);
  return (
    <article className="wcard" data-category={fm.category}>
      <Link to={`/${fm.slug}`} className="wcard-media" aria-hidden="true" tabIndex={-1}>
        <div className="media">
          {fm.image && <img src={fm.image} alt="" loading="lazy" />}
          <span className="media-cap">{fm.title}</span>
        </div>
      </Link>
      <span className="wcard-cat">{CATEGORY_LABELS[fm.category] || fm.category}</span>
      <h3>
        <Link to={`/${fm.slug}`}>{fm.title}</Link>
      </h3>
      {fm.description && <p>{fm.description}</p>}
      <div className="wcard-foot">
        <div className="wcard-tags">
          {(fm.tech || []).map((t) => (
            <span className="wtag" key={t}>
              {t}
            </span>
          ))}
        </div>
        {go && (
          <a className="wcard-go" href={go.href} target="_blank" rel="noreferrer">
            {go.label} <span className="arr">→</span>
          </a>
        )}
      </div>
    </article>
  );
};
