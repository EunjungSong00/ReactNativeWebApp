import {gql, request} from 'graphql-request';
import Config from 'react-native-config';

export default async function sendMailForResetCarmerceUserPasswordApi({name, email}: {name: string; email: string}) {
  const endpoint = Config.NEXT_PUBLIC_API_URL;
  const mutation = gql`
        mutation {
            sendMailForResetCarmerceUserPassword (
              input:{
                name: "${name}"
                email: "${email}"
              }
              ){
                count
                requestId
              }
        }
    `;
  console.log('mutation', mutation);
  console.log('endpoint', endpoint);

  // const response = await request(endpoint, mutation).catch((error) => {
  //     // console.log('error', error);
  //     const extensions = error.response.errors[0].extensions;
  //     const errorMessage = error.response.errors[0].message;
  //     // alert(errorMessage);
  //     return undefined;
  // });
  // if (response) {
  //     // console.log('signInCarmerceUser', response.signInCarmerseUser.refreshToken);
  //     console.log('signInCarmerceUser', response);
  // }
  // return response;
  // return response && response?.signInCarmerceUser?.refreshToken;

  const response = await request(endpoint, mutation)
    .then((res) => res)
    .catch((err) => err.response);
  console.log('response', response);
  return response;
}
