import {gql, request} from 'graphql-request';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';
import {ActionType} from "../../../screen/cart/CartScreen";

export default async function deleteCartMasterApi(vehicleIds: number[], actionType: string, navigation: StackNavigationProp) {

    const mutation = gql`
    mutation{
        deleteCartMaster(
        data: {
          actionType: ${actionType}
          # actionType: ${vehicleIds.length < 2 ? `DELETE_ALL` : `DELETE_ONE`}
          vehicleIds: ${vehicleIds.length < 2 ? `${vehicleIds}` : `[${vehicleIds}]`} 
        }
      )
    }
    `;

    const response = await requestGQL(mutation, navigation);
    // console.log('deleteCartMasterApi ', mutation);
    return response;
}

