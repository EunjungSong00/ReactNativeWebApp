import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export type QueryType = {
  password: string;
};

export default async function checkCarmerceUserApi({password}: QueryType, navigation: StackNavigationProp) {
  const query = `
    {
        checkCarmerceUser(password: "${password}") {
          id
          email
          name
          phoneNumber
          birthDate
          lastLoginAt
          createdAt
          updatedAt
          deletedAt
        }
      }
    `;

  const response = await requestGQL(query, navigation, {autoErrorPopup: false});
  // console.log('checkCarmerceUserApi', response);
  return response;
}
