import React, {useCallback, useEffect, useRef, useState} from 'react';
import BasicLayout from '../../../src/component/template/BasicLayout';
import Button from '../../../src/component/atom/Button';
import theme, {primary, whiteBlue} from '../../../public/theme';
import Wrapper from '../../../src/component/atom/Wrapper';
import Input from '../../../src/component/atom/Input';
import useInput from '../../../src/hook/useInput';
import Text from '../../../src/component/atom/Text';
import sendMailForResetCarmerceUserPasswordApi from '../../../src/api/login/resetPassword/sendMailForResetCarmerceUserPasswordApi';
import verifyCarmerceUserPasswordOtpApi from '../../../src/api/login/resetPassword/verifyCarmerceUserPasswordOtpApi';
import useTimer from '../../../src/hook/useTimer';
import Toast from '../../../src/component/atom/Toast';

const ResetPasswordCodeScreen = ({navigation, route}: any) => {
  const timer = useTimer({minute: 3, second: 0});
  const toastRef = useRef<any>(null);
  const name = route?.params?.name;
  const email = route?.params?.email;
  const authCodeInput = useInput();
  const [codeError, setCodeError] = useState(false);

  const sendMailForResetCarmerceUserPassword = async () => {
    const response = await sendMailForResetCarmerceUserPasswordApi({name, email});
    // console.log('response2', response);
    response && response?.sendMailForResetCarmerceUserPassword ? timer.reset() : response && response?.errors[0] && toastRef.current.show(response?.errors[0]?.message);
    response && response?.sendMailForResetCarmerceUserPassword && toastRef.current.show('이메일로 인증코드가 발송되었어요.');
  };

  useEffect(() => {
    !timer.minutes && !timer.seconds && setCodeError(true);
  }, [timer.seconds]);

  const verifyCarmerceUserPasswordOtp = async () => {
    const response = await verifyCarmerceUserPasswordOtpApi({authCode: authCodeInput.value, email});
    // console.log('response3', response);
    response && response?.verifyCaremerceUserPasswordOtp
      ? navigation.navigate('ResetPasswordScreen', {accessToken: response?.verifyCaremerceUserPasswordOtp.accessToken, id: email.split('@')[0]})
      : response && response?.errors[0] && toastRef.current.show(response?.errors[0]?.message);
    response && response?.errors[0] && setCodeError(true);
  };

  useEffect(() => {
    toastRef.current.show('이메일로 인증코드가 발송되었어요.');
  }, []);

  const onBlurCode = () => {
    if (authCodeInput.value.length < 4) {
      toastRef.current.show('인증코드 4자리를 모두 입력해주세요.');
      setCodeError(true);
    }
  };

  return (
    <>
      <BasicLayout title="비밀번호 찾기" keyboardView>
        <Wrapper flex={1}>
          <Input
            placeholder="인증코드"
            numberString
            hook={authCodeInput}
            maxLength={4}
            inputStyle={{fontFamily: theme.font.bold, letterSpacing: 4}}
            innerMessage={{
              message: timer.minutes || timer.seconds ? `${timer.minutes} : ${timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}` : '인증시간 초과',
              color: timer.minutes || timer.seconds ? undefined : '#fe2828'
            }}
            onBlur={onBlurCode}
            error={[codeError, setCodeError]}
          />
          <Text mt={9} size={'13px'}>
            ※ 이메일로 발송하신 경우, 스팸함도 꼭 확인해주세요!
          </Text>
          <Wrapper mt="auto" mb={0}>
            <Button children="재발송" onPress={sendMailForResetCarmerceUserPassword} whcbr={['100%', 56, whiteBlue]} mt={14} fontWeight="bold" fontSize={18} />
            <Button
              children="확인"
              onPress={verifyCarmerceUserPasswordOtp}
              disabled={!timer.minutes && !timer.seconds}
              whcbr={['100%', 56, primary]}
              mt={14}
              mb={9}
              fontWeight="bold"
              fontSize={18}
            />
          </Wrapper>
        </Wrapper>
      </BasicLayout>
      <Toast ref={toastRef} />
    </>
  );
};

export default ResetPasswordCodeScreen;
