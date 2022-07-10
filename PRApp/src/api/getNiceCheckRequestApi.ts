import {gql} from 'graphql-request';
import {GraphQLClient} from 'graphql-request';
import Config from "react-native-config";

export default async function getNiceCheckRequestApi() {
  const endpoint = Config.NEXT_PUBLIC_API_URL;
  // const endpoint = 'http://172.10.10.253:3000/graphql';
  const query = gql`
    query {
      niceIdentityAuthenticationRequestData
    }
  `;
  const graphQLClient = new GraphQLClient(endpoint);

  return await graphQLClient.request(query);
}
