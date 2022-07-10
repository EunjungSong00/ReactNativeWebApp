import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, Pressable, Text, TextInput, View} from 'react-native';
import styled from '@emotion/native';
import theme_new from '../../public/theme_new';
import Wrapper from '../../src/component/atom/Wrapper';
import Img from '../../src/component/atom/Img';
import DismissKeyboardView from '../../src/component/atom/DismissKeyBoardView';
import useInput from '../../src/hook/useInput';
import ButtonNew from '../../src/component/atom/ButtonNew';
import Input from '../../src/component/atom/Input';
import {validateEmail} from '../../src/module/checkValidity';
import locales from '../../public/locales';
import signInCarmerceUserApi from '../../src/api/login/signInCarmerceUserApi';
import Toast from '../../src/component/atom/Toast';
import {setStorage} from '../../src/module/manageAsyncStorage';
import {useStores} from '../../src/module/store';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import updateCarmerceUserAppTokenApi from '../../src/api/login/updateCarmerceUserAppTokenApi';
import {NavigationRoute} from 'react-navigation';
import InstantLayout from "../../src/component/template/InstantLayout";

export enum OsType {
  None,
  ANDROID,
  IOS
}
export interface INavigationRoute {
  navigation: NavigationStackScreenProps;
  route?: NavigationRoute;
}
const LoginScreen = ({navigation, route}: INavigationRoute) => {
  const email = useInput();
  const password = useInput();
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const error = useState(false);
  const errorPassword = useState(false);
  const toastRef = useRef<any>(null);
  const [disabledButton, setDisabledButton] = useState(true);
  const {userInfoStore} = useStores();
  const [appToken, setAppToken] = useState();
  const [osType, setOsType] = useState<OsType>(OsType.None);
  const id = route?.params?.id;

  // 이메일 유효성
  //const emailValidationCheck = validateEmail(email.value);
  // 패스워드 유효성
  const passwordValidationCheck = !!password.value;

  useEffect(() => {
    const emailValidationCheck = validateEmail(email.value);
    console.log('emailValidationCheck', emailValidationCheck)
    if (email.value && !emailValidationCheck && password.value.length >= 8) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }

  }, [email, password]);

  // 이메일 값 체크
  const checkValidEmail = useCallback(async () => {
    if (!email.value) {
      toastRef.current.show(locales.Login.errorMessage.email['1']);
      error[1](true);
    } else if (validateEmail(email.value)) {
      toastRef.current.show(locales.Login.errorMessage.email['2']);
      error[1](true);
    }
  }, [email.value]);

  // OsType 알아내기
  useEffect(() => {
    Platform.OS === 'android' ? setOsType(OsType.ANDROID) : setOsType(OsType.IOS);
  }, [osType]);

  // 패스워드 값 체크
  const checkPasswordValid = useCallback(() => {
    if (!passwordValidationCheck) {
      toastRef.current.show(locales.Login.errorMessage.password['1']);
      errorPassword[1](true);
    } else if (password.value.length < 8) {
      toastRef.current.show(locales.Login.errorMessage.password['2']);
      errorPassword[1](true);
    }
  }, [password.value]);

  // 로그인 버튼 클릭시
  const onSubmitSignIn = useCallback(async () => {
    //FIXME: 앱푸시 토큰 넣기(DONE)
    // const phoneToken1 = await getStorage('appToken');

    const phoneToken = userInfoStore?.carmercePhoneToken || '';
    // console.log('phoneToken1', phoneToken1);
    // console.log('phoneToken', phoneToken);
    if (email.value && !validateEmail(email.value) && password.value.length >= 8) {
      await signInCarmerceUserApi(email.value, password.value, phoneToken, osType)
        .then((res) => {
          const token = {
            accessToken: res?.signInCarmerceUser?.accessToken,
            refreshToken: res?.signInCarmerceUser?.refreshToken
          };
          const carmerceUser = {
            birthDate: res?.signInCarmerceUser?.carmerceUser?.birthDate,
            id: res?.signInCarmerceUser?.carmerceUser?.id,
            email: res?.signInCarmerceUser?.carmerceUser?.email,
            name: res?.signInCarmerceUser?.carmerceUser?.name,
            phoneNumber: res?.signInCarmerceUser?.carmerceUser?.phoneNumber,
            appToken: res?.signInCarmerceUser?.carmerceUser?.appToken
          };
          setStorage('token', token);
          setStorage('carmerceUser', carmerceUser);
          console.log('token', token);
          // TODO: 스토어 저장 (완료) -> 필요한 곳에서만 사용 할 수 있도록 (각자 알아서)
          userInfoStore.setUserToken(token);
          userInfoStore.setCarmerceUser(carmerceUser);
          if (id) {
            navigation.navigate('SearchDetailScreen', {id: id});
          } else {
            navigation.replace('Gnb', navigation);
          }
          updateCarmerceUserAppToken(token?.accessToken, carmerceUser?.appToken);
        })
        .catch((error) => {
          const errorMessage = error?.response?.errors[0]?.message;
          toastRef.current.show(errorMessage);
        });
    }
  }, [email, password]);

  // 자동 로그인
  const updateCarmerceUserAppToken = useCallback(async (accessToken: string, appPushToken: string) => {
    await updateCarmerceUserAppTokenApi(accessToken, appPushToken, navigation).then((response) => console.log('response', response));
  }, []);

  const onPressFind = useCallback(
      (type) => {
        switch (type) {
          case 'email':
            navigation.navigate('FindEmailScreen');
            break;
          case 'password':
            navigation.navigate('ResetPasswordRequestScreen');
            break;
          case 'signup':
            navigation.navigate('PermissionScreen');
            break;
        }
      },
      []
  );

  return (
      <>
        <InstantLayout title={''} nonBorder>
          <Wrapper style={{flex: 1, justifyContent: 'center', position: 'relative', backgroundColor: '#fff'}}>
            <DismissKeyboardView>
              <Wrapper paddingX={25} paddingTop={25}>
                <Wrapper justifyContent={'flex-end'} paddingBottom={31}>
                  <Img src={require('../../public/image/login/login-title.png')} width={222} height={70} />
                </Wrapper>
                <Wrapper>
                  <Input
                    hook={email}
                    email
                    placeholder={'이메일'}
                    ref={emailRef}
                    returnKeyType="next"
                    multiline={false}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    maxLength={320}
                    onBlur={checkValidEmail}
                    error={error}
                    onlyEmail
                  />
                  <Input
                    hook={password}
                    placeholder={'비밀번호'}
                    ref={passwordRef}
                    returnKeyType="send"
                    maxLength={15}
                    error={errorPassword}
                    onSubmitEditing={onSubmitSignIn}
                    onBlur={checkPasswordValid}
                    secure={true}
                    mt={15}
                  />
                  <ButtonNew title={locales.Login.title} onPress={onSubmitSignIn} mt={15} disabled={disabledButton} />
                </Wrapper>
                <Wrapper row between mt={15}>
                  <FindBtnBox>
                    <FindBtn onPress={() => onPressFind('email')}>
                      <FindTxt>이메일 찾기</FindTxt>
                    </FindBtn>
                  </FindBtnBox>
                  <Line />
                  <FindBtnBox>
                    <FindBtn onPress={() => onPressFind('password')}>
                      <FindTxt>비밀번호 찾기</FindTxt>
                    </FindBtn>
                  </FindBtnBox>
                  <Line />
                  <FindBtnBox>
                    <FindBtn onPress={() => onPressFind('signup')}>
                      <FindTxt>회원가입</FindTxt>
                    </FindBtn>
                  </FindBtnBox>
                </Wrapper>
                {/* SNSLogin */}
                <Wrapper w row justifyContent={'flex-end'} paddingX={30} paddingTop={107}>
                  {/* TODO: SNS 로그인 2차 개발시에 작업 (은정) */}
                  {/*<SNSLogin />*/}
                </Wrapper>
              </Wrapper>
            </DismissKeyboardView>
          </Wrapper>
        </InstantLayout>
        <Toast ref={toastRef} />
      </>
  );
};

export default LoginScreen;

const FindBtnBox = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Line = styled(View)`
  width: 1px;
  height: 13px;
  background-color: #ccc;
`;

const FindBtn = styled(Pressable)`
  //justify-content: center;
  //align-items: center;
`;

const FindTxt = styled(Text)`
  font-family: ${theme_new.fontFamily.Regular};
  font-size: ${theme_new.fontSize.xs};
  color: ${theme_new.colors.gray['60']};
`;
