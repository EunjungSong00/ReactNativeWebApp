import {gql} from 'graphql-request';
import {GraphQLClient} from "graphql-request";
import Config from "react-native-config";

export default async function checkDuplicateCarmerceUserEmailApi(email: string) {
    const endpoint = Config.NEXT_PUBLIC_API_URL;
    const query = gql`
    query {
      checkDuplicateCarmerceUserEmail(
        email: "${email}"
      ) {
        isDuplicate
      }
    }
  `;

     // console.log('query', query);
    const graphQLClient = new GraphQLClient(endpoint);

    return await graphQLClient.request(query);
}
