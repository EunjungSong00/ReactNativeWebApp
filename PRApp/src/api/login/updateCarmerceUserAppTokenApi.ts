import {gql, request} from 'graphql-request';
import graphQLClientRequest from "../graphQLClientRequest";
import { graphql } from 'graphql';
import requestGQL from '../../module/requestGQL';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

export default async function updateCarmerceUserAppTokenApi(accessToken: string, appToken: string, navigation: StackNavigationProp) {

    const query = gql`
    mutation {
        updateCarmerceUserAppToken(
          input: {
            accessToken: "${accessToken}"
            appToken: "${appToken}"
          }
        ) {
          id
          email
          name
          phoneNumber
          birthDate
          appToken
          lastLoginAt
          createdAt
          updatedAt
        }
      }
    `;

    const response = await requestGQL(query, navigation);
    // console.log('updateCarmerceUserAppTokenApi', query);
    return response;
}
