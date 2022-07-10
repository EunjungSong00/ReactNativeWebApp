import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

interface ICheckReviewApi {
  vehicleIds: number[];
  navigation: StackNavigationProp;
}

export default async function checkReviewApi({vehicleIds, navigation}: ICheckReviewApi) {
  const query = `
  query {
        checkReview(
          filter: {
            vehicleIds: [${vehicleIds}]
          }
        )
      }
    `;

  console.log(query, query)
  return await requestGQL(query, navigation);
}
