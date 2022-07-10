import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export type InsertQnaMasterQueryType = {
  targetType: 'COMPANY' | 'CAR';
  targetId: number;
  paymentId: number;
  contents: string;
  carName: string;
  score: number;
  consignScore: number;
  attachments: any;
  // attachments: {
  //   attachType: 'IMAGE' | 'FILE';
  //   attach: string;
  //   seq: number;
  // }[];
};

export default async function insertReviewMaster(
  {targetType, targetId, paymentId, contents, carName, score, consignScore, attachments}: InsertQnaMasterQueryType,
  navigation: StackNavigationProp
) {
  const query = `
  mutation  {
    insertReviewMaster(data: {
        targetType: ${targetType},
        targetId: ${targetId},
        paymentId: ${paymentId},
        contents: "${contents}",
        carName: "${carName}",
        score: ${score},
        consignScore: ${consignScore},
        attachments: ${attachments}
    }) {
        acceptFlag
        carName
        consignScore
        contents
        createdAt
        id
        paymentId
        score
        status
        summaryId
        targetId
        targetType
        contents
        updatedAt
        userId
        userName
    }
  }
    `;

  console.log('query', query);
  const response = await requestGQL(query, navigation);
  console.log('InsertReviewMaster', response);
  return response;
}
