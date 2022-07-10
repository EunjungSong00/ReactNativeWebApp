import {gql} from "graphql-request";
import requestGQL from "../../module/requestGQL";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";

interface IGetInsuranceApi {
    id: number,
    navigation: StackNavigationProp
}

export default async function getVehicleInsuranceHistoryApi({id, navigation}: IGetInsuranceApi) {
    const query = gql`
  query {
    getVehicleInsuranceHistory(
        id: ${id}
    ) {
        accidentList {
            accidentProcessType
            accidentType
            date
            insuranceMoney
            laborCost
            laborEstimateCost
            laborInformation
            laborInformationCount
            paintCost
            paintEstimateCost
            partCost
            partEstimateCost
            photo
            repairEstimateCost
            reserveMoney
            scrapCar
            unconfirmedInsuranceMoney
          }
          accidents
          baseDate
          bodyStyle
          color
          displacement
          firstRegisterDate
          firstRegisterInformationChangeType
          firstRegisterModelType
          firstRegisterNumber
          firstRegisterUseType
          floodedAccidentCount
          floodedAccidentDate
          fuel
          generalCommercialHistory
          generalTotalLossAccidentCount
          generalTotalLossAccidentDate
          id
          initialInsuranceSubscriptionDate
          inquiryDate
          manufacturerCountry
          manufacturerName
          mileageInformation
          mileageList {
            date
            mileage
            provider
          }
          modelDetail
          modelType
          modelYear
          name
          number
          officialHistory
          otherAccidentCount
          otherAccidentInsuranceMoney
          ownerChangeCount
          ownerChangeList {
            date
            modelType
            type
            useType
          }
          rentalCommercialHistory
          selfAccidentCount
          selfAccidentInsuranceMoney
          theftTotalLossAccidentCount
          theftTotalLossAccidentDate
          unsubscribedCount
          unsubscribedDate
          useType
          vehicleInformationChangeCount
          vehicleInformationChangeList {
            date
            modelType
            number
            type
            useType
          }
          }
    }
  `;

    console.log('getVehicleInsuranceHistory', query);

    const response = await requestGQL(query, navigation,{autoErrorPopup:false});
    return response;
};

