import React, {useEffect, useRef, useState} from 'react';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {SafeAreaView} from 'react-native';
import theme_new from '../../public/theme_new';
import {observer} from 'mobx-react';
import {getStorage} from '../../src/module/manageAsyncStorage';
import {useIsFocused} from '@react-navigation/native';
import webviewResource from '../../public/webviewResource';

const MainScreen = ({navigation, handleSetRef, sendMessage}: any) => {
  const uri = `${webviewResource.uri}/home`;
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [carmerceUser, setCarmerceUser] = useState<any>();
  const isFocus = useIsFocused();

  useEffect(() => {
    isFocus && navigation.navigate('MainScreen');
  }, [isFocus]);

  const handleOnMessage = (msg: any) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    console.log(msg.nativeEvent.data);
    const data: string = msg?.nativeEvent?.data;
    if (data === 'goSearchScreen') navigation.navigate('SearchScreen');
    else if (data.startsWith('goSearchResultScreen')) {
      navigation.navigate('SearchScreen', {isSearchResultScreen: true, q: data.split(' - ')[1]});
    }
    else if (data === 'termCustomer') {
      navigation.navigate('TosScreen', {type: 'customer', title: '서비스이용안내'});
    }
    else if (data === 'termPersonal') {
      navigation.navigate('TosScreen', {type: 'personalInformation', title: '개인정보처리방침'});
    }
  };

  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = useRef<any>();

  useEffect(() => {
    void getToken();
    void getCarmerceUser();
  }, []);

  const getToken = async () => {
    const newToken = await getStorage('token');
    setAccessToken(newToken?.accessToken);
    setRefreshToken(newToken?.refreshToken);
  };

  const getCarmerceUser = async () => {
    const newCarmerceUser = await getStorage('carmerceUser');
    setCarmerceUser(newCarmerceUser);
  };

  // rn에서 웹뷰로 정보를 보내는 메소드
  const handleEndLoading = () => {
    (webviewRef?.current as any)?.postMessage(`{
      "accessToken" : "${accessToken}",
      "refreshToken" : "${refreshToken}",
      "carmerceUser" : "${carmerceUser?.id}"
    }`);
  };

  const onNavigationStateChange = (e: WebViewNavigation) => {
    console.log('e.url', e.url);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme_new.colors.gray['0']}}>
      <WebView
        onLoadEnd={handleEndLoading}
        onMessage={handleOnMessage}
        ref={webviewRef}
        onLoadStart={sendMessage}
        sharedCookiesEnabled
        incognito
        onNavigationStateChange={onNavigationStateChange}
        source={{
          uri,
          headers: {
            Cookie: JSON.stringify({
              path: '/home',
              accessToken: accessToken,
              refreshToken: refreshToken,
              carmerceUser: carmerceUser?.id
            })
          }
        }}
      />
    </SafeAreaView>
  );
};

export default observer(MainScreen);
