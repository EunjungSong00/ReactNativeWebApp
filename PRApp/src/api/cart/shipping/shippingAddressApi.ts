import {gql, GraphQLClient} from "graphql-request";
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../../module/requestGQL';

export default async function shippingAddressApi(id: number, navigation: StackNavigationProp) {
    const query = gql`
        query {
           shippingAddress (id: ${id}) {
            id
            address
            detailAddress
            zipCode
            recipientName
            recipientPhoneNumber
            isDefault
          }
        }
    `;
    const response = await requestGQL(query, navigation);
    // console.log('shippingAddressApi query ', query);
    return response;
};
