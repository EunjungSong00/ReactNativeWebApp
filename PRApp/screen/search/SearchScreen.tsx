import React, {useEffect, useRef, useState} from 'react';
import {Platform, SafeAreaView} from 'react-native';
import {observer} from 'mobx-react';
import {useIsFocused} from '@react-navigation/native';
import {useStores} from '../../src/module/store';
import theme_new from '../../public/theme_new';
import {getStorage, setStorage} from '../../src/module/manageAsyncStorage';
import cancelOrderApi from '../../src/api/payment/cancelOrderApi';
import IosPlatform from './platform/iosPlatform';
import AndroidPlatform from './platform/androidPlatform';
import webviewResource from '../../public/webviewResource';

const SearchScreen = ({navigation, route}: any) => {
  const q = route?.params?.q || '';
  const isFromHome = route?.params?.isFromHome;
  const uri = route && route.params && route.params.isSearchResultScreen ? `${webviewResource.uri}/search/search-result?q=${q}` : `${webviewResource.uri}/search`;
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [carmerceUser, setCarmerceUser] = useState<any>();
  const {vehicleStore, paymentStore} = useStores();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const orderId = paymentStore.orderId;
      if (orderId) {
        cancelOrderId(orderId);
      }
    }
  }, [isFocused]);

  const cancelOrderId = (orderId: string) => {
    cancelOrderApi({orderId, navigation}).then((res) => {
      console.log('cancelOrderApi', res);
      if (res.cancelOrder) {
        setStorage('orderId', '');
        paymentStore.setPaymentOrderId('');
      }
    });
  };

  useEffect(() => {
    void getToken();
    void getCarmerceUser();
  }, []);

  // console.log(
  //   'JSONSTRINGFY SEARCH',
  //   JSON.stringify({
  //     accessToken: accessToken,
  //     refreshToken: refreshToken,
  //     carmerceUser: carmerceUser
  //   })
  // );

  const getToken = async () => {
    const newToken = await getStorage('token');
    setAccessToken(newToken?.accessToken);
    setRefreshToken(newToken?.refreshToken);
  };

  const getCarmerceUser = async () => {
    const newcarmerceUser = await getStorage('carmerceUser');
    setCarmerceUser(newcarmerceUser);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme_new.colors.gray['0']}}>
      {Platform.OS === 'ios' ? <IosPlatform uri={uri} isFromHome={isFromHome} /> : <AndroidPlatform uri={uri} isFromHome={isFromHome} />}
    </SafeAreaView>
  );
};

export default observer(SearchScreen);
