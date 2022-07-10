import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";

interface ICalculateDeliveryPriceApi {
    orderId: string;
    endAddr: string;
    navigation: any;
}

// 배송 예상비용 조회
export default async function calculateDeliveryPriceApi({orderId, endAddr, navigation}: ICalculateDeliveryPriceApi) {
    const query = gql`
        query {
          calculateDeliveryPrice(
              request: {
                # 주문 번호
                orderId: ${orderId}
                # 출발지 주소
                startAddr: "서울 서초구 사임당로 171"
                # 도착지 주소
                endAddr: "${endAddr}"
              }
          ){
            # 응답코드
            code
            # 응답 메세지
            message
            data {
              # 거리 
              distance
              # 예상비용 
              price
              # 예상 추가비용
              additionalPrice
              # 시작위치 위도 
              startLat
              # 시작위치 경도
              startLon
              # 도착위치 위도
              endLat
              # 도착위치 경도
              endLon
              # 배송가격 아이디 
              deliveryPriceNo
            }
          }
        }
    `;

    console.log('query', query);
    return await requestGQL(query, navigation);
}
