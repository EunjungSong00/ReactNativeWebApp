import React from 'react';
import {Platform} from 'react-native';
import {Source} from 'react-native-fast-image';
import theme_new from '../../../../../public/theme_new';
import theme from '../../../../../public/theme';
import Img from '../../../atom/Img';

const headerShown = false;
export const isAndroid = Platform.OS === 'android';
export const defaultNavOption: any = {headerShown};
export const tabBarOptions = {
  tabBarLabelStyle: {
    fontFamily: theme_new.fontFamily.Regular,
    fontSize: 11,
    paddingBottom: isAndroid ? 10 : 0,
    marginTop: -2
  },
  tabBarActiveTintColor: theme.color.primary,
  tabBarInactiveTintColor: theme.color.black,
  tabBarStyle: {
    paddingTop: 8,
    height: isAndroid ? 60 : 87,
    backgroundColor: theme_new.colors.gray['0'],
    shadowColor: 'black',
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    paddingLeft: 15,
    paddingRight: 15
  }
};

export const tabBadgeStyle = {
  position: 'absolute',
  left: -9,
  top: isAndroid ? 8 : 12,
  backgroundColor: 'transparent',
  fontSize: 10,
  color: theme.color.text,
  fontFamily: theme.font.medium,
};

const TabBarIcon = ({src}: {src: Source}) => <Img src={src} width={26} height={22} />;

export const tabBarImage = {
  home: {
    on: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-home-on.png`)} />,
    off: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-home-off.png`)} />
  },
  search: {
    on: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-search-on.png`)} />,
    off: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-search-off.png`)} />
  },
  hotDeal: {
    on: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-hotdeal-on.png`)} />,
    off: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-hotdeal-off.png`)} />
  },
  cart: {
    on: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-cart-edit-on.png`)} />,
    off: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-cart-edit-off.png`)} />
  },
  myPage: {
    on: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-mypage-on.png`)} />,
    off: <TabBarIcon src={require(`@public/image/common/gnb/gnb-icon-mypage-off.png`)} />
  }
};
