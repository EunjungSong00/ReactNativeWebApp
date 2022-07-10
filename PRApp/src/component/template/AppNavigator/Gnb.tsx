import React, {useCallback, useEffect, useState} from 'react';
import {getStorage} from '../../../module/manageAsyncStorage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {defaultNavOption, tabBadgeStyle, tabBarImage, tabBarOptions} from './resource';
import screenStack from './resource/screenStack';
import {activateErrorPopup} from '../../../module/formatter';
import {useIsFocused} from '@react-navigation/native';
import cartCountApi from "../../../api/cart/cartCountApi";
import {NavigationStackScreenProps} from "react-navigation-stack";

const GnbContainer = createBottomTabNavigator();

const Gnb = ({navigation}: NavigationStackScreenProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isFocused = useIsFocused();

  const checkToken = useCallback(async () => {
    const token = await getStorage('token');
    if (!token?.accessToken) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
      checkToken();
  }, [isFocused]);

  useEffect(() => {
      if (isLogin) {
          isFocused && getCartCount()
      }
  }, [isFocused, isLogin]);

  const loginTrigger = useCallback(
    ({navigation}: any) => ({
      tabPress: (e: any) => {
        if (!isLogin) {
          e.preventDefault();
          navigation.navigate('LoginScreen');
        }
      }
    }),
    [isLogin, isFocused]
  );

  const getCartCount = useCallback(async () => {
      const query = {navigation};
      await cartCountApi(query)
          .then((response) => {
              const count = response && response.cartCount;
              response && setCartCount(count);
          })
  },[cartCount]);


  return (
    <GnbContainer.Navigator initialRouteName="MainScreen" screenOptions={tabBarOptions} backBehavior="history">
      <GnbContainer.Screen
        name="MainScreen"
        component={screenStack.MainScreen}
        options={{
          ...defaultNavOption,
          tabBarIcon: ({focused}) => tabBarImage.home[focused ? 'on' : 'off'],
          tabBarLabel: '홈'
        }}
      />
      <GnbContainer.Screen
        name="SearchScreen"
        component={screenStack.SearchScreen}
        options={{
          ...defaultNavOption,
          tabBarIcon: ({focused}) => tabBarImage.search[focused ? 'on' : 'off'],
          tabBarLabel: '검색'
        }}
      />
      <GnbContainer.Screen
        name="HotDealScreen"
        component={screenStack.HotDealScreen}
        options={{
          ...defaultNavOption,
          tabBarIcon: ({focused}) => tabBarImage.hotDeal[focused ? 'on' : 'off'],
          tabBarLabel: '핫딜'
        }}
      />
      <GnbContainer.Screen
        name="CartScreen"
        component={screenStack.CartScreen}
        listeners={loginTrigger}
        options={{
          ...defaultNavOption,
          tabBarIcon: ({focused}) => tabBarImage.cart[focused ? 'on' : 'off'],
          tabBarBadge: cartCount,
          tabBarBadgeStyle: tabBadgeStyle,
          tabBarLabel: '카트',
          tabBarStyle: {display: 'none'}
        }}
      />
      <GnbContainer.Screen
        name="MyPageScreen"
        component={screenStack.MyPageScreen}
        listeners={loginTrigger}
        options={{
          ...defaultNavOption,
          tabBarIcon: ({focused}) => tabBarImage.myPage[focused ? 'on' : 'off'],
          tabBarLabel: '마이페이지'
        }}
      />
    </GnbContainer.Navigator>
  );
};

export default Gnb;
