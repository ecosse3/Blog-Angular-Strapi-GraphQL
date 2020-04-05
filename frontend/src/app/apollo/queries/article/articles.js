import gql from "graphql-tag";

const ARTICLES_QUERY = gql `
  query Articles($id: ID) {
    articles(where: {user: {id: $id}}) {
      id
      title
      category {
        id
        name
      }
      image {
        url
      }
    }
  }
`;

export default ARTICLES_QUERY;
