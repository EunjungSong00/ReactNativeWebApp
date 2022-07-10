import {gql, request} from 'graphql-request';
import requestGQL from "../../../module/requestGQL";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";

export default async function saveShippingAddressApi(address: string, detailAddress: string, zipCode: string, recipientName: string, recipientPhoneNumber: string, navigation: StackNavigationProp) {
    const mutation = gql`
        mutation{
          saveShippingAddress(
            input:{
              address: "${address}"
              detailAddress: "${detailAddress}"
              zipCode: "${zipCode}"
              recipientName: "${recipientName}"
              recipientPhoneNumber: "${recipientPhoneNumber}"
            }
          ){
            id
          }
        }
    `;
    const response = await requestGQL(mutation, navigation);
    // console.log('saveShippingAddressApi', mutation);
    return response;
}
