import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export type QueryType = {
  ids: string;
};

export default async function getWishListApi({ids}: QueryType, navigation: StackNavigationProp) {
  const query = `
  query {
    getWishList(ids: [${ids}]) {
      price
      imageList {
        originFilename
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

  console.log('getWishListApi', query);
  const response = await requestGQL(query, navigation);
  console.log('getWishListApi', response);
  return response;
}
