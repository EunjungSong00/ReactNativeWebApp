import React, {useRef} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import Layout from '../../src/component/template/Layout';

const uri = 'http://localhost:3000/login/nice';
const NicePssScreen = () => {
  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = useRef();

  /** 웹뷰 ref */
  const handleSetRef = (_ref: any) => {
    webviewRef = _ref;
  };

  return (
    <Layout>
      <WebView
        // onLoadEnd={handleEndLoading}
        // onMessage={handleOnMessage}
        ref={handleSetRef}
        // onLoadStart={sendMessage}
        source={{
          uri
          //     headers: {
          //       Cookie: JSON.stringify({
          //         carmerceUserAccessToken: 'accessTokenTest',
          //         carmerceUserRefreshToken: 'refreshTokenTest',
          //         carmerceUserInfo: 'infoTest'
          //       })
          //     }
        }}
        //   sharedCookiesEnabled
        //   incognito
      />
    </Layout>
  );
};

export default NicePssScreen;
