import "../css/_main.css";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "gatsby";
import Layout from "../components/layout/layout";
import { useScrollReveal } from "../motion";
import { useTheme } from "../theme/theme-provider";

// Curated "Selected work" list for Home (text-only, hover-driven). Order per
// the redesign spec: Collage → dLite → Puente → Commonplace → dLite WC.
const SELECTED = [
  { slug: "collage-etsy", title: "Collage @ Etsy", role: "Sr. SWE · Design Systems", tags: "React/TS · Storybook" },
  { slug: "commonplace-cityblock", title: "Commonplace @ Cityblock", role: "Sr. UX Engineer", tags: "React/TS · Figma", image: "/images/projects/commonplace-cityblock.gif" },
  { slug: "puente-collect", title: "Puente Collect & Manage", role: "Nonprofit", tags: "React Native · GraphQL" },
  { slug: "dlite-tokens", title: "dLite Design System", role: "Open source", tags: "Tokens · DTCG", image: "/images/projects/dlite-tokens.gif" },
  { slug: "dlite-web-components", title: "dLite Web Components", role: "Open source", tags: "Lit · a11y", image: "/images/projects/dlite-web-components.gif" },
];

const STATS = [
  { n: "10+", l: "Years shipping" },
  { n: "5", l: "Design systems" },
  { n: "1", l: "Nonprofit co-founded" },
];

function SelectedWork() {
  const peekRef = useRef(null);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  // Portal the preview to <body> so its `position: fixed` is viewport-relative
  // — the surrounding `.scroll-reveal` ancestor has `will-change: transform`,
  // which would otherwise make "fixed" relative to that element.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onMove = useCallback((e) => {
    const el = peekRef.current;
    if (!el) return;
    el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(1)`;
  }, []);

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => setShow(false)}
    >
      <div className="listC">
        {SELECTED.map((p, i) => (
          <Link
            to={`/${p.slug}`}
            className="litem"
            key={p.slug}
            onMouseEnter={() => {
              setCaption(p.title);
              setImage(p.image || null);
              setShow(true);
            }}
          >
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            <span className="tt">{p.title}</span>
            <span className="meta">
              <span className="role">{p.role}</span>
              <span className="tags">{p.tags}</span>
            </span>
          </Link>
        ))}
      </div>

      {mounted &&
        createPortal(
          <div ref={peekRef} className={`peek ${show ? "show" : ""}`} aria-hidden="true">
            <div className="media">
              {image && <img src={image} alt="" />}
              <span className="media-cap">{caption}</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function Showcase() {
  const { brand, brands, setBrand } = useTheme();
  return (
    <div className="showcaseC">
      <span className="kicker" style={{ justifyContent: "center" }}>
        Powered by my design system
      </span>
      <h2 className="h-lg" style={{ marginTop: "1rem", maxWidth: "20ch", marginInline: "auto" }}>
        This whole site re-skins with my open-source tokens.
      </h2>
      <p className="body" style={{ maxWidth: "52ch", margin: "1rem auto 0" }}>
        Every color, radius, and shadow is a live{" "}
        <code className="mono">style-dictionary-dlite</code> token. Tap a brand
        to watch it switch — the same engine ships in the npm package.
      </p>
      <div className="chips">
        {brands.map((b) => (
          <button
            key={b.path}
            className={`chip ${b.path === brand ? "is-active" : ""}`}
            onClick={() => setBrand(b.path)}
          >
            <span className="sw">
              <i style={{ background: b.primary }} />
              <i style={{ background: b.secondary }} />
            </span>
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const Home = () => {
  const listRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const showcaseRef = useScrollReveal();

  return (
    <Layout>
      {/* 1. Hero */}
      <section className="wrap heroC ed">
        <span className="kicker">Software engineer · Design technologist</span>
        <h1 className="display" style={{ marginTop: "1.2rem" }}>
          I build design systems for{" "}
          <span className="brandword">beautifully simple</span> products.
        </h1>
        <div className="heroC-sub">
          <p className="lede">
            A decade of skin in the game across cross-platform mobile and web —
            turning fuzzy ideas into systems teams can actually build on.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/work">
              View work <span className="arr">→</span>
            </Link>
            <a className="btn btn-ghost" href="mailto:hopetambala@gmail.com">
              Contact
            </a>
          </div>
        </div>
        <span className="scrollcue">
          <span className="ln" /> Scroll to explore
        </span>
      </section>

      {/* 2. Selected work */}
      <section className="wrap ed-section ed-section--border ed">
        <span className="kicker">Selected work</span>
        <h2 className="h-lg" style={{ margin: "1rem 0 clamp(1.5rem, 4vw, 2.5rem)" }}>
          A few things I'm proud of.
        </h2>
        <div ref={listRef} className="scroll-reveal">
          <SelectedWork />
        </div>
      </section>

      {/* 3. About teaser + stats */}
      <section className="wrap ed-section ed-section--border ed">
        <div ref={aboutRef} className="scroll-reveal splitC">
          <div>
            <span className="kicker">About</span>
            <h2 className="h-lg" style={{ marginTop: "1rem" }}>
              From candlelight to design systems.
            </h2>
            <div className="statline">
              {STATS.map((s) => (
                <div className="stat" key={s.l}>
                  <span className="n">{s.n}</span>
                  <span className="l">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="body">
            <p>
              Serving in the Peace Corps, I found the spark for the
              transformative power of technology — through candlelit nights over
              paper health records, I learned what it feels like to{" "}
              <strong>not</strong> have the internet at your fingertips.
            </p>
            <p>
              Today I'm a senior engineer building design systems at Etsy, and a
              co-founder of <strong>Puente</strong>, a nonprofit shipping
              real-time tools for health work in the field.
            </p>
            <p>
              <Link to="/about" className="wcard-go" style={{ marginTop: "0.5rem" }}>
                Read the full story <span className="arr">→</span>
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 4. Showcase */}
      <section className="wrap ed-section ed-section--border ed">
        <div ref={showcaseRef} className="scroll-reveal">
          <Showcase />
        </div>
      </section>
    </Layout>
  );
};

export default Home;
