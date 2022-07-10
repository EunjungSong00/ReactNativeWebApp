import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {NavigationActions} from 'react-navigation';
import webviewResource from '../../../public/webviewResource';

const SearchPostWebInner = ({handleSetRef, handleEndLoading}: any) => {
  const navigation = useNavigation();
  const uri = `${webviewResource.uri}/cart/search-address`;

  const handleOnMessage = ({nativeEvent}: any) => {
    // 웹뷰에서 받는 데이터
    console.log('RN 에서 받아옴', nativeEvent.data);
    console.log(' 우편번호', nativeEvent.data.zonecode);
    // const Address = { fullAddress :  nativeEvent.data.fullAddress, zonecode: nativeEvent.data.zonecode};
    // console.log('Address', Address)
    // handleChangeAddress(address, zonecode );
    // handleEndLoading({fullAddress :  nativeEvent.data.fullAddress, zonecode: nativeEvent.data.zonecode});
    navigation.navigate('EnterShippingInfoScreen', {fullAddress: nativeEvent.data.fullAddress, zipcode: nativeEvent.data.zonecode});
  };

  return <WebView onLoadEnd={handleEndLoading} onMessage={handleOnMessage} ref={handleSetRef} source={{uri}} startInLoadingState={true} />;
};

export default SearchPostWebInner;
