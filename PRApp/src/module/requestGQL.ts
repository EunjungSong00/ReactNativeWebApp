import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import {GraphQLClient} from 'graphql-request';
import {clearStorage, getStorage, setStorage} from 'manageAsyncStorage';
import {activateErrorPopup} from './formatter';
import refreshCarmerceUserTokenApi from '../api/login/refreshCarmerceUserTokenApi';

export type RequestGQLOption = {
  onConfirm?: () => void;
  autoErrorPopup?: boolean;
};

const requestGQL = async (query: string, navigation: StackNavigationProp, option?: RequestGQLOption, newAccessToken?: string) => {
  const autoErrorPopup = option?.autoErrorPopup === undefined ? true : option?.autoErrorPopup;
  const token = await getStorage('token');
  // console.log('token', token);
  if (token) {
    const {accessToken, refreshToken} = token;
    // const endpoint = Config.NEXT_PUBLIC_API_URL;
    const endpoint = 'https://customer.carmerce.co.kr/gcp/dev/carmerce/b2c/graphql';
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${newAccessToken || accessToken}`
        // ,
        // 'carmerce-partner-meta':
        //   process.env.NEXT_PUBLIC_DOMAIN?.includes('stage.') || process.env.NEXT_PUBLIC_DOMAIN?.includes('dev.') || process.env.NEXT_PUBLIC_DOMAIN?.includes('localhost')
        //     ? 'skip-validation'
        //     : ''
      }
    });
    // console.log('newAccessToken', newAccessToken);
    // console.log('accessToken', accessToken);
    // console.log('requestGQLquery', query);
    return await graphQLClient
      .request(query)
      .then((response) => {
        console.log('requestGQL response', response);
        // activateErrorPopup(navigation, undefined);
        return response;
      })
      .catch(async (err) => {
        // console.log('requestGQL err', err);
        // console.log('requestGQL err', query);
        const {extensions}: any = err?.response?.errors[0];
        if (extensions?.code === '401') {
          // accessToken 만료시
          await refreshCarmerceUserTokenApi(refreshToken)
            .then((res) => {
              // accessToken 갱신 성공
              const _newAccessToken = res?.refreshCarmerceUserToken?.accessToken;
              if (_newAccessToken) {
                console.log('newAccessToken success', _newAccessToken);
                const token = {
                  accessToken: _newAccessToken,
                  refreshToken: res?.refreshCarmerceUserToken?.refreshToken
                };
                setStorage('token', token);
                return requestGQL(query, navigation, option, _newAccessToken);
              } else {
                return navigation.replace('LoginScreen');
              }
            })
            .catch((err) => {
              const errorMessage = err?.response?.errors?.[0]?.message;
              console.log('ERROR refreshCarmerceUserTokenApi', errorMessage, err);
              void clearStorage();
              return navigation.replace('LoginScreen');
            });
        } else {
          console.log('autoErrorPopup', autoErrorPopup);
          console.log('err?.response?.errors?.[0]?.message', err?.response?.errors?.[0]?.message);
          autoErrorPopup && activateErrorPopup(navigation, err?.response?.errors?.[0]?.message, () => option?.onConfirm?.());
          return err?.response?.errors?.[0];
        }
      });
  } else {
    console.log('토큰 없음');
    activateErrorPopup(navigation, '로그인 화면으로 이동합니다.', () => navigation.push('LoginScreen'));
  }
};

export default requestGQL;
