import {gql} from "graphql-request";
import requestGQL from "../../module/requestGQL";

export enum EPurpose {
    TAX_PREFERENTIAL,
    CAR_INSURANCE_DISCOUNT,
    DIVISION_OF_PROPERTY,
    ETC,
}

interface IUpsertJointOwnershipApi {
    name: string;
    phoneNumber: string;
    residentRegistrationNumber: string;
    shareRatioOwner: string;
    shareRatioJointOwner: string;
    purpose: EPurpose | string;
    purposeEtc?: string;
    navigation: any;
}

export default async function upsertJointOwnershipApi(props: IUpsertJointOwnershipApi) {
    const query = gql`
       mutation {
          upsertJointOwnership(
            input: {
              name: "${props.name}"
              phoneNumber: "${props.phoneNumber}"
              residentRegistrationNumber: "${(props.residentRegistrationNumber).replaceAll('-','')}"
              shareRatioOwner: ${props.shareRatioOwner}
              shareRatioJointOwner: ${props.shareRatioJointOwner}
              purpose: ${props.purpose}
              ${props.purpose === EPurpose[3]? `purposeEtc: "${props.purposeEtc}"`: ''}
            }
          ) {
            id
            name
            phoneNumber
            residentRegistrationNumber
            shareRatioOwner
            shareRatioJointOwner
            purpose
            purposeEtc
          }
        }
    `;

     console.log('querywww', query);
    return await requestGQL(query, props.navigation);
};
