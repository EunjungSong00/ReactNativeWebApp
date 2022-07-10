import React, {useCallback, useRef, useState} from 'react';
import BasicLayout from '../../../src/component/template/BasicLayout';
import Button from '../../../src/component/atom/Button';
import {primary, whiteBlue} from '../../../public/theme';
import Wrapper from '../../../src/component/atom/Wrapper';
import Text from '../../../src/component/atom/Text';
import Img from '../../../src/component/atom/Img';

const ResetPasswordRequestScreen = ({navigation}: any) => {
  const navigateToLogin = useCallback(() => navigation.navigate('LoginScreen'), []);

  return (
    <BasicLayout title="비밀번호 재설정" keyboardView>
      <Wrapper flex={1}>
        <Wrapper w h flex={1}>
          <Text size={'21px'}>회원님의 비밀번호 재설정이</Text>
          <Text size={'21px'} mt={9}>
            완료되었습니다.
          </Text>
          <Wrapper mt={30}>
            <Img src={require('../../../public/image/login/icon-thumbup.png')} />
          </Wrapper>
        </Wrapper>
        <Wrapper width={'100%'} mt={'auto'} mb={9}>
          <Button children="로그인하기" onPress={navigateToLogin} whcbr={['100%', 56, primary]} fontWeight="bold" fontSize={18} />
        </Wrapper>
      </Wrapper>
    </BasicLayout>
  );
};

export default ResetPasswordRequestScreen;
