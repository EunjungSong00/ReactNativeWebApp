import {gql} from "graphql-request";
import requestGQL from "../../module/requestGQL";

interface IUpsertDriversLicenseApi {
    driversLicenseNumber: string;
    name: string;
    residentRegistrationNumber: string;
    fullAddress: string;
    issueDate: string;
    navigation: any;
}

export default async function upsertDriversLicenseApi({driversLicenseNumber, name, residentRegistrationNumber, fullAddress, issueDate, navigation}: IUpsertDriversLicenseApi) {
    const query = gql`
       mutation {
          upsertDriversLicense(
            input: {
              # 운전면허번호 앞자리 2글자는 지역명 또는 지역코드임.
              # '서울','부산','경기','강원','충북','충남','전북','전남','경북','경남','제주','대구','인천','광주','대전','울산','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','28'
              driversLicenseNumber: "${(driversLicenseNumber.replaceAll('-', ''))}"
              name: "${name}"
              residentRegistrationNumber: "${residentRegistrationNumber.replaceAll('-', '')}"
              fullAddress: "${fullAddress}"
              issueDate: "${issueDate.replaceAll('.', '')}"
            }
          ) {
            id
            driversLicenseNumber
            name
            residentRegistrationNumber
            fullAddress
            issueDate
          }
        }
    `;

    // console.log('querywww', query);
    return await requestGQL(query, navigation);
};
