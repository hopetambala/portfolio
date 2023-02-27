import React from "react";
import { graphql } from "gatsby";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import { Image } from "../image/image";
import Layout from "../layout/layout";

const Bold = ({ children }) => <span>{children}</span>;
const Text = ({ children }) => <p>{children}</p>;

const renderOptions = (richText) => {
  const { references } = richText;
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <Bold>{text}</Bold>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { id: nodeId } = node.data.target.sys;
        const { title, url } = references.find(
          (element) => element.contentful_id === nodeId
        );
        return <Image source={url} alt={title} size="xl" />;
      },
    },
  };
  return options;
};

export default function Post({ data }) {
  const { title, description } = data.contentfulPortfolioItem;
  const parsedHTML = documentToReactComponents(
    JSON.parse(description.raw),
    renderOptions(description)
  );
  console.log(parsedHTML);
  return (
    <Layout>
      <h1>{title}</h1>
      {description && parsedHTML}
    </Layout>
  );
}

export const query = graphql`
  query MyQuery($slug: String!) {
    contentfulPortfolioItem(slug: { eq: $slug }) {
      title
      subtitle
      description {
        raw
        references {
          ... on ContentfulAsset {
            contentful_id
            __typename
            title
            url
          }
        }
      }
    }
  }
`;
