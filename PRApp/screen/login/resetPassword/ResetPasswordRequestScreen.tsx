import React, {useCallback, useEffect, useRef, useState} from 'react';
import BasicLayout from '../../../src/component/template/BasicLayout';
import Button from '../../../src/component/atom/Button';
import {primary, whiteBlue} from '../../../public/theme';
import Wrapper from '../../../src/component/atom/Wrapper';
import Input from '../../../src/component/atom/Input';
import useInput from '../../../src/hook/useInput';
import sendMailForResetCarmerceUserPasswordApi from '../../../src/api/login/resetPassword/sendMailForResetCarmerceUserPasswordApi';
import Toast from '../../../src/component/atom/Toast';
import {validateEmail} from '../../../src/module/checkValidity';
import {onlyKorean} from '../../../src/module/formatter';

const ResetPasswordRequestScreen = ({navigation}: any) => {
  const nameInput = useInput();
  const emailInput = useInput();
  const toastRef = useRef<any>(null);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const navigateToPWCode = useCallback(() => {
    navigation.navigate('ResetPasswordCodeScreen', {name: nameInput.value, email: emailInput.value});
  }, [nameInput.value, emailInput.value]);

  const sendMailForResetCarmerceUserPassword = async () => {
    const response = await sendMailForResetCarmerceUserPasswordApi({name: nameInput.value, email: emailInput.value});
    console.log('response2', response);
    response.sendMailForResetCarmerceUserPassword ? navigateToPWCode() : response.errors[0].message && toastRef.current.show(response.errors[0].message);
    response.errors[0].message.includes('아직 가입되지 않은') && setEmailError(true);
  };

  const onBlurName = () => {
    if (!nameInput.value) {
      toastRef.current.show('이름을 입력해주세요.');
      setNameError(true);
    }
  };

  const onBlurEmail = () => {
    if (!emailInput.value) {
      toastRef.current.show('이메일을 입력해주세요.');
      setEmailError(true);
    } else if (validateEmail(emailInput.value)) {
      toastRef.current.show('이메일 형식을 확인해주세요.');
      setEmailError(true);
    }
  };

  return (
    <>
      <BasicLayout title="비밀번호 찾기" keyboardView>
        <Wrapper flex={1}>
          <Input placeholder="이름" korean maxLength={6} hook={nameInput} onBlur={onBlurName} error={[nameError, setNameError]} />
          <Input placeholder="이메일" onlyEmail maxLength={320} email hook={emailInput} mt={14} onBlur={onBlurEmail} error={[emailError, setEmailError]} />
          <Wrapper mt="auto" mb={0}>
            {/* <Button children="휴대폰으로 받기" onPress={navigateToPWCode} whcbr={['100%', 56, primary]} fontWeight="bold" fontSize={18} /> */}
            <Button
              children="이메일로 받기"
              disabled={!(nameInput.value && emailInput.value && !validateEmail(emailInput.value))}
              onPress={sendMailForResetCarmerceUserPassword}
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

export default ResetPasswordRequestScreen;
