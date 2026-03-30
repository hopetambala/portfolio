# Portfolio IA Redesign Plan — Editorial Style + Markdown (No Contentful)

## Summary
Redesign portfolio with editorial, personality-forward homepage (inspired by andreaference.com). Replace Contentful with local Markdown files (frontmatter + body). Category pages, dedicated About and Work pages, balanced nav.

## Data Architecture
- src/data/projects/*.md — frontmatter (title, slug, category, role, date, links, selectedProject) + Markdown body
- src/data/work-experience/*.md — frontmatter (company, role, skills, time, order) + Markdown body
- src/data/about.md — frontmatter (title, funFacts[]) + Markdown bio
- src/data/landing.md — frontmatter (title, subtitle, brandHook) + Markdown intro
- Uses gatsby-source-filesystem + gatsby-transformer-remark (both already in project)
- Removes: gatsby-source-contentful, contentful, @contentful/rich-text-react-renderer

## Proposed IA
```
/                          → Editorial homepage (brand hook, category cards, recent work, about teaser, contact CTA)
/about                     → Dedicated about page (bio, fun facts, highlights, FAQ)
/work                      → Work Experience page
/projects/design-systems   → Design Engineering (dLite)
/projects/nonprofit        → Nonprofit Engineering (Puente)
/projects/personal         → Personal Projects (Photography)
/projects/prototypes       → Fun Prototypes (Survivor, hopeandcarly)
/:slug                     → Individual project detail pages
```

## Homepage Editorial Flow
1. Hero — brand hook (TBD personality-driven) + intro + profile image + CTA to About
2. Explore My Work — 4 large visual category cards linking to /projects/{category}
3. About teaser — short bio snippet + CTA to /about
4. Dive Deep — 3-4 featured projects (reuse selectedProject flag) across all categories
5. Contact CTA — "Let's build something" + email + resume link

## Navigation
- Left: Name/logo → /
- Center/right: Projects, About, Work, Resume
- Far right: CTA button for contact

## Phases
1. Data Migration (Markdown files + gatsby-config swap)
2. Query Migration (gatsby-node.js + page queries)
3. New Pages (category-page, work, about)
4. Homepage Redesign (editorial sections)
5. Navigation + Detail Pages
6. Cleanup (remove Contentful deps)
