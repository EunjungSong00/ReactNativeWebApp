import React, {useCallback, useEffect, useRef, useState} from 'react';
import InstantLayout from '../../../src/component/template/InstantLayout';
import Wrapper from '../../../src/component/atom/Wrapper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IRootStackParamList from '../../../src/interface/IRootStackParamList';
import theme from '../../../public/theme';
import SearchPostWebInner from 'SearchPostWebInner';
import Postcode from '@actbase/react-daum-postcode';
import styled from '@emotion/native';

const SearchPostCodeScreen = ({navigation, route}: any) => {
  const {routeName} = route.params;

  // const navigation = useNavigation();
  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = useRef();
  /** 웹뷰 ref */
  const handleSetRef = (_ref) => {
    webviewRef = _ref;
  };

  /** webview 로딩 완료시 */
  const handleEndLoading = (e) => {
    // console.log("handleEndLoading");
    /** rn에서 웹뷰로 정보를 보내는 메소드 */
    // webviewRef.postMessage(JSON.stringify());
    // navigation.navigate('EnterShippingInfoScreen', {fullAddress: data.fullAddress, zipcode: data.zonecode});
  };

  // useEffect(() => {
  //     setDomeReady(true)
  // }, [domeReady]);

  // useEffect(( )=> {
  //     let timer = setTimeout(() => { setViewReady(true)}, 1500);
  // },[]);
  //

  const handleComplete = useCallback(
    (data: {address: any; zonecode: any; addressType: string; bname: string; buildingName: string}) => {
      console.log('data', JSON.stringify(data));
      let fullAddress = data.address;
      let extraAddress = '';

      if (data.address === 'R') {
        if (data.bname !== '') {
          extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
          extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== '' ? `${extraAddress}` : '';
      }

      // const Address = JSON.stringify(fullAddress)

      // window.ReactNativeWebView.postMessage(
      //     JSON.stringify({fullAddress})
      // )
      // if (window.ReactNativeWebview) {
      //   window.ReactNativeWebView.postMessage(
      //     (JSON.stringify(data))
      //   )
      // }

      console.log('Address', fullAddress);
      navigation.navigate(routeName, {fullAddress: fullAddress, zipcode: data.zonecode});
    },
    [navigation]
  );

  // FIXME: 렌더링 시간..뚝뚝 (은정)
  return (
    <>
      <InstantLayout title={'주소 검색'}>
        <Wrapper flexNum={1} bgColor={theme.color.white}>
          {/*<SearchPostWebInner*/}
          {/*    webviewRef={webviewRef}*/}
          {/*    ref={handleSetRef}*/}
          {/*    handleEndLoading={handleEndLoading}*/}
          {/*/>*/}
          {/*{viewReady &&*/}
          <PostContainer>
            <Postcode style={{width: '100%', height: '100%'}} jsOptions={{animation: true}} onSelected={handleComplete} />
          </PostContainer>
          {/*}*/}
        </Wrapper>
      </InstantLayout>
    </>
  );
};

export default SearchPostCodeScreen;

const PostContainer = styled(Wrapper)`
  width: 100%;
  height: 100%;
  background-color: ${theme.color.white};
`;
