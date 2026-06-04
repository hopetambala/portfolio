import "../css/_main.css";
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout/layout";
import { useScrollReveal, useStaggerReveal } from "../motion";

const RESUME_URL =
  "https://drive.google.com/file/d/1iH8Yu5irK5jqEYz8NkCPPRHTGOabmDJ2/view?usp=sharing";

const SKILLS = [
  {
    title: "Design Systems",
    blurb: "Tokens, components, and the tooling that keeps them adopted at scale.",
    items: ["Design tokens (DTCG)", "Component libraries", "Codemods & migrations", "Storybook", "Accessibility"],
  },
  {
    title: "Product Engineering",
    blurb: "Full-stack delivery across cross-platform mobile and web.",
    items: ["React / TypeScript", "React Native", "Node · GraphQL · Express", "Next.js", "Cloud (AWS)"],
  },
  {
    title: "Craft & Creative",
    blurb: "The details that make products feel considered, and a camera on the side.",
    items: ["Motion & interaction", "CSS architecture", "Prototyping", "Photography", "Figma"],
  },
];

const AboutPage = () => {
  const data = useStaticQuery(graphql`
    query {
      about: markdownRemark(frontmatter: { type: { eq: "about" } }) {
        html
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
          }
        }
      }
    }
  `);

  const about = data.about;
  const experiences = data.workExperiences.nodes;

  const storyRef = useScrollReveal();
  const tlineRef = useStaggerReveal();
  const skillsRef = useStaggerReveal();

  return (
    <Layout>
      {/* 1. Page header */}
      <div className="wrap pagehead ed">
        <span className="kicker">About</span>
        <h1 className="display" style={{ marginTop: "0.5rem" }}>
          Hi, I'm Hope.
        </h1>
        <div className="lead-row">
          <p className="lede">
            Senior software engineer and design technologist. I build design
            systems and the products they power.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href="mailto:hopetambala@gmail.com">
              Hit me up <span className="arr">→</span>
            </a>
            <a className="btn btn-ghost" href={RESUME_URL} target="_blank" rel="noreferrer">
              Résumé
            </a>
          </div>
        </div>
      </div>

      {/* 2. Portrait + why */}
      <section className="wrap ed-section ed-section--border ed">
        <div ref={storyRef} className="scroll-reveal splitC">
          <div className="media" style={{ aspectRatio: "4 / 5" }}>
            <img src="/images/about/personal.jpeg" alt="Hope Tambala" />
          </div>
          <div>
            <h2 className="h-lg">From candlelight to design systems.</h2>
            <div
              className="body"
              style={{ marginTop: "1.2rem" }}
              dangerouslySetInnerHTML={{ __html: about?.html }}
            />
          </div>
        </div>
      </section>

      {/* 3. Experience timeline */}
      <section className="wrap ed-section ed-section--border ed">
        <span className="kicker">Experience</span>
        <h2 className="h-lg" style={{ margin: "1rem 0 clamp(1.5rem, 4vw, 2.5rem)" }}>
          Where I've built.
        </h2>
        <div className="tline" ref={tlineRef}>
          {experiences.map((exp) => {
            const fm = exp.frontmatter;
            return (
              <div className="tline-row" key={fm.company}>
                <div className="tline-when">{fm.time}</div>
                <div className="tline-co">
                  <h3>{fm.company}</h3>
                  <span className="rl">{fm.role}</span>
                  <div className="ds" dangerouslySetInnerHTML={{ __html: exp.html }} />
                </div>
                <div className="tline-stack">
                  {(fm.skills || []).map((s) => (
                    <span className="stk" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Skills */}
      <section className="wrap ed-section ed-section--border ed">
        <span className="kicker">What I do</span>
        <h2 className="h-lg" style={{ margin: "1rem 0 clamp(1.5rem, 4vw, 2.5rem)" }}>
          A few things I'm good at.
        </h2>
        <div className="skills" ref={skillsRef}>
          {SKILLS.map((s) => (
            <div className="skill" key={s.title}>
              <h4>{s.title}</h4>
              <p>{s.blurb}</p>
              <ul>
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
