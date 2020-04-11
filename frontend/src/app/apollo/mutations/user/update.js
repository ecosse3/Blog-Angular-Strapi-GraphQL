import gql from "graphql-tag";

const USER_UPDATE = gql `
    mutation UpdateUser($input: updateUserInput!){
        updateUser(input: $input) {
            user {
                id
                created_at
                updated_at
                confirmed
                blocked
                email
                username
                bio
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
    }
`;

export default USER_UPDATE;
