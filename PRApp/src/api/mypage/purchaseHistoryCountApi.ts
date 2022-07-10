import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";

interface IPurchaseHistoryCountApi {
    userId: string;
    navigation: any;
}

// 구매이력 count
export default async function purchaseHistoryCountApi({userId, navigation}: IPurchaseHistoryCountApi) {
    const query = gql`
        query {
          purchaseHistory(
              request: {
                # 유저아이디
                userId: ${userId}
                page: 0
                pageSize: 100
              }
          ){
            orders {
              # 차량상세정보 JSON
              vehicleDetailJson
            }
          }
        }
    `;

    // console.log('orderListApi', query);
    return await requestGQL(query, navigation);
}
