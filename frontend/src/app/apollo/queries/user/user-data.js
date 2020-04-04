import gql from "graphql-tag";

const USER_DATA = gql `
  query USERDATA($id: ID!) {
    user(id: $id) {
    created_at
    updated_at
    role {
      id
      name
      description
      type
    }
    avatar {
      name
      url
      size
    }
    }
  }
`;


export default USER_DATA;
