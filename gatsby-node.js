const path = require("path");
const { createClient } = require("@sanity/client");

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  token: process.env.SANITY_TOKEN,
  useCdn: true,
  apiVersion: "2024-12-26",
});

// Create custom Gatsby nodes from Sanity data
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
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

  // Create category pages
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

  // Create journal entry pages — pass full data via context
  data.allSanityPost.nodes.forEach((post) => {
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
