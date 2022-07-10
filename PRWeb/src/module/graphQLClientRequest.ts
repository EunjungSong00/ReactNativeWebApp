import issueTokenApi from '../api/login/issueTokenApi';
import {GraphQLClient} from 'graphql-request';
import {GetServerSidePropsContext} from 'next';
import {ParsedUrlQuery} from 'querystring';
import nookies, {parseCookies} from 'nookies';
import router from 'next/router';

const TOKEN_EXPRIED_CODE = '401';
const redirectObject = {
  redirect: {permanent: false, destination: '/login'},
  props: {}
};

export type PageRequestType = {
  pageNo?: number;
  pageSize?: number;
};

export type ApiOptionsType = {
  context?: GetServerSidePropsContext<ParsedUrlQuery>;
  getGql?: boolean;
};

export type ContextType = GetServerSidePropsContext<ParsedUrlQuery>;

const graphQLClientRequest = async (
  query: string | string[],
  {
    context,
    newAccessToken,
    isMultipleRequest = false
  }: {
    context?: ContextType;
    newAccessToken?: string;
    isMultipleRequest?: boolean;
  }
): Promise<any> => {
  isMultipleRequest && graphQLClientMultipleRequest(query as string[]);
  const cookies = context ? nookies.get(context) : parseCookies();
  const accessToken = cookies.carUserAccessToken;
  const isServerSide = !!context;

  if (accessToken) {
    const endpoint = process.env.NEXT_PUBLIC_API_URL || '';
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${newAccessToken || accessToken}`,
        'carmerce-User-meta':
          process.env.NEXT_PUBLIC_DOMAIN?.includes('stage.') || process.env.NEXT_PUBLIC_DOMAIN?.includes('dev.') || process.env.NEXT_PUBLIC_DOMAIN?.includes('localhost')
            ? 'skip-validation'
            : ''
      }
    });
    graphQLClient
      .request(query as string)
      .then((response: any) => {
        if (response === TOKEN_EXPRIED_CODE)
          // return 토큰 만료시 로그아웃
          return isServerSide ? redirectObject : router.push('/login');
        // return api 성공
        return isServerSide
          ? newAccessToken
            ? response
            : {
                props: {
                  response: response || '',
                  query: context.query,
                  cookies: nookies.get(context)
                }
              }
          : response;
      })
      .catch(async (error) => {
        const extensions: any = error?.response?.errors[0]?.extensions;

        if (extensions?.code === TOKEN_EXPRIED_CODE) {
          // console.log('엑세스 토큰 만료');
          const refreshToken = cookies.carUserRefreshToken;
          issueTokenApi(refreshToken)
            .then((newTokens) => {
              const newAccessToken = newTokens.accessToken;
              const newRefreshToken = newTokens.refreshToken;
              if (newTokens !== TOKEN_EXPRIED_CODE && newTokens !== '500') {
                // console.log('엑세스 토큰 발급');
                nookies.set(context || null, 'carUserAccessToken', newAccessToken, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: '/'
                });
                nookies.set(context || null, 'carUserRefreshToken', newRefreshToken, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: '/'
                });
                // return 재발급 받은 토큰으로 api 재요청
                return graphQLClientRequest(query, {context, newAccessToken});
              }
              // console.log('리프레시 토큰 만료');
              // return refresh 만료
              return TOKEN_EXPRIED_CODE;
            })
            .catch((error) => {
              // return 토큰 재발급 exception
              return error.response;
            });
        }
        // console.log('error.response', error.response);
        // return api 오류
        return error.response;
      });
    // console.log('성공');
  }
  // return 로그아웃
  return isServerSide ? redirectObject : router.push('/login');
};

export default graphQLClientRequest;

const graphQLClientMultipleRequest = async (gqls: string[], context?: GetServerSidePropsContext<ParsedUrlQuery>): Promise<any> =>
  graphQLClientRequest(getRequestGqls(gqls), {
    context
  })
    .then((response) => response)
    .catch((error) => error);

const getRequestGqls = (gqls: string[]): string => {
  let parsedGql = '{';
  gqls.map((gql: string) => {
    parsedGql += gql
      .replace(/query\s*/, '')
      .replace(/{\s*/, '')
      .replace(/}\s*$/, '');
  });
  parsedGql = `${parsedGql}}`;
  // console.log('parsedGql', parsedGql);
  return parsedGql;
};
