import gql from "graphql-tag";

const UPLOAD_FILE_MUTATION = gql `

mutation UploadFile($file: Upload!) {
  upload(file: $file) {
    name
    size
    url
  }
}
`;

export default UPLOAD_FILE_MUTATION;
