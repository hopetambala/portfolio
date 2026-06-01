# Hope's Portfolio

A personal portfolio and photo journal built with Gatsby, React, and Sanity CMS.

## Tech Stack

- **Framework**: [Gatsby 5](https://www.gatsbyjs.com/) (React 18)
- **Content**: Local Markdown files with YAML frontmatter
- **Photo Journal**: [Sanity CMS](https://www.sanity.io/) via `@sanity/client` (GROQ queries)
- **Styling**: CSS Modules with custom design tokens
- **Testing**: Jest (markdown frontmatter validation)
- **Analytics**: Google Analytics (gtag)

## Project Structure

```
src/
├── components/       # Reusable UI components (Card, Grid, Section, etc.)
├── css/              # Global styles, variables, fonts, reset
├── data/
│   ├── projects/     # Project markdown files
│   ├── work-experience/ # Work experience markdown files
│   ├── landing.md    # Homepage content
│   └── about.md      # About page content
├── pages/            # Route pages (index, about, journal)
└── assets/           # Fonts and images
```

## Getting Started

### Prerequisites

- Node.js >= 24
- Yarn

### Installation

```bash
yarn install
```

### Environment Variables

Create a `.env.development` file:

```
SANITY_PROJECT_ID=<your sanity project id>
SANITY_DATASET=<your dataset name>
SANITY_TOKEN=<your read token>
```

### Development

```bash
yarn develop        # Start dev server at localhost:8000
yarn build          # Production build
yarn serve          # Serve production build locally
yarn clean          # Clear Gatsby cache
yarn test           # Run markdown validation tests
yarn prettier       # Format all files
```

## Content

### Adding a Project

Create a new `.md` file in `src/data/projects/` with this frontmatter:

```yaml
---
title: "Project Name"
slug: "project-name"
category: "design-systems" # design-systems | nonprofit | personal | prototypes | professional
role: "Your Role"
date: "YYYY-MM-DD"
selectedProject: false # true to feature on homepage
links:
  github: "https://github.com/..."
  npm: "https://www.npmjs.com/..."
  live: "https://..."
---

Your project description in Markdown.
```

### Adding Work Experience

Create a new `.md` file in `src/data/work-experience/`:

```yaml
---
type: "work-experience"
company: "Company Name"
role: "Your Title"
skills:
  - "Skill 1"
  - "Skill 2"
time: "2023 - Present"
order: 5 # Higher = appears first
---

Description of your work.
```

### Photo Journal

The `/journal` page pulls photo entries from Sanity CMS (`projectId: mesj4ezg`, `dataset: production`).

Use the hosted Studio to add or edit images:

1. Open [https://mesj4ezg.sanity.studio/](https://mesj4ezg.sanity.studio/)
2. Go to **Post**
3. Open an existing post or create a new one
4. Upload images in **Main image** and/or **Gallery**
5. Publish the document

Run Studio locally if needed:

1. `cd ../portfolio-studio`
2. `npm run dev`
3. Open `http://localhost:3333`

## Project GIF Capture

Project demo GIFs are generated with Playwright and stored in `static/images/projects/`.

```bash
# Capture GIFs for all projects with a live URL
npm run screenshot:projects

# Capture a single project
npm run screenshot:projects -- --only=stakeout
```

**How it works** (`scripts/screenshot-projects.js`):
- Auto-discovers any `src/data/projects/*.md` file that has a `links.live` field
- **Default**: 6-second scroll-based capture
- **Custom captures**: projects needing specific interactions (editor flows, drag-and-drop, etc.) define their own sequence in the `CUSTOM_CAPTURES` map, keyed by slug

**Adding a custom capture for a new project:**
1. Add the project markdown with `links: { live: "https://..." }`
2. Add a handler in `CUSTOM_CAPTURES` inside `screenshot-projects.js`
3. Run `npm run screenshot:projects -- --only=<slug>`

### Existing custom captures

| Slug | Interaction sequence |
|------|----------------------|
| `stakeout` | Landing → editor → load sample property → drag fence element → toggle 3D view |

### Prerequisites

- `playwright` chromium installed: `npx playwright install chromium`
- `gif-encoder-2` and `pngjs` (already in `devDependencies`)

## Testing

```bash
yarn test
```

Tests validate that all Markdown files have:
- Valid YAML frontmatter (no syntax errors)
- Required fields with correct types
- Unique slugs (no duplicates)

## License

MIT
