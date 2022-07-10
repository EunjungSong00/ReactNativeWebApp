import {gql, request} from 'graphql-request';
import requestGQL from '../../module/requestGQL';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

interface ICartCountApi {
    // userId?: string,
    navigation:StackNavigationProp
}

export default async function cartCountApi({navigation}: ICartCountApi) {
    const query = gql`
     query {
        cartCount(filter: {})
      }
    `;

    console.log('query', query)
    const response = await requestGQL(query, navigation,{autoErrorPopup:false});
    // console.log('cartCountApi', response);
    return response;
}
