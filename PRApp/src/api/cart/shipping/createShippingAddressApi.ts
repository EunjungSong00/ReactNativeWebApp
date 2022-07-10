import {gql, request} from 'graphql-request';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../../module/requestGQL';

export default async function createShippingAddressApi({
   address,
   detailAddress,
   zipCode,
   recipientName,
   recipientPhoneNumber,
   isDefault
}:{
    address: string;
    detailAddress: string;
    zipCode: string;
    recipientName: string;
    recipientPhoneNumber: string;
    isDefault: boolean;
}, navigation: StackNavigationProp) {
    const mutation = gql`
       mutation{
          createShippingAddress(
           input:{
            address: "${address}"
            detailAddress: "${detailAddress}"
            ${isDefault ?  `isDefault: true` : `isDefault: false`}
            zipCode: "${zipCode}"
            recipientName: "${recipientName}"
            recipientPhoneNumber: "${recipientPhoneNumber}"
          }
          ){
            id
            address
            detailAddress
            isDefault
            recipientName
            recipientPhoneNumber
            zipCode
          }
        }
    `;


    const response = await requestGQL(mutation, navigation);
    // console.log('createShippingAddressApi', mutation);
    return response;
}
