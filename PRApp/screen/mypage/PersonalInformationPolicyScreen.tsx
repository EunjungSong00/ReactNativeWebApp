import React, {useCallback, useEffect} from 'react';
import Wrapper from '../../src/component/atom/Wrapper';
import Text from '../../src/component/atom/Text';
import InstantLayout from '../../src/component/template/InstantLayout';
import Input from '../../src/component/atom/Input';
import useInput from '../../src/hook/useInput';
import Button from '../../src/component/atom/Button';
import {validatePassword, validatePasswordCheck} from '../../src/module/checkValidity';
import {getPhoneNumberForm} from '../../src/module/formatter';
import changeCarmerceUserPasswordApi from '../../src/api/mypage/changeCarmerceUserPasswordApi';
import usePopup from '../../src/hook/usePopup';
import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import {NavigationRoute} from 'react-navigation';
import ScrollViewBetween from '../../src/component/template/ScrollViewBetween';
import Img from '../../src/component/atom/Img';
import Txt from '../../src/component/atom/Txt';
import theme from '../../public/theme';

const PersonalInformationPolicyScreen = ({navigation, route}: {navigation: StackNavigationProp; route: NavigationRoute}) => {
  return (
    <Wrapper flexNum={1} bgColor={theme.color.white}>
      <InstantLayout title={'개인정보처리방침'}>
        <Wrapper flex={1} bgColor={theme.color.white} d pt={20} w h>
          <Wrapper w h>
            <Img src={require('../../public/image/component/icon-exclamation.png')} width={65} height={65} />
            <Txt children={'개인정보처리방침이 곧 준비돼요.'} color={theme.color.textGray} size={'sm'} weight={'medium'} mt={20} style={{opacity: 0.48}} />
          </Wrapper>
        </Wrapper>
      </InstantLayout>
    </Wrapper>
  );
};

export default PersonalInformationPolicyScreen;
