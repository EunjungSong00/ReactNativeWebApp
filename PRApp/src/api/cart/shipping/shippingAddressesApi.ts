import {gql, GraphQLClient} from "graphql-request";
import requestGQL from "../../../module/requestGQL";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";

export default async function shippingAddressesApi(navigation: StackNavigationProp) {
    const query = gql`
        query {
           shippingAddresses {
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
    // console.log('shippingAddressesApi', query);
    return response;
};
