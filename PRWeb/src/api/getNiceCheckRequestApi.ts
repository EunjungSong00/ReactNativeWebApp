import {gql} from 'graphql-request';
import {GraphQLClient} from 'graphql-request';

export default async function getNiceCheckRequestApi() {
  const endpoint = 'http://api.carmerce.co.kr/dev/partner/graphql';
  const query = gql`
    query {
      getNiceCheckRequest(
        request:
         {
           errorUrl: "${endpoint}/auth/error", 
           returnUrl: "${endpoint}/auth/nice"
         }
      )
    }
  `;
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDY5NzI1NzAsImlzcyI6InBhcnRuZXIiLCJ0eXBlIjoiYWNjZXNzIiwidG9rZW5JZCI6IjEzMiIsImV4cCI6MTY0Njk3NDM3MCwicGFyYW1zIjp7ImlkIjoiMTMyIiwibG9naW5JZCI6Imh5cGFyazEyMzQifX0.WA70ycYadBQbMVSBvz5tsZ5z1gD0QI0OrskCFhkfgFo`
    }
  });

  return await graphQLClient.request(query);
}
