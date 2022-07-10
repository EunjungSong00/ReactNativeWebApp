import React, {useEffect, useRef, useState} from 'react';
import {BackHandler} from 'react-native';
import {observer} from 'mobx-react';
import {useFocusEffect, useIsFocused, useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {useStores} from '../../../src/module/store';
import {getStorage, setStorage} from '../../../src/module/manageAsyncStorage';
import cancelOrderApi from '../../../src/api/payment/cancelOrderApi';
import webviewResource from '../../../public/webviewResource';

// console.log('url', JSON.stringify(uri))
const AndroidPlatform = ({sendMessage, uri}: any) => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [carmerceUser, setCarmerceUser] = useState<any>();
  const {vehicleStore, paymentStore} = useStores();
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  console.log('ANDROID');
  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  const webview = useRef<any>(null);
  const [isCanGoBack, setIsCanGoBack] = useState(false);
  const [popupDisabled, setPopupDisabled] = useState(false);
  const onPressHardwareBackButton = () => {
    if (webview.current && isCanGoBack) {
      webview.current.goBack();
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onPressHardwareBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onPressHardwareBackButton);
    };
  }, [isCanGoBack]);

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

  /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  const handleOnMessage = (msg: any) => {
    if (msg?.nativeEvent?.data === 'navigationStateChange') {
      // Navigation state updated, can check state.canGoBack, etc.
      setIsCanGoBack(msg?.nativeEvent?.canGoBack);
    }
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    // console.log('serch에서 넘어온 데이터 값을', msg.nativeEvent.data);
    // console.log(',dddddddddd???', vehicleSearchData)
    // console.log('id??????????', vehicleSearchData?.vehicle?.id);
    if (msg?.nativeEvent?.data !== 'navigationStateChange') {
      console.log(typeof msg?.nativeEvent?.data);
      console.log(msg?.nativeEvent?.data);

      const data = JSON.parse(msg?.nativeEvent?.data);
      console.log('to', data.to);
      if (data?.to === 'PurchaseScreen') {
        const vehicleSearchData = JSON.parse(msg?.nativeEvent?.data);
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
    }
  };
  let webviewRef = useRef<any>(null);

  // /** 웹뷰 ref */
  // const handleSetRef = (_ref: any) => {
  //     webviewRef = _ref;
  // };

  const handleEndLoading = () => {
    // console.log('handleEndLoading');
    /** rn에서 웹뷰로 정보를 보내는 메소드 */
    (webview?.current as any)?.postMessage(`{
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
  };

  const getCarmerceUser = async () => {
    const newcarmerceUser = await getStorage('carmerceUser');
    setCarmerceUser(newcarmerceUser);
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     // if (popupDisabled) {
  //     console.log('back');
  //     // setPopupDisabled(false);
  //     return true;
  //     // }
  //   };

  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () => backHandler.remove();
  // }, []);

  return (
    <WebView
      onLoadEnd={handleEndLoading}
      onMessage={handleOnMessage}
      scalesPageToFit={false}
      ref={webview}
      // onNavigationStateChange={setNavState}
      onLoadStart={sendMessage}
      sharedCookiesEnabled
      incognito
      injectedJavaScript={`
        (function() {
          function wrap(fn) {
            return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage('navigationStateChange');
              return res;
            }
          }

          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
            window.ReactNativeWebView.postMessage('navigationStateChange');
          });
        })();

        true;
      `}
      source={{
        uri
      }}
    />
  );
};

export default observer(AndroidPlatform);
