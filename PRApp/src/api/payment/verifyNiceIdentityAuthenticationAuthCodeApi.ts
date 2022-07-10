import {gql} from "graphql-request";
import requestGQL from "../../module/requestGQL";

interface IVerifyNiceIdentityAuthenticationAuthCodeApi {
    requestNumber: string;
    responseNumber: string;
    authCode: string;
    navigation: any;
}

export default async function verifyNiceIdentityAuthenticationAuthCodeApi({requestNumber, responseNumber, authCode, navigation}: IVerifyNiceIdentityAuthenticationAuthCodeApi) {
    const query = gql`
        mutation {
            verifyNiceIdentityAuthenticationAuthCode(
                input: {
                    requestNumber: "${requestNumber}"
                    responseNumber: "${responseNumber}"
                    authCode: "${authCode}"
                }
            ) {
                id
                name
                residentRegistrationNumber7
                phoneNumber
                createdAt
                updatedAt
            }
        }
    `;

    console.log('querywww', query);
    return await requestGQL(query, navigation);
};
