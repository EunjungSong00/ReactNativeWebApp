import {gql, request} from 'graphql-request';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../../module/requestGQL';

type QueryType = {
    id: number;
    address: string;
    detailAddress: string;
    zipCode: string;
    recipientName: string;
    recipientPhoneNumber: string;
    isDefault: boolean;
}
export default async function updateShippingAddressApi(
    {
        id,
        address,
        detailAddress,
        zipCode,
        recipientName,
        recipientPhoneNumber,
        isDefault,
    } : QueryType,
    navigation: StackNavigationProp
) {
    // const endpoint = Config.NEXT_PUBLIC_API_URL;
    const mutation = gql`
        mutation{
          updateShippingAddress(
            input:{
                id: ${id}
                address: "${address}"
                detailAddress: "${detailAddress}"
                zipCode: "${zipCode}"
                recipientName: "${recipientName}"
                recipientPhoneNumber: "${recipientPhoneNumber}"
                isDefault: ${isDefault}
            }
          ){
            id
          }
        }
    `;
    const response = await requestGQL(mutation, navigation);
    // console.log('updateShippingAddressApi', mutation);
    return response;
}
