import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export type QueryType = {
    // status?: StatusType | undefined;
    page: number;
}

export default async function viewMastersApi1({page} : QueryType, navigation: StackNavigationProp) {
  const query = `
  query {
    viewMasters(
      filter: {  
       targetType: CAR
       status: ACTIVE
      }, 
      pagination:{
        page: ${page}
        size: 100
      }
    ){
        edges {
            cursor
            node {
                id
                status
                targetId
                userId
                targetType
                updatedAt
            }
        }
        totalCount
    }
}
  
`;

  const response = await requestGQL(query, navigation);
    // console.log('viewMastersApi1query', query);
  return response;
}
