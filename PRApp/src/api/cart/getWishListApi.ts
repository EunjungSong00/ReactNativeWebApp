import {gql, GraphQLClient} from "graphql-request";
import requestGQL from "../../module/requestGQL";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";

export default async function getWishListApi(ids : number[], navigation: StackNavigationProp) {
    const query = gql`
        query{
            getWishList(
                ids: [${ids}]
            ){
            id
            imageList {
              name
              type
            }
            modelYear
            makingDate
            manufacturer
            modelName
            modelDetail
            modelTrim
            mileage
            salePrice
            price
            fuel
            color
            transmission
            appearance
            number
            status          
          }
        }
    `;

    const response = await requestGQL(query, navigation);
    // console.log('getWishList mutation ', mutation);
    return response;
};
