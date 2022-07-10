import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";

interface ICancelOrderApi {
    orderId: string; // 주문 아이디. 관리자가 아닌 경우 자신의 주문만 취소 가능
    navigation: any;
}

// 주문취소
export default async function cancelOrderApi({orderId, navigation}: ICancelOrderApi) {
    const query = gql`
        mutation {
            cancelOrder(
                request:{
                    orderId: ${orderId}
                }
            ){
                # 적용된 컬럼수
                affectedCount
                # 요청받은 파라미터
                request {
                    orderId
                }
            }
        }
    `;

    console.log('cancelOrderApiQuery', query);
    return await requestGQL(query, navigation);
}
