import React, {ReactElement} from 'react';
import Layout from './Layout';
import Wrapper from '../atom/Wrapper';
import Text from '../atom/Text';
import {Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Txt from '../atom/Txt';

interface IInstantLayout {
  title: string;
  children: ReactElement;
  keyboardView?: any;
  back?: boolean;
  nonBorder?: boolean;
  home?: boolean;
  search?: boolean;
  close?: boolean;
  cart?: boolean;
}
const InstantLayout = ({title, children, keyboardView, back, home, search, close, cart, nonBorder}: IInstantLayout): ReactElement => {
  const navigation = useNavigation<any>();

  return (
    <Layout keyboardView={keyboardView}>
      <>
        <Wrapper row w h bgColor="#fff" width={'100%'} height={50} borderBottomWidth={nonBorder ? 0 : 0.5} borderColor={'#cccccc'}>
          {!back ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{position: 'absolute', left: 20}}>
              <Image source={require('../../../public/image/component/icon-back.png')} />
            </TouchableOpacity>
          ) : null}
          {home ? (
            <TouchableOpacity onPress={() => navigation.replace('Gnb')} style={{position: 'absolute', left: 46}}>
              <Image source={require('../../../public/image/common/gnb/gnb-icon-home-off.png')} />
            </TouchableOpacity>
          ) : null}
          <Txt size={'md'} weight={'bold'}>
            {title}
          </Txt>
          {search ? (
            <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')} style={{position: 'absolute', right: 20}}>
              <Image source={require('../../../public/image/common/gnb/gnb-icon-search-off.png')} />
            </TouchableOpacity>
          ) : null}
          {close ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{position: 'absolute', right: 20}}>
              <Image source={require('../../../public/image/common/icon-close.png')} />
            </TouchableOpacity>
          ) : null}
          {cart ? (
            <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={{position: 'absolute', right: 20}}>
              <Image source={require('../../../public/image/common/icon-cart.png')} />
            </TouchableOpacity>
          ) : null}
        </Wrapper>
        <Wrapper flex={1} bgColor="#f1f2f4" width={'100%'} height={50}>
          {children}
        </Wrapper>
      </>
    </Layout>
  );
};

export default InstantLayout;
