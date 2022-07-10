import {gql, request} from 'graphql-request';
import requestGQL from '../../../module/requestGQL';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

export default async function changeDefaultShippingAddressApi(id: number, navigation: StackNavigationProp) {
    const mutation = gql`
        mutation{
          changeDefaultShippingAddress(
            id: ${id}
          ){
            address
            detailAddress
            id
            isDefault
            recipientName
            recipientPhoneNumber
            zipCode
          }
        }
    `;
    const response = await requestGQL(mutation, navigation);
    console.log('changeDefaultShippingAddress mutation ', mutation);
    return response;
}
