import React, {useRef} from 'react';
import {SafeAreaView} from 'react-native';
import WebView from 'react-native-webview';
import theme_new from '../../public/theme_new';
import {INavigationRoute} from "../order/OrderStateScreen";

const SearchDetailOptionScreen = ({navigation, route}: INavigationRoute) => {
    // const uri = 'http://172.10.10.253:3000/search/detail/option';
    const uri = `http://34.64.249.63/search/detail/option?id=${route?.params?.id}&app=SearchDetailOptionScreen`;
    // const uri = `http://172.10.10.253:3000/search/detail/option?id=${route.params.id}&app=SearchDetailOptionScreen`;

    // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
    let webviewRef = useRef<any>();

    const handleOnMessage = (msg: any) => {
        // data: 웹뷰에서 보낸 값
        console.log('handleOnMessage', msg.nativeEvent.data);
        if (JSON.parse(msg?.nativeEvent?.data)?.goBack === 'SearchDetailOptionScreen') {
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

export default SearchDetailOptionScreen;
