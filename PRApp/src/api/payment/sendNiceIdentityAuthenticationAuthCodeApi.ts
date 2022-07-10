import {gql} from "graphql-request";
import requestGQL from "../../module/requestGQL";

interface ISendNiceIdentityAuthenticationAuthCodeApi {
    name: string;
    residentRegistrationNumber: string;
    mobileCode: string;
    phoneNumber: string;
    navigation: any
}

export default async function sendNiceIdentityAuthenticationAuthCodeApi({name, residentRegistrationNumber, mobileCode, phoneNumber, navigation}: ISendNiceIdentityAuthenticationAuthCodeApi) {
    const query = gql`
        mutation {
            sendNiceIdentityAuthenticationAuthCode(
                input: {
                    residentRegistrationNumber7: "${residentRegistrationNumber}"
                    name: "${name}"
                    mobileCode: ${mobileCode}
                    phoneNumber: "${phoneNumber}"
                }
            ) {
                requestNumber
                responseNumber
            }
        }
    `;

    console.log('querywww', query);
    return await requestGQL(query, navigation);
};
