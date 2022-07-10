import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";

interface IQueryOrdersForCustomerApi {
    userId: string;
    navigation: any;
}

// 주문 전체 count
export default async function OrderStateCountApi({userId, navigation}: IQueryOrdersForCustomerApi) {
    const query = gql`
        query {
          # 주문 리스트 조회
          queryOrdersForCustomer(
            request:{
              userId: ${userId}
              page: 0
              pageSize: 100
            }
          ){
            # 주문 리스트
            orders {
              # 주문 아이디
              orderId
            }
          }
        }
    `;

    // console.log('orderListApi', query);
    return await requestGQL(query, navigation);
}
