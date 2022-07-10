import {gql} from "graphql-request";
import requestGQL from "../../module/requestGQL";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";

interface IGetVehicleApi {
    id: number,
    navigation: StackNavigationProp
}

export default async function getVehicleApi({id, navigation}: IGetVehicleApi) {
    const query = gql`
        query {
            getVehicle(
                id: ${id}
            ) {
                  corporationId
                  corporationName
                  color
                  appearance
                  complexName
                  engineDisplacement
                  enrollNumber
                  fuel
                  fuelEconomy
                  id
                  location
                  makingDate
                  manufacturer
                  mileage
                  modelDetail
                  modelName
                  modelTrim
                  modelYear
                  number
                  partnerName
                  partnerNumber
                  price
                  salePrice
                  seat
                  status
                  transmission
                  wheelDrive
                  basicOption {
                    exterior {
                      priority
                      optionName
                      isExist
                    }
                    utilityMultimedia {
                      priority
                      optionName
                      isExist
                    }
                    interior {
                      optionName
                      isExist
                      priority
                    }
                    safety {
                      optionName
                      isExist
                      priority
                    }
                  }
                  addOptionList {
                    isExist
                    optionId
                    optionName
                    priority
                  }
                  highlightOptionList {
                    isExist
                    optionCode
                    optionDescription
                    optionExcluded
                    optionId
                    optionIncluded
                    optionName
                    optionPrice
                    optionRequired
                    optionType
                  }
                  incidentalExpense {
                    acquisitionTex
                    agencyPrice
                    assessorCosts
                    basePrice
                    bondLinkedCommission
                    bondPurchasePrice
                    bondSellingPrice
                    driverInsurance
                    localStampTax
                    nationStampTax
                    saleCommission
                    sellCarVehiclePurchasePrice
                    serviceCommission
                    standardPrice
                    vehicleManagementCost
                  }
                  imageList {
                    name
                    originFilename
                    type
                  }
              }
        }

    `;

    //console.log('getVehicleApi', query);

    const response = await requestGQL(query, navigation);
    return response;
};
