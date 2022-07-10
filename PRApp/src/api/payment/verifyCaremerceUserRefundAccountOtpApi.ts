import {gql} from "graphql-request";
import requestGQL from "../../module/requestGQL";

interface IVerifyCaremerceUserRefundAccountOtpApi {
    otpNumber: string;
    token: string;
    bankCode: string;
    accountNumber: string;
    navigation: any;
}

export default async function verifyCaremerceUserRefundAccountOtpApi({otpNumber, token, bankCode, accountNumber, navigation}: IVerifyCaremerceUserRefundAccountOtpApi) {
    const query = gql`
        mutation {
            verifyCaremerceUserRefundAccountOtp(
                input: {
                    otpNumber: "${otpNumber}"
                    token: "${token}"
                    bankCode: "${bankCode}"
                    accountNumber: "${accountNumber}"
                }
            ) {
                id
                bankCode
                name
                accountNumber
                createdAt
                updatedAt
            }
        }
    `;

    console.log('querywww', query);
    return await requestGQL(query, navigation);
};
