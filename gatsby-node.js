const path = require("path");

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
};
