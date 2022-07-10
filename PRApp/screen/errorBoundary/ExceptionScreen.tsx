import React, {useEffect, useRef, useState} from 'react';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {SafeAreaView} from 'react-native';
import theme_new from '../../public/theme_new';
import {getStorage} from '../../src/module/manageAsyncStorage';
import webviewResource from '../../public/webviewResource';

const ExceptionScreen = ({navigation, handleSetRef, sendMessage}: any) => {
  const uri = `${webviewResource.uri}/error-handling`;
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [carmerceUser, setCarmerceUser] = useState<any>();

  const handleOnMessage = (msg: any) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    const data: string = msg?.nativeEvent?.data;
    console.log(data);
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
              path: '/',
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

export default ExceptionScreen;
