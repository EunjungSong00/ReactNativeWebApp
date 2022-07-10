import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export type QueryType = {
  currentPassword: string;
  newPassword: string;
};

export default async function changeCarmerceUserPasswordApi({currentPassword, newPassword}: QueryType, navigation: StackNavigationProp) {
  const query = `
  mutation {
    changeCarmerceUserPassword(
      input: { currentPassword: "${currentPassword}", newPassword: "${newPassword}" }
    ) {
      email
    }
  }
    `;

  const response = await requestGQL(query, navigation);
  console.log('changeCarmerceUserPasswordApi', response);
  return response;
}
