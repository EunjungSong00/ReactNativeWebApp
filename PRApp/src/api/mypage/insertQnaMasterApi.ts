import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export type InsertQnaMasterQueryType = {
  questionFlag: number;
  vehicleId?: number;
  title: string;
  contents: string;
  anonymityFlag: 0 | 1;
};

export default async function insertQnaMasterApi({questionFlag, vehicleId, title, contents, anonymityFlag}: InsertQnaMasterQueryType, navigation: StackNavigationProp) {
  const query = `
  mutation  {
    insertQnaMaster(data: {
      categoryId: 1,
      questionFlag: ${questionFlag},
      ${vehicleId ? `vehicleId: ${vehicleId},` : ''}
      title: "${title}",
      contents: ${JSON.stringify(contents)},
      anonymityFlag: ${anonymityFlag},
    }) {
      id
      categoryId
      questionFlag
      vehicleId
      title
      contents
      anonymityFlag
      commentCount
      userId
      userName
      status
      createdAt
      updatedAt
      attachments {
        id
        masterId
        attachType
        attach
        seq
        status
        createdAt
        updatedAt
      }
      comments {
        id
        masterId
        comment
        actionId
        actionName
        status
        updatedAt
        createdAt
      }
    }
  }
    `;

  console.log('insertQnaMasterApi query', query);
  const response = await requestGQL(query, navigation);
  console.log('insertQnaMasterApi response', response);
  return response;
}
