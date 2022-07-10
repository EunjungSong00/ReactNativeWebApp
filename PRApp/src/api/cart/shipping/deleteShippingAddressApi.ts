import {gql, request} from 'graphql-request';
import requestGQL from "../../../module/requestGQL";
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

export default async function deleteShippingAddressApi(id: number, navigation: StackNavigationProp) {
    const mutation = gql`
        mutation{
            deleteShippingAddress(id: ${id}){id}
        }
    `;
    const response = await requestGQL(mutation, navigation);
    console.log('actionWishApi mutation ', mutation);
    return response;
}
