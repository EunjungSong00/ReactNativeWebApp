import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchScreen from '../search/SearchScreen';
import HotDealScreen from '../hotdeal/HotDealScreen';
import CartScreen from '../cart/CartScreen';
import LoginScreen from '../login/LoginScreen';
import theme_new from '../../public/theme_new';
import Img from '../../src/component/atom/Img';
import {Platform} from 'react-native';
import {getFocusedRouteNameFromRoute, useIsFocused} from '@react-navigation/native';
import MyPageScreen from '../mypage/MyPageScreen';
import MainScreen from '../main/MainScreen';
import theme from '../../public/theme';
import {useStores} from '../../src/module/store';
import cancelOrderApi from '../../src/api/payment/cancelOrderApi';
import {getStorage, setStorage} from '../../src/module/manageAsyncStorage';

const Tab = createBottomTabNavigator();

const GnbNavigatorScreen = ({navigation, route, initialRouterName}: any) => {
  const [isLogin, setIsLogin] = useState(false);
  const android = Platform.OS === 'android';
  const {paymentStore} = useStores();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const orderId = paymentStore.orderId;
      if (orderId) {
        cancelOrderId(orderId);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = useCallback(async () => {
    const token = await getStorage('token');
    if (!token?.accessToken) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  const cancelOrderId = (orderId: string) => {
    cancelOrderApi({orderId, navigation}).then((res) => {
      console.log('cancelOrderApi', res);
      if (res?.cancelOrder) {
        setStorage('orderId', '');
        paymentStore.setPaymentOrderId('');
      }
    });
  };

  useEffect(() => {}, []);

  const GnbNavigatorDom = useCallback(
    ({initialRouteName}) => {
      return (
        <Tab.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{
            tabBarLabelStyle: {
              fontFamily: theme_new.fontFamily.Regular,
              fontSize: 11,
              paddingBottom: android ? 10 : 0,
              marginTop: 7
            },
            tabBarActiveTintColor: theme.color.primary,
            tabBarIconStyle: {
              marginTop: 10
            },
            tabBarStyle: {
              height: android ? 60 : 87,
              backgroundColor: theme_new.colors.gray['0']
            }
          }}
        >
          <Tab.Screen
            name={'홈'}
            component={MainScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => tabBarIcon.home[focused ? 'on' : 'off']
            }}
          />
          <Tab.Screen
            name={'검색'}
            component={SearchScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => tabBarIcon.search[focused ? 'on' : 'off']
            }}
          />
          <Tab.Screen
            name={'핫딜'}
            component={HotDealScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => tabBarIcon.hotDeal[focused ? 'on' : 'off']
              // tabBarBadgeStyle: ({focused}) =>
              //     focused
              //     ? theme.color.textBlack
              //     : theme.color.primary
              // ,
            }}
          />
          <Tab.Screen
            name={'카트'}
            component={CartScreen}
            listeners={({navigation, route}) => ({
              tabPress: (e) => {
                // Prevent default action
                if (!isLogin) {
                  e.preventDefault();
                  navigation.navigate('LoginScreen');
                }
              }
            })}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => tabBarIcon.cart[focused ? 'on' : 'off']
            }}
          />
          <Tab.Screen
            name={'마이페이지'}
            component={MyPageScreen}
            listeners={({navigation, route}) => ({
              tabPress: (e) => {
                // Prevent default action
                if (!isLogin) {
                  e.preventDefault();
                  navigation.navigate('LoginScreen');
                }
              }
            })}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => tabBarIcon.myPage[focused ? 'on' : 'off']
            }}
          />
        </Tab.Navigator>
      );
    },
    [isLogin]
  );

  return <GnbNavigatorDom initialRouteName={'홈'} />;
};

export default GnbNavigatorScreen;

const tabBarIcon = {
  home: {
    on: <Img src={require(`@public/image/common/gnb/gnb-icon-home-on.png`)} width={26} height={22} />,
    off: <Img src={require(`@public/image/common/gnb/gnb-icon-home-off.png`)} width={26} height={22} />
  },
  search: {
    on: <Img src={require(`@public/image/common/gnb/gnb-icon-search-on.png`)} width={26} height={22} />,
    off: <Img src={require(`@public/image/common/gnb/gnb-icon-search-off.png`)} width={26} height={22} />
  },
  hotDeal: {
    on: <Img src={require(`@public/image/common/gnb/gnb-icon-hotdeal-on.png`)} width={26} height={22} />,
    off: <Img src={require(`@public/image/common/gnb/gnb-icon-hotdeal-off.png`)} width={26} height={22} />
  },
  cart: {
    on: <Img src={require(`@public/image/common/gnb/gnb-icon-cart-on.png`)} width={26} height={22} />,
    off: <Img src={require(`@public/image/common/gnb/gnb-icon-cart-off.png`)} width={26} height={22} />
  },
  myPage: {
    on: <Img src={require(`@public/image/common/gnb/gnb-icon-mypage-on.png`)} width={26} height={22} />,
    off: <Img src={require(`@public/image/common/gnb/gnb-icon-mypage-off.png`)} width={26} height={22} />
  }
};
