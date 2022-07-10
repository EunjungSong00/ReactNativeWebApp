import {request} from 'graphql-request';

export default async function refreshCarmerceUserTokenApi(refreshToken: string) {
  const endpoint = 'https://customer.carmerce.co.kr/gcp/dev/carmerce/b2c/graphql';
  // const endpoint = Config.NEXT_PUBLIC_API_URL;
  const mutation = `
    mutation {
      refreshCarmerceUserToken(
        refreshToken: "${refreshToken}"
      ) {
        accessToken
        refreshToken
      }
    }
  `;
  // console.log('mutation', mutation);

  return await request(endpoint, mutation);
}
