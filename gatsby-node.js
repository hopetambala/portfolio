const path = require("path");
const { createClient } = require("@sanity/client");

const hasSanity = Boolean(process.env.SANITY_PROJECT_ID);
const sanityClient = hasSanity
  ? createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || "production",
      token: process.env.SANITY_TOKEN,
      useCdn: true,
      apiVersion: "2024-12-26",
    })
  : null;

// Define the SanityPost shape up front so `allSanityPost` queries resolve even
// when Sanity isn't configured (e.g. a prod build with no SANITY_* env). With
// creds present, sourced nodes simply conform to this type.
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type SanityImageRef { alt: String, url: String }
    type SanityGalleryImage { url: String }
    type SanityGallery { images: [SanityGalleryImage] }
    type SanityPost implements Node @dontInfer {
      _id: String
      title: String
      slug: String
      publishedAt: Date @dateformat
      mainImage: SanityImageRef
      gallery: SanityGallery
    }
  `);
};

// Create custom Gatsby nodes from Sanity data
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  if (!hasSanity) {
    console.warn(
      "[sanity] SANITY_PROJECT_ID not set — skipping journal sourcing. Journal will be empty."
    );
    return;
  }
  const posts = await sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      mainImage { alt, "url": asset->url },
      gallery { images[] { "url": asset->url } },
      publishedAt
    }`
  );

  posts.forEach((post) => {
    actions.createNode({
      ...post,
      id: createNodeId(`sanity-post-${post._id}`),
      internal: {
        type: "SanityPost",
        contentDigest: createContentDigest(post),
      },
    });
  });
};

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/data/projects/" } }
      ) {
        edges {
          node {
            frontmatter {
              slug
              category
            }
          }
        }
      }
      allSanityPost {
        nodes {
          slug
          title
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

  // Create individual project pages
  data.allMarkdownRemark.edges.forEach((edge) => {
    const slug = edge.node.frontmatter.slug;
    actions.createPage({
      path: slug,
      component: path.resolve(
        `./src/components/portfolio-post/portfolio-post.js`
      ),
      context: { slug: slug },
    });
  });

  // Legacy per-category pages (/projects/{category}) — keep building so old
  // links don't 404, but the canonical filter UI now lives at /work/{category}.
  const categories = [
    ...new Set(
      data.allMarkdownRemark.edges.map(
        (edge) => edge.node.frontmatter.category
      )
    ),
  ];
  categories.forEach((category) => {
    actions.createPage({
      path: `projects/${category}`,
      component: path.resolve(
        `./src/components/category-page/category-page.js`
      ),
      context: { category: category },
    });
  });

  // Filtered work pages — /work/{category} deep-links into the Work archive.
  // Uses the same work.js page component; `initialCategory` seeds the filter.
  const WORK_CATEGORIES = [
    "design-systems",
    "nonprofit",
    "prototypes",
    "personal",
  ];
  WORK_CATEGORIES.forEach((category) => {
    actions.createPage({
      path: `work/${category}`,
      component: path.resolve(`./src/pages/work.js`),
      context: { initialCategory: category },
    });
  });

  // Create journal entry pages — pass full data via context
  const sanityNodes = data.allSanityPost ? data.allSanityPost.nodes : [];
  sanityNodes.forEach((post) => {
    if (post.slug) {
      actions.createPage({
        path: `journal/${post.slug}`,
        component: path.resolve(
          `./src/components/journal-post/journal-post.js`
        ),
        context: { post },
      });
    }
  });
};
