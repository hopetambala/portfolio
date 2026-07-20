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
              categories
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

  const categories = [
    ...new Set(
      data.allMarkdownRemark.edges.flatMap(
        (edge) =>
          edge.node.frontmatter.categories || [edge.node.frontmatter.category]
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

  const WORK_CATEGORIES = [
    "design-systems",
    "nonprofit",
    "apps",
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
