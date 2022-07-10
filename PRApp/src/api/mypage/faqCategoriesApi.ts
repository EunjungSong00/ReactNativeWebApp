import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import requestGQL from '../../module/requestGQL';

export default async function faqCategoriesApi(navigation: StackNavigationProp) {
  const query = `
  query {
    faqCategories(filter: {
      status:ACTIVE
    },
    pagination:{
      page:1,
      size:100,
      sort:[
        {
          field:"seq",
          direction:ASC
        },
        {
          field: "masters.seq",
          direction: DESC
        }  ]
    }
    ) {
      edges {
        node {
          title
          masters {
            title
            contents
          }
        }
      }
    }
  }
  
    `;

  const response = await requestGQL(query, navigation);
  // console.log('faqCategoriesApi', response);
  return response;
}
