import gql from "graphql-tag";

const COUNT_VISITED_COUNTRIES = gql `
  query COUNT_VISITED_COUNTRIES {
    users(where: { countriesCount_gt: 0 }, sort: "countriesCount:desc") {
        id
        username
        avatar {
          url
        }
        countriesCount
        countries
      }
    }
`;


export default COUNT_VISITED_COUNTRIES;
