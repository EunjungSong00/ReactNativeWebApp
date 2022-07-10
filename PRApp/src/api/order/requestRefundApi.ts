import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";

interface IRequestRefundApi {
    orderId: string;
    refundReasonFirst: string;
    refundReasonSecond: string;
    refundReasonDetail: string;
    refundImagePathList: string;
    vehicleReturnAddress: string;
    vehicleReturnAddressDetail: string;
    vehicleReturnZip: string;
    returnTransferName: string;
    returnTransferPhoneNumber: string;
    navigation: any;
}

// 환불접수
export default async function requestRefundApi(props: IRequestRefundApi) {
    const query = gql`
        mutation {
            requestRefund(
                request: {
                    # 주문 아이디
                    orderId: ${props.orderId}
                    # 환불사유 1. 첫번째 선택에서 고른 사유
                    refundReasonFirst: "${props.refundReasonFirst}"
                    # 환불사유 2. 두번째 선택에서 고른 사유
                    refundReasonSecond: "${props.refundReasonSecond}"
                    # 환불상세 사유
                    refundReasonDetail: "${props.refundReasonDetail}"
                    # 첨부이미지 경로 리스트
                    refundImagePathList: ${props.refundImagePathList}
                    # 반납 주소
                    vehicleReturnAddress: "${props.vehicleReturnAddress}"
                    # 반납 주소 상세 
                    vehicleReturnAddressDetail: "${props.vehicleReturnAddressDetail}"
                    # 반납 주소 우편번호
                    vehicleReturnZip: "${props.vehicleReturnZip}"
                    # 인계자 성명
                    returnTransferName: "${props.returnTransferName}"
                    # 인계자 폰번호
                    returnTransferPhoneNumber: "${props.returnTransferPhoneNumber}"
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

    // console.log('requestRefundApi', query);
    return await requestGQL(query, props.navigation);
}
