import React, {useRef} from 'react';
import {SafeAreaView} from 'react-native';
import WebView from 'react-native-webview';
import theme_new from '../../public/theme_new';
import {INavigationRoute} from '../order/OrderStateScreen';
import webviewResource from '../../public/webviewResource';

const SearchDetailPerformanceScreen = ({navigation, route}: INavigationRoute) => {
  const uri = `${webviewResource.uri}/search/detail/performance?id=${route?.params?.id}&app=SearchDetailPerformanceScreen`;
  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = useRef<any>();

  const handleOnMessage = (msg: any) => {
    // data: 웹뷰에서 보낸 값
    console.log('handleOnMessage', msg.nativeEvent.data);
    if (JSON.parse(msg?.nativeEvent?.data)?.goBack === 'SearchDetailPerformanceScreen') {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme_new.colors.gray['0']}}>
      <WebView
        onMessage={handleOnMessage}
        scalesPageToFit={false}
        ref={webviewRef}
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled
        incognito
        source={{
          uri
        }}
      />
    </SafeAreaView>
  );
};

export default SearchDetailPerformanceScreen;
