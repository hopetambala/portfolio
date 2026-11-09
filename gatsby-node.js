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

// Camera settings for a photo caption. `exif` on the image object is filled by
// the Studio at upload (and by the one-off backfill); `asset->metadata.exif`
// is Sanity's own extraction, which lacks Make/Model. Field-level coalesce so
// each value falls back on its own.
const EXIF_FIELDS = [
  "Make",
  "Model",
  "LensModel",
  "FNumber",
  "ExposureTime",
  "ISO",
  "FocalLength",
];
const EXIF_PROJECTION = `"exif": {${EXIF_FIELDS.map(
  (f) => `"${f}": coalesce(exif.${f}, asset->metadata.exif.${f})`
).join(", ")}}`;

// Pixel size of a photo, so the page can reserve its space before it loads.
// Without it the masonry gallery reshuffles as each lazy image arrives.
const SIZE_PROJECTION = `"size": asset->metadata.dimensions { width, height }`;

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type SanityExif {
      Make: String
      Model: String
      LensModel: String
      FNumber: Float
      ExposureTime: Float
      ISO: Float
      FocalLength: Float
    }
    type SanityImageSize { width: Int, height: Int }
    type SanityImageRef {
      alt: String
      url: String
      size: SanityImageSize
      exif: SanityExif
    }
    type SanityGalleryImage { url: String, size: SanityImageSize, exif: SanityExif }
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

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  if (!hasSanity) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[sanity] SANITY_PROJECT_ID is required for a production build."
      );
    }
    console.warn(
      "[sanity] SANITY_PROJECT_ID not set — skipping journal sourcing in development."
    );
    return;
  }
  let posts;
  try {
    posts = await sanityClient.fetch(
      `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        mainImage { alt, "url": asset->url, ${SIZE_PROJECTION}, ${EXIF_PROJECTION} },
        gallery { images[] { "url": asset->url, ${SIZE_PROJECTION}, ${EXIF_PROJECTION} } },
        publishedAt
      }`
    );
  } catch (error) {
    // Do not publish a successful build with an empty journal when the CMS is
    // unavailable. Failing here keeps the last healthy deployment online.
    throw new Error(`[sanity] Journal sourcing failed: ${error.message}`);
  }

  if (!Array.isArray(posts)) return;

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
              active
            }
          }
        }
      }
      allSanityPost {
        nodes {
          slug
          title
          publishedAt(formatString: "MMMM D, YYYY")
          mainImage {
            alt
            url
            size {
              width
              height
            }
            exif {
              Make
              Model
              LensModel
              FNumber
              ExposureTime
              ISO
              FocalLength
            }
          }
          gallery {
            images {
              url
              size {
                width
                height
              }
              exif {
                Make
                Model
                LensModel
                FNumber
                ExposureTime
                ISO
                FocalLength
              }
            }
          }
        }
      }
    }
  `);

  const activeProjects = data.allMarkdownRemark.edges.filter(
    (edge) => edge.node.frontmatter.active !== false
  );

  activeProjects.forEach((edge) => {
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
      activeProjects.flatMap(
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
