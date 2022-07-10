import {gql, request} from 'graphql-request';
import {OsType} from '../../../screen/login/LoginScreen';

export default async function signInCarmerceUserApi(email: string, password: string, appToken?: string, osType: OsType) {
  const endpoint = 'https://customer.carmerce.co.kr/gcp/dev/carmerce/b2c/graphql';
  // const endpoint = Config.NEXT_PUBLIC_API_URL;
  const mutation = gql`
        mutation {
            signInCarmerceUser (
              input:{
                email: "${email}"
                password: "${password}"
                ${appToken ? `appToken: "${appToken}"` : ''}
                osType: ${osType === 1 ? 'ANDROID' : 'IOS'}
              }
              ){
                accessToken
                refreshToken
                carmerceUser {
                      birthDate
                      id
                      email
                      name
                      phoneNumber
                      appToken
                }
          }
        }
    `;
  // console.log('mutation', mutation);
  // console.log('endpoint', endpoint);

  return await request(endpoint, mutation);
}
