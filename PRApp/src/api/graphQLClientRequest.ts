import {GraphQLClient} from 'graphql-request';
import Config from 'react-native-config';
import {clearStorage, getStorage, setStorage} from '../module/manageAsyncStorage';
import refreshCarmerceUserTokenApi from 'login/refreshCarmerceUserTokenApi';

const graphQLClientRequest = async (query: string, navigation?: any) => {
  const token = await getStorage('token');

  console.log('tokennnnn', token);
  if (token) {
    const {accessToken, refreshToken} = token;
    // console.log('tokennnnn', token);
    // const endpoint = Config.NEXT_PUBLIC_API_URL;
    const endpoint = 'https://customer.carmerce.co.kr/gcp/dev/carmerce/b2c/graphql';
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        'carmerce-partner-meta':
          process.env.NEXT_PUBLIC_DOMAIN?.includes('stage.') || process.env.NEXT_PUBLIC_DOMAIN?.includes('dev.') || process.env.NEXT_PUBLIC_DOMAIN?.includes('localhost')
            ? 'skip-validation'
            : ''
      }
    });
    // console.log('graphQLClientRequestquery', query);
    return await graphQLClient
      .request(query)
      .then((res) => {
        return res;
      })
      .catch(async (err) => {
        // console.log('graphQLClientRequesterr', err);
        // console.log('graphQLClientRequesterr3332424324', query);
        const {extensions}: any = err?.response?.errors[0];
        if (extensions?.code === '401') {
          // accessToken 만료시
          // FIXME:API 로 안넘어가는 문제 (은정)
          await refreshCarmerceUserTokenApi(refreshToken)
            .then((res) => {
              // AC TOKEN 갱신 성공
              if (res?.refreshCarmerceUserToken?.accessToken) {
                console.log('r');
                void setStorage('token', res?.refreshCarmerceUserToken);
                navigation.replace('GnbNavigatorScreen');
              } else {
                navigation.replace('LoginScreen');
              }
            })
            .catch((error) => {
              const errorMessage = error.response?.errors[0];
              // console.log('ERROR refreshCarmerceUserTokenApi', errorMessage);
              void clearStorage();
              navigation.replace('LoginScreen');
            });
        }
      });
  } else {
    navigation.replace('LoginScreen');
    console.log('토큰만료');
  }
};

export default graphQLClientRequest;
