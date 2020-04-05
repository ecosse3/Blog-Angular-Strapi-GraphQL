import gql from "graphql-tag";

const LOGIN_MUTATION = gql `
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      user {
        id
        email
        username
        role {
          id
          name
        }
        }
      jwt
    }
  }
`;

export default LOGIN_MUTATION;
