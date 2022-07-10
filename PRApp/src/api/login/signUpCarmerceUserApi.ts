import {gql, request} from 'graphql-request';
import Config from 'react-native-config';

export default async function signUpCarmerceUserApi(email: string, password: string, encodeData: string) {
    const endpoint = Config.NEXT_PUBLIC_API_URL;
    const mutation = gql`
        mutation {
            signUpCarmerceUser (
              input:{
                email: "${email}"
                password: "${password}"
                niceIdentityAuthenticationData: "${encodeData}"
              }
              ){
                id
              }
        }
    `;
    console.log('mutation', mutation);

    return await request(endpoint, mutation);
}
