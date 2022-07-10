import {gql, GraphQLClient} from "graphql-request";
import requestGQL from "../../module/requestGQL";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";

export type QueryType = {
    page: number;
}

export default async function cartMastersApi({page} : QueryType, navigation: StackNavigationProp) {
    const query = gql`
        query{
          cartMasters(
               filter:{  
                    status: ACTIVE
               }
                pagination:{
                      page: ${page}
                      size: 100
                }
          ){
              totalCount
              edges {
                cursor
                node {
                  vehicleId
                  status
                }
              }
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
                totalCount
              }
          }
        }
    `;

    console.log('cartMasters query', query);

    const response = await requestGQL(query, navigation);
    // console.log('cartMasters Api', query);
    return response;
};
