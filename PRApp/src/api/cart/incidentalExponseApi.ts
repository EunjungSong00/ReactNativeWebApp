import {gql, request} from 'graphql-request';
import Config from 'react-native-config';
import graphQLClientRequest from "../graphQLClientRequest";
import requestGQL from '../../module/requestGQL';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

export default async function incidentalExpenseApi(id: number, navigation: StackNavigationProp) {
    const query = gql`
        query{
          incidentalExpense( id: ${id}) {
            saleCommission    ## 판매수수료
            serviceCommission ## 이용수수료
            
             # 이전등록비
            acquisitionTex          # 취득세
            bondPurchasePrice       # 채권매입가액
            bondSellingPrice        # 채권매도가액
            bondLinkedCommission    # 채권연계수수료
            agencyPrice             # 등록신청대행비
            nationStampTax          # 인지세
            localStampTax           # 증지세
            
            standardPrice           # 시가표준액
            basePrice   # 취득세 및 채권 계산의 기준가액
            
            vehicleManagementCost         ## 차량 관리비
            driverInsurance               ## 임시보험비
            sellCarVehiclePurchasePrice   ## 셀카 차량 매입가격
            assessorCosts                 ## 평가사 비용
          }
        }
    `;

    const response = await requestGQL(query, navigation);
    console.log('incidentalExpenseApi query ', query);
    return response;
}
