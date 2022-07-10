import React, {useCallback, useEffect, useRef} from 'react';
import BasicLayout from '../../../src/component/template/BasicLayout';
import Button from '../../../src/component/atom/Button';
import {primary} from '../../../public/theme';
import Wrapper from '../../../src/component/atom/Wrapper';
import Input from '../../../src/component/atom/Input';
import useInput from '../../../src/hook/useInput';
import resetCarmerceUserPasswordApi from '../../../src/api/login/resetPassword/resetCarmerceUserPasswordApi';
import Toast from '../../../src/component/atom/Toast';
import {validatePassword, validatePasswordCheck} from '../../../src/module/checkValidity';

const ResetPasswordScreen = ({navigation, route}: any) => {
  const toastRef = useRef<any>(null);
  const pwInput = useInput();
  const pwCheckInput = useInput();
  const accessToken = route?.params?.accessToken;
  const id = route?.params?.id;

  const resetCarmerceUserPassword = async () => {
    const response = await resetCarmerceUserPasswordApi({accessToken, password: pwInput.value});
    console.log('response3', response);
    response && response?.resetCarmerceUserPassword
      ? navigation.navigate('ResetPasswordSuccessScreen')
      : response?.errors[0] && response?.errors[0]?.message && toastRef.current.show(response.errors[0].message);
  };

  useEffect(() => {
    toastRef.current.show('인증이 완료되었어요.');
  }, []);

  return (
    <>
      <BasicLayout title="비밀번호 재설정" keyboardView>
        <Wrapper flex={1}>
          <Input
            // TODO: onlyPassword
            placeholder="신규 비밀번호 입력"
            type={validatePassword(pwInput.value, id) && 'error'}
            hook={pwInput}
            secure
            validationMessage={validatePassword(pwInput.value, id) || (pwInput.value && 'O 영문/숫자/특수문자 2가지 이상 조합(8~16자)')}
          />
          <Input
            // TODO: onlyPassword
            type={validatePasswordCheck(pwCheckInput.value, pwInput.value) && 'error'}
            placeholder="신규 비밀번호 재입력"
            hook={pwCheckInput}
            mt={14}
            secure
            validationMessage={validatePasswordCheck(pwCheckInput.value, pwInput.value) || (pwCheckInput.value && 'O 입력하신 번호가 일치해요.')}
          />
          <Button
            children="확인"
            onPress={resetCarmerceUserPassword}
            disabled={!(!!pwInput.value && !!pwCheckInput.value && !validatePassword(pwInput.value, id) && !validatePasswordCheck(pwCheckInput.value, pwInput.value))}
            whcbr={['100%', 56, primary]}
            mt={14}
            mb={9}
            fontWeight="bold"
            fontSize={18}
          />
        </Wrapper>
      </BasicLayout>
      <Toast ref={toastRef} />
    </>
  );
};

export default ResetPasswordScreen;
