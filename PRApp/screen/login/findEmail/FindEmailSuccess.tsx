import React, {useCallback} from 'react';
import theme, {primary, whiteBlue} from '../../../public/theme';
import Button from '../../../src/component/atom/Button';
import Text from '../../../src/component/atom/Text';
import Wrapper from '../../../src/component/atom/Wrapper';

const FindEmailSuccess = ({navigation, email}: any) => {
  const goLogin = useCallback(() => {
    navigation.navigate('LoginScreen');
  }, []);

  const goResetPassword = useCallback(() => {
    navigation.navigate('ResetPasswordRequestScreen');
  }, []);

  return (
    <>
        <Text mt={9} color={theme.color.primary} weight="bold" size={'20px'}>
          {email}
        </Text>
        <Wrapper mb={15} mt="auto">
          <Button whcbr={['100%', 60, whiteBlue]} onPress={goResetPassword} fontWeight="bold" fontSize={20} children="비밀번호 찾기" />
          <Button whcbr={['100%', 60, primary]} onPress={goLogin} mt={15} fontWeight="bold" fontSize={20} children="로그인" />
        </Wrapper>
    </>
  );
};

export default FindEmailSuccess;
