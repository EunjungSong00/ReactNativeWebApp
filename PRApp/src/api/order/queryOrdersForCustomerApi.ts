import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";

interface IQueryOrdersForCustomerApi {
    userId: string;
    page: number;
    navigation: any;
}

// 주문 리스트 조회
export default async function queryOrdersForCustomerApi({userId, page, navigation}: IQueryOrdersForCustomerApi) {
    const query = gql`
        query {
          # 주문 리스트 조회
          queryOrdersForCustomer(
            request:{
              userId: ${userId}
              page: ${page}
              pageSize: 10
              # 정렬 기준
                sorts: [
                  {
                    # 정렬할 필드 이름
                    fieldName: "orderStateSortPriorityCustomer"
                    # 오름차순, 내림차순, ASC, DESC
                    sortType: ASC
                  }
                  {
                    fieldName: "orderTime"
                    sortType: DESC
                  }
                ]
            }
          ){
            pageTotal
            # 주문 리스트
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
              # 차량번호
              vehicleNumber
              # 판매수수료
              vehicleSaleCommission
              # 이용수수료
              vehicleServiceCommission
              # 취득세
              vehicleAcquisitionTax
              # 단기 운전자보험
              vehicleDriverInsurance
              # 이전 신청 대행비
              vehicleAgencyPrice
              # 인지세
              vehicleNationStampTax
              # 증지세
              vehicleLocalStampTax
              # 셀카 차량 매입가격
              vehicleSellCarVehiclePurchasePrice
              # 평가사 비용
              vehicleAssessorCosts
              # 차량관리비
              vehicleManagementCost
              # 채권매입가액
              vehicleBondPurchasePrice
              # 채권매도가액
              vehicleBondSellingPrice
              # 채권연계수수료
              vehicleBondLinkedCommission
              # 시가표준액
              vehicleStandardPrice
              # 취득세 및 채권 계산의 기준가액
              vehicleBasePrice
              # 차량상세정보 JSON
              vehicleDetailJson
              # ===== 가상계좌 관련 =====
              # 가상계좌 번호
              vaccountNumber
              # 가상계좌 은행 코드
              vaccountBankCode
              # 가상계좌 은행 이름
              vaccountBankName
              # 가상계좌 인증 시간
              vaccountAuthDate
              # 가상계좌 입금 금액
              vaccountAmt
              # 가상계좌 나이스페이 TID
              vaccountNicepayTid
              # 가상계좌 입금 알림 시간
              vaccountNotiTime
              # 가상계좌 만료시간 
              vaccountExpTime
              # 가상계좌 예금주
              vaccountName
              # ==== 배송 관련 ====
              # 배송비 
              deliveryPrice
              # 배송 거리
              deliveryDistance
              # 배송 도착주소
              deliveryAddressEnd
              # 배송 도착주소 상세 
              deliveryDetailAddress
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
              # 수령인 
              recipientName
              # 수령인 폰번호
              recipientPhoneNumber
              # 탁송번호(아이디)
              deliveryNo
              # 탁송가격번호(아이디)
              deliveryPriceNo
              # 배송도착 우편번호
              recipientZipCode
              # ==== 환불정보
              # 환불 ID
              refundOrderId
              # 환불 접수 시간
              refundOrderTime
              # 환불사유 1
              refundReasonFirst
              # 환불사유 2
              refundReasonSecond
              # 환불 사유 상세
              refundReasonDetail
              # 환불 1차검토 완료시간
              reviewRefund1CompletedAt
              # 환불 2차검토 완료시간
              reviewRefund2CompletedAt
              # 환불 검토완료 여부
              isReviewRefundSuccess
              # 환불 거절 메세지
              refuseRefundableMessage
              # 환불 거절 시간
              refuseRefundableAt
              # 차량 반납주소
              vehicleReturnAddress
              # 차량 반납주소 상세
              vehicleReturnAddressDetail
              # 차량 반납주소 우편번호
              vehicleReturnZip
              # 차량 인계자(환불) 이름
              returnTransferName
              # 차량 인계자(환불) 폰번호
              returnTransferPhoneNumber
              # 환불계좌 예금주
              refundAccountHolder
              # 환불계좌 번호
              refundAccountNumber
              # 환불계좌 은행코드
              refundBankCode
              # 환불계좌 이미지 경로 목록. 목록조회시에는 NULL
              refundImagePathList
            }
            request {
                pageSize
            }
          }
        }
    `;

    // console.log('orderListApi', query);
    return await requestGQL(query, navigation);
}
