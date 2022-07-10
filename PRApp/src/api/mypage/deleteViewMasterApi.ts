import {gql, request} from 'graphql-request';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export default async function deleteViewApi(userId: number, navigation: StackNavigationProp) {

    const mutation = gql`
    mutation{
      deleteView(
        data: {
          actionType: DELETE_ALL
          userId: ${userId}
        }
      )
    }
    `;

    const response = await requestGQL(mutation, navigation);
    // console.log('deleteViewApi mutation ', mutation);
    return response;
}

