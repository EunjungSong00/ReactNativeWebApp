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
import {compose} from 'styled-system';

const ReviewWriteEditScreen = ({navigation, route}: {navigation: StackNavigationProp; route: NavigationRoute}) => {
  const item = route?.params?.item;
  const [step, setStep] = useState(1);
  const [carRating, setCarRating] = useState(item?.score);
  const [shippingRating, setShippingRating] = useState(item?.shippingRating | 0);
  const [file, setFile] = useState<(string | undefined)[]>([]);
  const [attachments, setAttachments] = useState<(any | undefined)[]>([]);
  const successPopup = usePopup();
  const inquireContent = useInput(item?.content);
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
            <Txt style={{marginTop: 8}} lineHeight={18} weight="regular" size="xs">
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
            {/* {data?.review ? '리뷰 완료' : '리뷰 대기'} */}
            리뷰 작성중
          </Txt>
        </Wrapper>
      </ReviewItemWrapper>
    );
  }

  const showPicker = () => {
    //launchImageLibrary : 사용자 앨범 접근
    launchImageLibrary({}, (res) => {
      if (res?.assets) {
        console.log(res);
        // alert(res?.assets[0]?.uri);
        const formdata = new FormData();
        formdata.append('file', res?.assets[0]?.uri);
        console.log(res?.assets[0]?.uri);
        setFile([...file, res?.assets[0]?.uri]);
        setAttachments([
          ...attachments,
          {
            attachType: 'IMAGE',
            attach: res?.assets[0]?.uri
          }
        ]);
      }
    });
  };
  const insertReview = useCallback(async () => {
    // successPopup.setPopupContents({title: '등록 완료', text: '리뷰가 등록되었습니다.', clickConfirm: () => navigation.navigate('ReviewWriteScreen')});
    await insertReviewMaster(
      {
        targetType: 'COMPANY',
        targetId: 1,
        paymentId: 1,
        contents: inquireContent.value,
        carName: '아반떼',
        score: carRating,
        consignScore: shippingRating,
        attachments: JSON.stringify(attachments)
          .replace(/"attachType"/g, 'attachType')
          .replace(/"attach"/g, 'attach')
          .replace(/"IMAGE"/g, 'IMAGE')
      },
      navigation
    ).then((res) => {
      if (res?.insertReviewMaster) {
        successPopup.setPopupContents({title: '등록 완료', text: '리뷰가 등록되었습니다.', clickConfirm: () => navigation.navigate('ReviewWriteScreen')});
        setCarRating(0);
        setShippingRating(0);
        inquireContent.setValue('');
      }
    });
  }, [inquireContent]);

  return (
    <InstantLayout title={'리뷰작성'}>
      <ScrollView style={{backgroundColor: 'white'}}>
        {step === 1 ? (
          <>
            <Wrapper p={20} backgroundColor="white">
              <ReviewInfo data={item} />
            </Wrapper>
            <Wrapper height={12} backgroundColor="rgba(207, 213, 219, 0.3)"></Wrapper>
            <Wrapper backgroundColor="white" w>
              <Txt mb={10} mt={40} size="sm" weight="bold">
                차량은 만족하셨나요?
              </Txt>
              <StarRating score={carRating} setScore={setCarRating} />
              {carRating !== 0 && (
                <>
                  <Txt mb={10} mt={40} size="sm" weight="bold">
                    배송 서비스는 어떠셨나요?
                  </Txt>
                  <StarRating score={shippingRating} setScore={setShippingRating} />
                </>
              )}
              <Txt mt={50} size="xs" weight="regular" textAlign="center" lineHeight={20}>
                {`카머스가 더 좋은 중고차 문화를
만들어 갈 수 있게 평가 부탁드려요.`}
              </Txt>
              {shippingRating !== 0 && (
                <ButtonNew width="220px" height="50px" onPress={() => setStep(2)} size="sm" weight="medium" title={'자세한 리뷰 작성하기'} type={'line'} round thin mt={30} />
              )}
            </Wrapper>
          </>
        ) : (
          <>
            <Wrapper p={20} backgroundColor="white">
              <ReviewInfo data={item} />
            </Wrapper>

            <Wrapper height={12} backgroundColor="rgba(207, 213, 219, 0.3)"></Wrapper>
            <Wrapper p={20} backgroundColor="white">
              <Txt size="xs" weight="medium">
                차량은 만족하셨나요?
              </Txt>
              <StarRating style={{marginTop: 5}} size="medium" readOnly score={carRating} />
              <Txt mt={20} size="xs" weight="medium">
                배송 서비스는 어떠셨나요?
              </Txt>
              <StarRating style={{marginTop: 5}} size="medium" readOnly score={shippingRating} />

              <Txt mt={30} mb={10} size="xs" weight="medium">
                상품을 상세히 평가해주세요.
              </Txt>
              <TextArea
                bgGray
                placeholder="상품 품질과 서비스에 대한 고객님의 솔직한 평가를 남겨주세요."
                height={'150px'}
                border
                value={inquireContent.value}
                onChangeText={(e: string) => inquireContent.setValue(e)}
                maxLength={500}
                fontSize={'13px'}
                fontFamily={theme.font.regular}
              />

              <Txt mt={20} mb={10} size="xs" weight="medium">
                사진첨부
              </Txt>
              <ScrollView horizontal>
                <Wrapper flexDirection="row">
                  {file.length < 5 && (
                    <TouchableOpacity onPress={showPicker}>
                      <Img style={{marginRight: 10}} src={require('../../public/image/component/icon-review-image-plus.png')} width={72} height={72} />
                    </TouchableOpacity>
                  )}
                  {file.map((item, index) => (
                    <ImageWrapper key={index} position="relative">
                      <Image style={{width: 72, height: 72}} source={{uri: item}} />
                      <Wrapper width={72} height={72} backgroundColor="rgba(0, 0, 0, 0.2)" position="absolute"></Wrapper>
                      <TouchableOpacity
                        style={{width: 16, height: 16, position: 'absolute', top: 5, right: 5}}
                        onPress={() => {
                          setFile(file.filter((_, key) => index !== key));
                        }}
                      >
                        <Img style={{width: 16, height: 16, position: 'absolute', zIndex: 1}} src={require('../../public/image/component/icon-review-image-delete.png')} />
                      </TouchableOpacity>
                    </ImageWrapper>
                  ))}
                </Wrapper>
              </ScrollView>
            </Wrapper>
            <Wrapper row between paddingX={15} paddingY={12} bgColor={theme.color.white}>
              <ButtonNew
                width={'49%'}
                type={'gray'}
                title={'취소'}
                onPress={() => {
                  //   setStep(0);
                  //   setCarRating(0);
                  //   setShippingRating(0);
                  //   inquireContent.setValue('');
                  navigation.navigate('ReviewWriteScreen');
                }}
              />
              <ButtonNew width={'49%'} title={'리뷰 등록'} onPress={insertReview} />
            </Wrapper>
          </>
        )}

        <successPopup.Popup />
      </ScrollView>
    </InstantLayout>
  );
};

export default ReviewWriteEditScreen;

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
