import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export type QueryType = {
  ids: string;
};

export default async function getVehicleListByIdsApi({ids}: QueryType, navigation: StackNavigationProp) {
  const query = `
  query {
    getVehicleListByIds(ids: [${ids}]) {
      id
      salePrice
      price
      imageList {
        name
      }
      modelYear
      manufacturer
      modelName
      modelTrim
      mileage
      fuel
    }
  }
    `;

  console.log('getVehicleListByIdsApi', query);
  const response = await requestGQL(query, navigation);
  console.log('getVehicleListByIdsApi', response);
  return response;
}
