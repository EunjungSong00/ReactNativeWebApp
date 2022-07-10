import {gql} from 'graphql-request';
import {GraphQLClient} from 'graphql-request';
import Config from "react-native-config";

export default async function findCarmerceUserEmailApi(encodeData: string) {
  const endpoint = Config.NEXT_PUBLIC_API_URL;
  const query = gql`
    query{
      findCarmerceUserEmail(
            niceIdentityAuthenticationData: "${encodeData}"
      ) {
        email
      }
    }
  `;
  console.log('endpoint', endpoint)
  console.log('query', query)
  const graphQLClient = new GraphQLClient(endpoint);

  return await graphQLClient.request(query);
}
