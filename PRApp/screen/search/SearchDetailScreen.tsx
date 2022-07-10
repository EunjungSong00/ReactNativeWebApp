import React, {useEffect, useRef, useState, useCallback} from 'react';
import {BackHandler, Platform, SafeAreaView} from 'react-native';
import {observer} from 'mobx-react';
import {useIsFocused} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {useStores} from '../../src/module/store';
import theme_new from '../../public/theme_new';
import {getStorage} from '../../src/module/manageAsyncStorage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import usePopup from '../../src/hook/usePopup';

// console.log('url', JSON.stringify(uri))
const SearchDetailScreen = ({navigation, handleSetRef, sendMessage, route}: any) => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [carmerceUser, setCarmerceUser] = useState();
  const {vehicleStore, paymentStore} = useStores();
  const [isCanGoBack, setIsCanGoBack] = useState(false);
  const {Popup, setPopupContents} = usePopup();
  const isFocused = useIsFocused();
  const id = route?.params?.id;
  // const uri = `http://172.10.10.72:3000/search/detail?id=${id}&app=SearchDetailScreen`;
  const uri = `http://34.64.249.63/search/detail?id=${id}&app=SearchDetailScreen`;
  const webviewRef = useRef<any>();

  useEffect(() => {
    if (isFocused) {
      getToken();
    }
  }, [isFocused]);

  const onPressHardwareBackButton = () => {
    if (webviewRef.current && isCanGoBack) {
      webviewRef.current.goBack();
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

  const goPurchaseScreen = (vehicleSearchData: any) => {
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
  };
  const handleOnMessage = useCallback(
    async (msg: any) => {
      if (Platform.OS === 'ios') msg.persist();
      if (msg?.nativeEvent?.data === 'navigationStateChange') {
        // Navigation state updated, can check state.canGoBack, etc.
        setIsCanGoBack(msg?.nativeEvent?.canGoBack);
      }

      const vehicleSearchData = JSON.parse(msg?.nativeEvent?.data);
      console.log('accessToken : ', accessToken);
      // alert(JSON.stringify(vehicleSearchData?.vehicle?.id));
      if (accessToken) {
        goPurchaseScreen(vehicleSearchData);
      } else {
        const token = await getStorage('token');

        if (token?.accessToken) {
          goPurchaseScreen(vehicleSearchData);
        } else {
          setPopupContents({
            text: `온라인 구매는 로그인을 하셔야 해요`,
            clickConfirm: () => navigation.navigate('LoginScreen', {id: vehicleSearchData?.vehicle?.id})
          });
        }
      }

      if (JSON.parse(msg?.nativeEvent?.data)?.goBack === 'SearchDetailScreen') {
        navigation.goBack();
      }
    },
    [accessToken]
  );

  const handleEndLoading = () => {
    console.log('handleEndLoading');
    /** rn에서 웹뷰로 정보를 보내는 메소드 */
    webviewRef?.current?.postMessage(`{
      "accessToken" : "${accessToken}",
      "refreshToken" : "${refreshToken}",
      "carmerceUser" : "${carmerceUser?.id}"
    }`);
  };

  const getToken = async () => {
    const newToken = await getStorage('token');
    setAccessToken(newToken?.accessToken);
    setRefreshToken(newToken?.refreshToken);
    webviewRef?.current?.postMessage(`{
      "accessToken" : "${newToken?.accessToken}",
      "refreshToken" : "${newToken?.refreshToken}"
    }`);
  };

  const getCarmerceUser = async () => {
    const newcarmerceUser = await getStorage('carmerceUser');
    setCarmerceUser(newcarmerceUser);
  };

  useEffect(() => {
    console.log('getToken');
    void getToken();
    void getCarmerceUser();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const onNavigationStateChange = (navState: any) => {
    if (Platform.OS === 'ios') {
      const {canGoBack} = navState;
      if (canGoBack) {
        navigation.setParams({
          isCanBack: {
            title: '',
            onPress: () => webviewRef.goBack()
          }
        });
      } else {
        navigation.setParams({
          isCanBack: null
        });
      }
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: theme_new.colors.gray['0']}}>
        {/*<RNListener />*/}
        <WebView
          onLoadEnd={handleEndLoading}
          onMessage={handleOnMessage}
          scalesPageToFit={false}
          ref={webviewRef}
          onLoadStart={sendMessage}
          sharedCookiesEnabled
          incognito
          source={{
            uri
          }}
          allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
          onNavigationStateChange={onNavigationStateChange}
          injectedJavaScript={
            Platform.OS !== 'ios'
              ? `
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
      `
              : ''
          }
        />
      </SafeAreaView>
      <Popup />
    </>
  );
};

export default observer(SearchDetailScreen);
