import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";

export enum PurchaseType {
    PURCHASE_TYPE_PERSONAL, //개인
    PURCHASE_TYPE_SOLE_PROPRIETOR, //개인사업자
    PURCHASE_TYPE_CORPORATE_BUSINESS, //법인사업자
    PURCHASE_TYPE_PERSONAL_CO_OWNER, //개인-공동명의
}

interface ICashPurchaseApi {
    orderId: string; // 주문 아이디. prepare 에서 리턴 받은값
    vAmount: string; // 가상계좌 입금 필요 금액
    purchaseType: PurchaseType | string; //구매 타입. 개인, 개인사업자. 법인사업자등
    refundAccount: {
        bankCode: string; //환불계좌 은행코드
        accountHolder: string; //환불계좌 예금주
        accountNumber: string; //환불계좌 번호
    };
    driverLicense: {
        driverLicenseNumber: string; //운전면허 번호
        driverName: string; //운전자 이름
        residentRegistrationNumber: string; //주민번호
        address: string; //주소
        issueDate: string; //발급일자
    }
    deliveryRequestDto: {
        deliveryPrice: string; //배송비
        deliveryDistance: string; //배송 거리
        deliveryAddressEnd: string; //배송 도착 주소
        deliveryDesiredTime: string; //배송희망 시간
        recipientName: string; //수령인 이름
        recipientPhoneNumber: string; //수령인 전화번호
        zipCode: string; //우편번호
        detailAddress: string; //상세주소
        deliveryPriceNo: string; //배송비 조회에서 응답받은 배송가격 아이디
    }
    navigation: any;
}

// 현금 결제요청(가상계좌 발급)
export default async function cashPurchaseApi(props: ICashPurchaseApi) {
    const query = gql`
        mutation {
            cashPurchase(
                request: {
                    orderId: ${props.orderId}
                    vaccountAmt: ${props.vAmount}
                    purchaseType: ${props.purchaseType}
                    refundAccount: {
                        bankCode: "${props.refundAccount.bankCode}"
                        accountHolder: "${props.refundAccount.accountHolder}"
                        accountNumber: "${props.refundAccount.accountNumber}"
                    }
                    driverLicense: {
                        driverLicenseNumber: "${props.driverLicense.driverLicenseNumber}"
                        driverName: "${props.driverLicense.driverName}"
                        residentRegistrationNumber: "${props.driverLicense.residentRegistrationNumber}"
                        address: "${props.driverLicense.address}"
                        issueDate: "${props.driverLicense.issueDate}"
                    }
                    # 배송관련 정보 
                    deliveryRequestDto: {
                        deliveryPrice: ${props.deliveryRequestDto.deliveryPrice}
                        deliveryAddressEnd: "${props.deliveryRequestDto.deliveryAddressEnd}"
                        deliveryDesiredTime: "${props.deliveryRequestDto.deliveryDesiredTime}"
                        recipientName: "${props.deliveryRequestDto.recipientName}"
                        recipientPhoneNumber: "${props.deliveryRequestDto.recipientPhoneNumber}"
                        zipCode: "${props.deliveryRequestDto.zipCode}"
                        detailAddress: "${props.deliveryRequestDto.detailAddress}"
                        deliveryPriceNo: "${props.deliveryRequestDto.deliveryPriceNo}"
                    }
                }
            ){
                # 가상계좌 은행이름
                vaccountBankName
                # 가상계좌 은행코드
                vaccountBankCode
                # 가상계좌 번호 
                vaccountNumber
                # 가상계좌 예금주
                vaccountName
                # 가상계좌 만료시간
                vaccountExpTime
                # 가상계좌 금액
                vaccountAmt
            }
        }
    `;

     console.log('query', query);
    return await requestGQL(query, props.navigation);
}
