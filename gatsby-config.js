/**
 * @type {import('gatsby').GatsbyConfig}
 */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Hope's Portfolio`,
    siteUrl: `https://www.hopetambala.com`,
    description: `UX Engineering Portfolio`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-8LKGJFW4N8"],
        pluginConfig: {
          head: true,
          respectDNT: true,
          exclude: ["/preview/**", "/do-not-track/me/too/"],
        },
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/src/data/projects`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `work-experience`,
        path: `${__dirname}/src/data/work-experience`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages-data`,
        path: `${__dirname}/src/data`,
        ignore: [`**/projects/**`, `**/work-experience/**`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/assets/images/icon.png",
      },
    },
  ],
};
