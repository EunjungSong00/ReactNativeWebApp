import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";

interface IOrderRequestDtoApi {
    userId: string;
    page: number;
    navigation: any;
}

// 주문 조회
export default async function purchaseHistoryApi({userId, page, navigation}: IOrderRequestDtoApi) {
    const query = gql`
        query {
          purchaseHistory(
              request: {
                # 유저아이디
                userId: ${userId}
                page: ${page}
                pageSize: 10
              }
          ){
            pageTotal
            orders {
              # 주문 아이디
              orderId
              # 상품(차량) 아이디
              vehicleId
              # 유저아이디
              userId
              # 주문상태 번호
              orderState
              # 주문상태명 한글 
              orderStateKo
              # 구매타입 
              purchaseType
              # 주문 생성시간
              orderTime
              # ===== 상품관련 =====
              vehicleNumber
              vehicleSaleCommission
              vehicleServiceCommission
              vehicleAcquisitionTax
              vehicleDriverInsurance
              vehicleAgencyPrice
              vehicleNationStampTax
              vehicleLocalStampTax
              vehicleSellCarVehiclePurchasePrice
              vehicleAssessorCosts
              vehicleManagementCost
              vehicleBondPurchasePrice
              vehicleBondSellingPrice
              vehicleBondLinkedCommission
              vehicleStandardPrice
              vehicleBasePrice
              # 차량상세정보 JSON
              vehicleDetailJson
              # ===== 가상계좌 관련 =====
              vaccountNumber
              vaccountBankCode
              vaccountBankName
              vaccountAuthDate
              vaccountAmt
              vaccountNicepayTid
              vaccountNotiTime
              vaccountExpTime
              vaccountName
              # ==== 배송 관련 ====
              # 배송비 
              deliveryPrice
              # 배송 거리
              deliveryDistance
              # 배송 도착주소
              deliveryAddressEnd
              # 배송기사 이름
              deliveryDriverName
              # 배송 희망시간 
              deliveryDesiredTime
              # 배송 시작 주소
              deliveryAddressStart
              # 배송 송장번호 
              deliveryInvoiceNumber
              # 배송 기사 폰번호 
              deliveryDriverPhoneNumber
            }
          }
        }
    `;

    // console.log('orderListApi', query);
    return await requestGQL(query, navigation);
}
