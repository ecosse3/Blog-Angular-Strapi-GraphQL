import gql from "graphql-tag";

const LOGIN_MUTATION = gql `
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      user {
        id
        email
        username
        confirmed
        blocked
        role {
          id
          name
          description
          type
        }
        }
      jwt
    }
  }
`;

export default LOGIN_MUTATION;
