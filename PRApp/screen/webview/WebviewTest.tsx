import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';

const WebviewTest = ({handleSetRef, handleEndLoading, sendMessage}: any) => {
  const uri = 'http://localhost:3000';

  /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  const handleOnMessage = (msg: any) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    console.log(msg.nativeEvent.data);
  };

  const setCookie = () =>
    CookieManager.set('http://localhost:3000', {
      name: 'cookies',
      value: '쿠키다1',
      domain: 'localhost',
      path: '/',
      version: '1',
      expires: '2022-05-30T12:30:00.00-05:00'
    })
      .then((done) => {
        console.log('CookieManager.set =>', done);
      })
      .catch((e) => {
        console.log('CookieManager error =>', e);
      });

  const clearCookies = () =>
    CookieManager.clearAll(uri)
      .then((succcess) => {
        console.log('CookieManager.clearAll from webkit-view =>', succcess);
      })
      .catch((e) => console.log('clearAll error', e));

  const getCookies = () =>
    CookieManager.getAll(uri).then((cookies) => {
      console.log('CookieManager.getAll from webkit-view =>', cookies?.cookie?.value);
    });

  return (
    <>
      <WebView
        onLoadEnd={handleEndLoading}
        onMessage={handleOnMessage}
        ref={handleSetRef}
        onLoadStart={sendMessage}
        source={{
          uri,
          headers: {
            Cookie: JSON.stringify({
              carmerceUserAccessToken: 'accessTokenTest',
              carmerceUserRefreshToken: 'refreshTokenTest',
              carmerceUserInfo: 'infoTest'
            })
          }
        }}
        sharedCookiesEnabled
        incognito
      />
      <TouchableOpacity onPress={sendMessage}>
        <Text>[react-native] react 웹뷰로 데이터 전송 Click!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={setCookie}>
        <Text>[react-native] 쿠키 set Click!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearCookies}>
        <Text>[react-native] 쿠키 삭제 Click!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getCookies}>
        <Text>[react-native] 쿠키 console 가져오기 Click!</Text>
      </TouchableOpacity>
    </>
  );
};

export default WebviewTest;
