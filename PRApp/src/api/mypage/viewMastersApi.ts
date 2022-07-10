import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export default async function viewMastersApi(navigation: StackNavigationProp, userId: number) {
  const query = `
  query {
    viewMasters(
      filter: {
        userId: ${userId}
        targetType: CAR
      }, 
      pagination: {
        page: 1,
        size: 5,
        sort: [
          {
            field: "id",
            direction: DESC
          }
        ]
      }) {
      edges {
        node {
          targetId
        }
      }
    }
  }
  
    `;

  console.log('viewMastersApi query', query);
  const response = await requestGQL(query, navigation);
  console.log('viewMastersApi', response);
  return response;
}
