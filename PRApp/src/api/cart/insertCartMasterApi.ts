import {gql, request} from 'graphql-request';
import requestGQL from "../../module/requestGQL";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";

export default async function insertCartMasterApi(vehicleId: number, navigation: StackNavigationProp) {
    const mutation = gql`
    mutation {
          insertCartMaster(
            data: {
              vehicleId: ${vehicleId}
              
            }
          ){
            createdAt
            id
            status
            summaryId
            updatedAt
            userId
            vehicleId
        }
    }
    `;
    // console.log('mutation', mutation);
    // console.log('endpoint', endpoint);

    const response = await requestGQL(mutation, navigation);
    // console.log('insertCartMaster ', mutation);
    return response;
}
