import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";

interface IConfirmPurchaseApi {
    orderId: string; // 주문 아이디
    navigation: any;
}

// 구매확정
export default async function confirmPurchaseApi({orderId, navigation}: IConfirmPurchaseApi) {
    const query = gql`
        mutation {
            confirmPurchase(
                request: {
                    # 주문 아이디
                    orderId: ${orderId}
                }
            ){
                # 결과적용 수
                affectedCount
                # 요청한값 그대로 리턴
                request {
                    orderId
                }
            }
        }
    `;

     console.log('query', query);
    return await requestGQL(query, navigation);
}
