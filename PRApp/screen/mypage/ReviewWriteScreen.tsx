import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from '../../src/component/atom/Wrapper';
import InstantLayout from '../../src/component/template/InstantLayout';
import useInput from '../../src/hook/useInput';
import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import {NavigationRoute} from 'react-navigation';
import Txt from '../../src/component/atom/Txt';
import theme from '../../public/theme';
import {ScrollView} from 'react-native-gesture-handler';
import styled from '@emotion/native';
import ButtonNew from '../../src/component/atom/ButtonNew';
import TextArea from '../../src/component/atom/TextArea';
import {launchImageLibrary} from 'react-native-image-picker';
import {Image, TouchableOpacity} from 'react-native';
import Img from '../../src/component/atom/Img';
import StarRating from '../../src/component/atom/StarRating';
import insertReviewMaster from '../../src/api/mypage/insertReviewMasterApi';
import usePopup from '../../src/hook/usePopup';

const data = [
  {
    title: '2020 현대 더 뉴 그랜저',
    subTitle: '하이브리드 2.4 익스클루시브',
    deliveryCompletedDate: '22.11.07',
    creationDeadlineDate: '23.11.07',
    createdDate: '22.12.07',
    kilos: 31128,
    transmission: '가솔린+전기',
    review: false,
    company: '오토허브 상사',
    score: 0
  },
  {
    title: '2020 현대 더 뉴 그랜저',
    subTitle: '하이브리드 2.4 익스클루시브',
    deliveryCompletedDate: '22.11.07',
    creationDeadlineDate: '23.11.07',
    createdDate: '22.12.07',
    kilos: 31128,
    transmission: '가솔린+전기',
    review: true,
    company: '오토허브 상사',
    score: 4,
    shippingRating: 1,
    content: '딜러가 친절하고 재밌고 구매도 편리하고 대만족입니다. 다좋아요 매우 좋아요 차상태도 좋아요'
  }
];

const ReviewWriteScreen = ({navigation, route}: {navigation: StackNavigationProp; route: NavigationRoute}) => {
  const successPopup = usePopup();
  function ReviewInfo({data}: {data: any}) {
    return (
      <ReviewItemWrapper border="1px solid #000000" borderRadius={10}>
        <Wrapper p={15} height={120} flexDirection="row">
          <Wrapper mr={15}>
            <Wrapper size={80} backgroundColor="lightgray"></Wrapper>
          </Wrapper>
          <Wrapper>
            <Txt weight="bold" size="sm">
              {data?.title}
            </Txt>
            <Txt style={{marginTop: 5}} lineHeight={18} weight="regular" size="xs">
              {data?.subTitle}
            </Txt>
            <Txt lineHeight={18} weight="regular" size="xs">
              {data?.kilos}km
            </Txt>
            <Txt mt={10} weight="regular" size="xs">
              구매일 : 21.11.07
            </Txt>
          </Wrapper>
        </Wrapper>
        <Wrapper w h backgroundColor={data?.review ? '#d7dde5' : '#007aff'}>
          <Txt style={{paddingTop: 9, paddingBottom: 9}} size="sm" weight="regular" color="white">
            {data?.review ? '리뷰 완료' : '리뷰 미작성'}
          </Txt>
        </Wrapper>
      </ReviewItemWrapper>
    );
  }
  function ReviewListItem({item, last}: {item: any; last?: boolean}) {
    return (
      <>
        <Wrapper pl={20} pr={20}>
          <ReviewInfo data={item} />
          <Wrapper mt={20} flexDirection="row" between>
            <Wrapper>
              <Txt mb={10} size="sm" weight="bold">
                {item?.company}
              </Txt>
              <StarRating readOnly size="small" score={item?.score} />
            </Wrapper>
            <Wrapper>
              {item?.review ? (
                <>
                  <Txt size="xs" weight="regular" lineHeight={20}>
                    {' '}
                  </Txt>
                  <Txt size="xs" weight="regular" lineHeight={20}>
                    작성일 {item?.createdDate}
                  </Txt>
                </>
              ) : (
                <>
                  <Txt size="xs" weight="regular" lineHeight={20}>
                    배송완료 {item?.deliveryCompletedDate}
                  </Txt>
                  <Txt size="xs" weight="regular" lineHeight={20}>
                    작성기한 {item?.creationDeadlineDate}
                  </Txt>
                </>
              )}
            </Wrapper>
          </Wrapper>
          {item?.review && (
            <Txt mt={20} lineHeight={22} size={'sm'} weight="regular">
              딜러가 친절하고 재밌고 구매도 편리하고 대만족입니다. 다좋아요 매우 좋아요 차상태도 좋아요
            </Txt>
          )}
          <Wrapper mt={25}>
            <ButtonNew
              title={!item?.review ? '리뷰 작성' : '리뷰 수정'}
              type={!item?.review ? 'line' : 'line'}
              onPress={() => navigation.navigate('ReviewWriteEditScreen', {item: item})}
            />
          </Wrapper>
        </Wrapper>
        <Wrapper height={12} mt={20} mb={last ? 0 : 40} backgroundColor="rgba(207, 213, 219, 0.3)"></Wrapper>
      </>
    );
  }

  return (
    <InstantLayout title={'리뷰작성'}>
      <ScrollView style={{backgroundColor: 'white'}}>
        <Wrapper pt={20} backgroundColor="white">
          {data.map((item, key) => (
            <ReviewListItem key={key} item={item} last={key === data.length - 1} />
          ))}
        </Wrapper>
        <successPopup.Popup />
      </ScrollView>
    </InstantLayout>
  );
};

export default ReviewWriteScreen;

const ReviewItemWrapper = styled(Wrapper)<any>`
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #d7dde5;
`;
const ImageWrapper = styled(Wrapper)`
  margin-right: 10px;
  width: 72px;
  height: 72px;
  border: 1px solid #cfd5db;
  border-radius: 6px;
  overflow: hidden;
`;
