import gql from "graphql-tag";

const BIO_MUTATION = gql `
    mutation UpdateBio($input: updateUserInput!){
    updateUser(input: $input) {
        user {
            bio
        }
    }
    }
`;

export default BIO_MUTATION;
