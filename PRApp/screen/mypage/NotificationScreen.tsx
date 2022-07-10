import React, {useEffect, useRef, useState} from 'react';
import IRootStackParamList from '../../src/interface/IRootStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import WebView from 'react-native-webview';
import {SafeAreaView} from 'react-native';
import theme_new from '../../public/theme_new';
import {observer} from 'mobx-react';
import {useStores} from '../../src/module/store';
import {getStorage} from '../../src/module/manageAsyncStorage';
import InstantLayout from '../../src/component/template/InstantLayout';
type SearchScreenProps = NativeStackScreenProps<IRootStackParamList, 'Search'>;

// console.log('url', JSON.stringify(uri))
const NotificationScreen = ({navigation, sendMessage}: any) => {
  const uri = 'http://34.64.249.63/home/notification?type=app';
  // const uri = 'http://localhost:3000/home/notification?type=app';
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [carmerceUser, setCarmerceUser] = useState();
  const userStore = useStores();

  /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  const handleOnMessage = (msg: any) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    console.log(msg.nativeEvent.data);
    navigation.navigate('PurchaseScreen');
  };

  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = useRef();

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
  console.log(
    'JSONSTRINGFY SEARCH',
    JSON.stringify({
      accessToken: accessToken,
      refreshToken: refreshToken,
      carmerceUser: carmerceUser
    })
  );
  // console.log('accessToken', accessToken);
  // console.log('refreshToken', refreshToken);

  const getToken = async () => {
    const newToken = await getStorage('token');
    setAccessToken(newToken?.accessToken);
    setRefreshToken(newToken?.refreshToken);
  };

  const getCarmerceUser = async () => {
    const newcarmerceUser = await getStorage('carmerceUser');
    setCarmerceUser(newcarmerceUser);
  };

  return (
    <InstantLayout title={'공지사항'}>
      <WebView
        onLoadEnd={handleEndLoading}
        onMessage={handleOnMessage}
        ref={webviewRef}
        onLoadStart={sendMessage}
        sharedCookiesEnabled
        incognito
        source={{
          uri,
          headers: {
            Cookie: JSON.stringify({
              // path: '/search'
              // accessToken: accessToken,
              // refreshToken: refreshToken,
              // carmerceUser: carmerceUser?.id
            })
          }
        }}
      />
    </InstantLayout>
  );
};

export default observer(NotificationScreen);
