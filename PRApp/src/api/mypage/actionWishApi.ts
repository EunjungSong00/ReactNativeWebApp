import {gql, request} from 'graphql-request';
import graphQLClientRequest from "../graphQLClientRequest";
import requestGQL from '../../module/requestGQL';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';


export default async function actionWishApi(targetId: number, targetType: 'CAR'|'COMPANY'|'DEALER', navigation:StackNavigationProp) {
    const query = gql`
     mutation {
        actionWish(
          data: {
            targetId: ${targetId}
            targetType: ${targetType}
          }
        ){
          id
          status
          targetId
          targetType
          userId
        }
      }
    `;

    const response = await requestGQL(query, navigation);
    // console.log('actionWishApi', response);
    return response;
}
