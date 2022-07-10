import {gql, request} from 'graphql-request';
import graphQLClientRequest from "../graphQLClientRequest";
import requestGQL from '../../module/requestGQL';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

interface IWishCountApi {
    userId: string,
    navigation:StackNavigationProp
}

export default async function wishCountApi({userId, navigation}: IWishCountApi) {
    const query = gql`
     query {
        wishCount(
          filter: {
            userId: ${userId}
          }
        )
      }
    `;

    console.log('query', query)
    const response = await requestGQL(query, navigation);
    // console.log('actionWishApi', response);
    return response;
}
