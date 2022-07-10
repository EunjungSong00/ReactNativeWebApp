import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IRootStackParamList from '../../src/interface/IRootStackParamList';
import Wrapper from '../../src/component/atom/Wrapper';
import Text from '../../src/component/atom/Text';
import {SafeAreaView} from 'react-native';
import theme from '../../public/theme';
import Img from '../../src/component/atom/Img';
import Txt from '../../src/component/atom/Txt';
import InstantLayout from '../../src/component/template/InstantLayout';
import ButtonNew from '../../src/component/atom/ButtonNew';

type HotDealScreenProps = NativeStackScreenProps<IRootStackParamList, 'HotDeal'>;
const HotDealScreen = ({navigation}: HotDealScreenProps) => {
  return (
    <Wrapper flexNum={1} bgColor={theme.color.white}>
      <InstantLayout title={'핫딜'}>
        <Wrapper flex={1} bgColor={theme.color.white} d pt={20} w h>
          <Wrapper w h>
            <Img src={require('../../public/image/component/icon-exclamation.png')} width={65} height={65} />
            <Txt children={'서비스 준비 중이에요.'} color={theme.color.textGray} size={'sm'} weight={'medium'} mt={20} style={{opacity: 0.48}} />
          </Wrapper>
        </Wrapper>
      </InstantLayout>
    </Wrapper>
  );
};

export default HotDealScreen;
