import {gql, request} from 'graphql-request';
import {StatusType} from "../../../screen/cart/CartScreen";
import requestGQL from "../../module/requestGQL";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";

export default async function updateCartMasterApi(id: number, status: StatusType, navigation: StackNavigationProp) {
    const mutation = gql`
    mutation{
        updateCartMaster(
        data: {
          id: ${id}
          status: ${status === 0 ? 'ACTIVE' : ( 1 ? 'DELETED' : 'INACTIVE')}
        }
      ){
        id
        status
        summaryId
        vehicleId
        userId
        createdAt
        updatedAt
      }
    }
    `;

    const response = await requestGQL(mutation, navigation);
    // console.log('updateCartMaster ', mutation);
    return response;
}
