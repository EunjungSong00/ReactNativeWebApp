import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL, {RequestGQLOption} from '../../module/requestGQL';

export default async function qnaMastersApi(navigation: StackNavigationProp) {
  const query = `
  query {
    qnaMasters(filter: {status:ACTIVE},
       pagination: {
         page:1,
         size:100,
         sort:[
           {
             field:"id",
             direction:DESC
           }
         ]
       }
       ) {
      edges {
        node {
          comments {
            comment
          }
          contents
          title
        }
      }
      totalCount
    }
  }
    `;

  const response = await requestGQL(query, navigation);
  // console.log('qnaMastersApi', response);
  return response;
}
