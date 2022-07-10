import React, {useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {useStores} from '../../src/module/store';
import {getQueryFromUrl} from '../../src/module/formatter';
import getNiceCheckRequestApi from '../../src/api/getNiceCheckRequestApi';
import niceHtml from 'niceHtml';
import IamportUrl from 'IamportUrl';
import Toast from '../../src/component/atom/Toast';

const NiceScreen = ({navigation, route}) => {
  const [encode, setEncode] = useState();
  const toastRef = useRef<any>(null);
  const webview = useRef<WebView>();
  const {niceStore} = useStores();

  /** webview 로딩 완료시 */
  const handleEndLoading = (e) => {
    // console.log('handleEndLoading');
  };

  useEffect(() => {
    getNiceCheckRequestApi()
      .then((res) => {
        console.log('checkNiceBtnres' + JSON.stringify(res));
        const encodeData = res.niceIdentityAuthenticationRequestData;
        setEncode(encodeData);
      })
      .catch((err) => {
        console.log('checkNiceBtnerr' + err);
        const errorMessage = err?.response?.errors[0]?.message;
        toastRef.current.show(errorMessage);
      });
  }, []);

  // useMemo로 필요한 경우에만 webview를 리렌더링하게한다.
  const source = useMemo(() => {
    if (encode) {
      let html = niceHtml;
      //console.log('sourceencode', encode)
      html = html.replace(/<%EncodeData%>/g, encode);

      //console.log('sourcehtml', html)
      return {html};
    }
  }, [encode]);

  const onNavigationStateChange = (navState) => {
    console.log('navState:', navState);
    //console.log('indexOf', navState.url.includes('encodeData'))
    if (navState.url.includes('email') && route.params.title === 'SignUp') {
      const email = getQueryFromUrl(navState.url, 'email');
      niceStore.setNiceEmail(email);
      navigation.goBack();
    } else if (navState.url.includes('encodeData')) {
      const encodeData = getQueryFromUrl(navState.url, 'encodeData');
      console.log('encodeData', route.params.title, encodeData);
      niceStore.setNiceEncodeData(encodeData);
      navigation.replace(route.params.title);
      /*navigation.reset({
                routes: [
                    {
                        name: route.params.title,
                        params: { encodeData }
                    }
                ]
            });*/
    } /* else {
            niceStore.setNiceFail(true);
            navigation.goBack();
        }*/
  };

  const onShouldStartLoadWithRequest = (request) => {
    const {url} = request;
    const iamportUrl = new IamportUrl(url);
    console.log('url: ' + iamportUrl.isAppUrl());
    if (iamportUrl.isAppUrl()) {
      /* 3rd-party 앱 오픈 */
      iamportUrl.launchApp().catch((e) => {
        const {code, message} = e;
        console.log('iamportUrl.launchApp()', {
          imp_success: false,
          error_code: code,
          error_msg: message
        });
      });

      return false;
    }
    /*if (iamportUrl.isPaymentOver()) {
            console.log('iamportUrl.isPaymentOver()', iamportUrl.getQuery());
            return false;
        }*/

    return true;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {encode ? (
        <WebView
          ref={(ref) => {
            if (ref !== null) {
              webview.current = ref;
            }
          }}
          useWebKit //ios -use WKWebView instead of UIWebView
          source={source}
          onNavigationStateChange={onNavigationStateChange}
          onLoadEnd={handleEndLoading}
          originWhitelist={['*']} // https://github.com/facebook/react-native/issues/19986
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        />
      ) : (
        <Toast ref={toastRef} />
      )}
    </SafeAreaView>
  );
};
export default NiceScreen;
