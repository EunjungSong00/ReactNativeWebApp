import {gql} from 'graphql-request';
import requestGQL from "../../module/requestGQL";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";

export enum OrderByType {
    ORDER_BY_LOAN_INTEREST_RATE,
    ORDER_BY_LOAN_LIMIT
}

interface ILoanLimitInquiryApi {
    driverLicense?: {
        address: string; //주소
        driverLicenseNumber: string; //운전면허번호
        driverName: string; //이름
        issueDate: string; //발급일자
        residentRegistrationNumber: string; //주민등록번호
    }
    loanInfo?: {//대출정보
        loanAdditionalInfo: { //대출추가정보
            annualIncome: string; //연소득
            housingType: string; //주거형태
            isOwnACar: string; //차량소유여부
            typeHomeOwnership: string; //주택소유형태
        }
        loanAmount: number; //대출금액
        loanTerm: string; //대출기간
        vehicleId: string; //차량 아이디
        vehicleNumber: string; //차량 번호
        vehicleSalePrice: number; //차량 실매매 가격
    }
    loanPersonalInfo?: { //개인정보
        isLocalYn: string; //내국인여부 Y/N
        isOwnDriverLicenseYn: string; //운전면허소지여부 Y/N
        isPersonalYn: string; //개인여부 Y/N
        isQueryAgreeYn: string; //조회동의 Y/N
        name: string; //이름
        phoneNumber: string; //휴대폰번호
    }
    filter: OrderByType | string;
    navigation: StackNavigationProp;
}

export default async function loanLimitInquiryApi({filter, navigation}: ILoanLimitInquiryApi) {
    const query = gql`
    query {
        loanLimitInquiry(
            loanLimitInquiryRequest: {
                driverLicense: {
                  address: ""
                  driverLicenseNumber: ""
                  driverName: ""
                  issueDate: ""
                  residentRegistrationNumber: "1"
                }
                loanInfo: {
                  loanAdditionalInfo: {
                    annualIncome: ""
                    housingType: ""
                    isOwnACar: true
                    typeHomeOwnership: ""
                  }
                  loanTerm: ""
                  vehicleId: ""
                  loanAmount: 0
                  vehicleNumber: ""
                  vehicleSalePrice: 3000
                }
                loanPersonalInfo: {
                  isQueryAgreeYn: "Y"
                  isLocalYn: "Y"
                  isOwnDriverLicenseYn: ""
                  isPersonalYn: ""
                  name: ""
                  phoneNumber: ""
                }
                orderByType: ${filter},
                # filterByBankCode: "004" 은행코드 필터
            }
        ){
            lowestInterestRateProduct {
              bankCode
              bankName
              loanProductId
              loanProductName
              loanInterestRate
              loanLimit
              loanDetailPage {
                title
                text
              }
            }
            maximumInterestRateProduct {
              bankCode
              bankName
              loanProductId
              loanProductName
              loanInterestRate
              loanLimit
              loanDetailPage {
                title
                text
              }
            }
            loanProducts{
              bankCode
              bankName
              loanProductId
              loanProductName
              loanInterestRate
              loanLimit
              loanDetailPage {
                title
                text
              }
            }
        }
    }
  `;

     // console.log('query', query);
    return await requestGQL(query, navigation);
}
