import gql from "graphql-tag";

const COUNT_USER_ARTICLES = gql `
  query COUNT_USER_ARTICLES($id: ID!) {
    articlesConnection(where: {user: {id: $id}}) {
        aggregate {
          count
        }
    }
  }
`;


export default COUNT_USER_ARTICLES;
