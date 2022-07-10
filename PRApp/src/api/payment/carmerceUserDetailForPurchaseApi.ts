import {gql} from "graphql-request";
import requestGQL from "../../module/requestGQL";

export default async function carmerceUserDetailForPurchaseApi(navigation: any) {
    const query = gql`
       query {
          carmerceUserDetailForPurchase {
            carmerceUser {
              id
              email
              name
              phoneNumber
              birthDate
              lastLoginAt
              createdAt
              updatedAt
            }
            driversLicense {
              id
              driversLicenseNumber
              name
              residentRegistrationNumber
              fullAddress
              issueDate
              createdAt
              updatedAt
            }
            niceIdentityAuthenticationSocket {
              id
              name
              residentRegistrationNumber7
              phoneNumber
              createdAt
              updatedAt
            }
            jointOwnership {
              id
              name
              phoneNumber
              residentRegistrationNumber
              shareRatioOwner
              shareRatioJointOwner
              purpose
              purposeEtc
              createdAt
              updatedAt
            }
            refundAccount {
              id
              bankCode
              name
              accountNumber
              createdAt
              updatedAt
            }
          }
        }
    `;

    // console.log('querywww', query);
    return await requestGQL(query, navigation);
};
