exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allContentfulPortfolioItem {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  data.allContentfulPortfolioItem.edges.forEach((edge) => {
    const slug = edge.node.slug;
    actions.createPage({
      path: slug,
      component: require.resolve(`./src/components/portfolio-post/index.js`),
      context: { slug: slug },
    });
  });
};
