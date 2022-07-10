import {gql, request} from 'graphql-request';
import requestGQL from "../../module/requestGQL";
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

export default async function prepareCashOrderApi(userId: number, vehicleId: number, navigation: StackNavigationProp) {
    const mutation = gql`
        mutation{
            # 현금결제 시작시 주문 준비 요청
            prepareCashOrder(
                request: {
                    userId: ${userId} # 유저아이디. 관리자가 아닌경우 자신의 아이디만 사용가능.
                    vehicleId: ${vehicleId} # 차량아이디
                }
            ){
                # 주문 아이디
                orderId
                # 주문 상태
                orderState
                ## 전달받은 파라미터
                request {
                  userId
                  vehicleId
                }
            }
        }
        `;
    const response = await requestGQL(mutation, navigation);
     console.log('prepareCashOrder mutation ', mutation);
    return response;
}
