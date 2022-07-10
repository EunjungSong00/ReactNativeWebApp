import {gql, GraphQLClient} from "graphql-request";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";
import requestGQL from "../../module/requestGQL";

export type QueryType = {
    page: number;
    size?: number;
}

export default async function wishMastersApi({page, size} : QueryType, navigation: StackNavigationProp) {
    const query = gql`
        query{
          wishMasters(
               filter:{  
                        status: ACTIVE
                        targetType: CAR
               }
                pagination:{
                      page: ${page}
                      ${size ? `size: ${size}` : `size: 100`}
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
            }
          }
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            totalCount
          }
      }
    }
    `;

    const response = await requestGQL(query, navigation);
    // console.log('wishMastersApi query ', query);
    return response;
};
