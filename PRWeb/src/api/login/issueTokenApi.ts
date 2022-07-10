import { gql, request } from "graphql-request";

export default async function issueTokenApi(
  refreshToken: string | undefined
): Promise<any> {
  const endpoint = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "";
  const query = gql`
        mutation{
            issueToken(refreshToken: "${refreshToken}") {
                accessToken
                refreshToken
            }
        }
    `;
  const response = await request(endpoint, query).catch((error) => {
    const errorMessage = error.response?.errors[0];
    // console.log('refreshToken', refreshToken);
    console.error("ERROR issueTokenApi", errorMessage);
    return "401";
  });
  // AC TOKEN 갱신 성공
  if (response?.issueToken?.accessToken) {
    const newTokens = response?.issueToken;
    return newTokens;
  }

  return "401";
}
