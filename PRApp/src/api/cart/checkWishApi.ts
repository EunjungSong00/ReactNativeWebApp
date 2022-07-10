import {gql, request} from 'graphql-request';
import requestGQL from '../../module/requestGQL';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

interface ICheckWishApi {
    targetIds?: number,
    navigation: StackNavigationProp
}

export default async function checkWishApi({targetIds, navigation}: ICheckWishApi) {
    const query = gql`
        query {
            checkWish(filter: {
            targetIds: [${targetIds}],
            targetType: CAR
          }) 
        }
    `;

    console.log('query', query)
    const response = await requestGQL(query, navigation);
    console.log('checkWishApi', response);
    return response;
}
