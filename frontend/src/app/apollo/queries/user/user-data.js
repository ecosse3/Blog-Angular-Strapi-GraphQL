import gql from "graphql-tag";

const USER_DATA = gql `
  query USERDATA($id: ID!) {
    user(id: $id) {
    id
    email
    username
    role {
      id
      name
    }
    created_at
    updated_at
    bio
    avatar {
      name
      url
      size
    }
    countries
    countriesCount
    }
  }
`;


export default USER_DATA;
