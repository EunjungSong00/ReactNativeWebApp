import {gql} from "graphql-request";
import requestGQL from "../../module/requestGQL";

interface ISendCaremerceUserRefundAccountOtpApi {
    bankCode: string;
    accountNumber: string;
    navigation: any;
}

export default async function sendCaremerceUserRefundAccountOtpApi({bankCode, accountNumber, navigation}: ISendCaremerceUserRefundAccountOtpApi) {
    const query = gql`
        query {
            sendCaremerceUserRefundAccountOtp(
                input: {
                    bankCode: "${bankCode}"
                    accountNumber: "${accountNumber}"
                }
            ) {
                token
                bankCode
                accountNumber
            }
        }
    `;

    console.log('querywww', query);
    return await requestGQL(query, navigation);
};
