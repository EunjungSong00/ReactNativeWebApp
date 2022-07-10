import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {useStores} from '../../../src/module/store';
import {getStorage, setStorage} from '../../../src/module/manageAsyncStorage';
import cancelOrderApi from '../../../src/api/payment/cancelOrderApi';
import {ActivityIndicator} from 'react-native';

const IosPlatform = ({sendMessage, uri}: any) => {
  console.log('uri 2', uri);
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [carmerceUser, setCarmerceUser] = useState<any>();
  const {vehicleStore, paymentStore} = useStores();
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (isFocused) {
      getToken();
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

  /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  const handleOnMessage = (msg: any) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    // console.log('serch에서 넘어온 데이터 값을', msg.nativeEvent.data);
    const vehicleSearchData = JSON.parse(msg?.nativeEvent?.data);
    // console.log(',dddddddddd???', vehicleSearchData)
    // console.log('id??????????', vehicleSearchData?.vehicle?.id);
    const data = JSON.parse(msg?.nativeEvent?.data);
    console.log('to', data.to);
    if (data?.to === 'PurchaseScreen') {
      if (vehicleSearchData?.vehicle) {
        const dataVehicleId = vehicleSearchData?.vehicle?.id;
        const vehicleData = {
          id: vehicleSearchData?.vehicle?.id,
          modelYear: vehicleSearchData?.vehicle?.modelYear,
          modelName: vehicleSearchData?.vehicle?.modelName,
          modelTrim: vehicleSearchData?.vehicle?.modelTrim,
          mileage: vehicleSearchData?.vehicle?.mileage,
          transmission: vehicleSearchData?.vehicle?.transmission,
          salePrice: vehicleSearchData?.vehicle?.salePrice,
          price: vehicleSearchData?.vehicle?.price,
          manufacturer: vehicleSearchData?.vehicle?.manufacturer,
          imageList: vehicleSearchData?.vehicle?.imageList[0]?.name
        };
        vehicleStore.setVehicleId(dataVehicleId);
        vehicleStore.setVehicleInfo(vehicleData);
        navigation.navigate('PurchaseScreen');
      }
    }
    if (data?.to === 'SearchResultScreen') {
      navigation.navigate('SearchResultScreen');
    }
    if (data?.to === 'SearchDetailScreen') {
      console.log(data);
      navigation.navigate('SearchDetailScreen', {id: data?.id});
    }
  };

  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  const webviewRef = useRef<any>(null);

  // /** 웹뷰 ref */
  // const handleSetRef = (_ref: any) => {
  //     webviewRef = _ref;
  // };

  const handleEndLoading = () => {
    // console.log('handleEndLoading');
    /** rn에서 웹뷰로 정보를 보내는 메소드 */
    webviewRef?.current?.postMessage(`{
      "accessToken" : "${accessToken}",
      "refreshToken" : "${refreshToken}",
      "carmerceUser" : "${carmerceUser?.id}"
    }`);
  };

  useEffect(() => {
    void getToken();
    void getCarmerceUser();
  }, []);

  // console.log('carmerceUser', carmerceUser);
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
    webviewRef?.current?.postMessage(`{
      "accessToken" : "${newToken?.accessToken}",
      "refreshToken" : "${newToken?.refreshToken}"
    }`);
    console.log('setToken', newToken?.accessToken);
  };

  const getCarmerceUser = async () => {
    const newcarmerceUser = await getStorage('carmerceUser');
    setCarmerceUser(newcarmerceUser);
  };

  const onNavigationStateChange = (navState: any) => {
    const {canGoBack} = navState;

    if (canGoBack) {
      navigation.setParams({
        isCanBack: {
          title: '',
          onPress: () => (webviewRef as any).goBack()
        }
      });
    } else {
      navigation.setParams({
        isCanBack: null
      });
    }
  };

  return (
    <WebView
      onLoadEnd={handleEndLoading}
      onMessage={handleOnMessage}
      scalesPageToFit={false}
      ref={webviewRef}
      allowsBackForwardNavigationGestures
      onNavigationStateChange={onNavigationStateChange}
      onLoadStart={sendMessage}
      sharedCookiesEnabled
      incognito
      bounces={false}
      source={{
        uri
      }}
    />
  );
};

export default IosPlatform;
