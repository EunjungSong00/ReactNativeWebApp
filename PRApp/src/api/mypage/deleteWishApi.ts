import {gql, request} from 'graphql-request';
import graphQLClientRequest from "../graphQLClientRequest";
import { graphql } from 'graphql';
import requestGQL from '../../module/requestGQL';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

export default async function deleteWishApi(targetIds: number[], navigation: StackNavigationProp) {

    const query = gql`
     mutation {
        deleteWish(
            data: {
                targetIds: ${targetIds.length < 2 ? `${targetIds}` : `[${targetIds}]`}
                #actionType: ${targetIds.length < 2 ? `DELETE_ONE` : `DELETE_ALL`}
                actionType: DELETE_ONE
            }
        )
        }
    `;

    const response = await requestGQL(query, navigation);
    // console.log('deleteWishApi', query);
    return response;
}
