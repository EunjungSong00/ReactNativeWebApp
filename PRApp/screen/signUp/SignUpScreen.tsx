import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useIsFocused } from '@react-navigation/native';
import {useStores} from "../../src/module/store";
import locales from "../../public/locales";
import {validateEmail} from "../../src/module/checkValidity";
import signUpCarmerceUserApi from "../../src/api/login/signUpCarmerceUserApi";
import checkDuplicateCarmerceUserEmailApi from "../../src/api/login/checkDuplicateCarmerceUserEmailApi";
import BasicLayout from "../../src/component/template/BasicLayout";
import Input from "../../src/component/atom/Input";
import useInput from "../../src/hook/useInput";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Wrapper from "../../src/component/atom/Wrapper";
import Toast from "../../src/component/atom/Toast";
import Txt from "../../src/component/atom/Txt";

interface IValidationMessageDom {
    value: boolean;
    text: string;
}

const SignUpScreen = ({navigation, route}: any) => {
    const email = useInput();
    const password = useInput();
    const [passwordValidation, setPasswordValidation] = useState(false);
    const passwordConfirm = useInput();
    const [passwordConfirmValidation, setPasswordConfirmValidation] = useState(false);
    const [encodeData, setEncodeData] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [passwordCheck1, setPasswordCheck1] = useState(false);
    const [passwordCheck2, setPasswordCheck2] = useState(false);
    const [passwordCheck3, setPasswordCheck3] = useState(false);
    const [passwordConfirmCheck, setPasswordConfirmCheck] = useState(false);
    const [duplicateCheck, setDuplicateCheck] = useState(false);
    const errorEmail = useState(true);
    const errorPassword = useState(true);
    const errorPasswordConfirm = useState(true);
    const toastRef = useRef<any>(null);
    const {niceStore} = useStores();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (niceStore.encodeData) {
            //console.log('SignUpScreen', route?.params.encodeData);
            setEncodeData(niceStore.encodeData);
            niceStore.setNiceEncodeData('');
        }
    }, [isFocused]);

    useEffect(() => {
        // PASS 인증 버튼 활성화 설정
        const emailValue = !!(email.value);
        const passwordValue = !!(password.value);
        const passwordConfirmValue = !!(passwordConfirm.value);
        const emailValidation = !validateEmail(email.value);
        if (emailValue && duplicateCheck && passwordValue && passwordConfirmValue && emailValidation && passwordCheck1 && passwordCheck2 && passwordCheck3 && passwordConfirmCheck) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [email, password, passwordConfirm, duplicateCheck]);

    useEffect(() => {
        // 이메일 입력시 체크
        if (password?.value) {
            passwordOnBlur();
        }
    }, [email]);

    useEffect(() => {
        // 비밀번호 입력시 체크
        checkValidationPw();
        if (passwordConfirm.value) {
            passwordConfirmOnBlur();
        }
    }, [password]);

    useEffect(() => {
        // 비밀번호 확인 입력시 체크
        checkValidationPwConfirm();
    }, [passwordConfirm]);

    const clickSubmit = useCallback(() => {
        const emailValue = email.value;
        const passwordValue = password.value;
        // console.log('clickSubmit', emailValue, passwordValue, encodeData)
        if (emailValue && passwordValue && encodeData) {
            checkDuplicateCarmerceUserEmailApi(emailValue)
                .then((res) => {
                    if (res?.checkDuplicateCarmerceUserEmail.isDuplicate) {
                        setDuplicateCheck(false);
                        errorEmail[1](true);
                        toastShow('이미 가입된 이메일이에요.');
                    } else {
                        setDuplicateCheck(true);
                        signUpCarmerceUserApi(emailValue, passwordValue, encodeData)
                            .then((res) => {
                                //console.log('res', res)
                                toastShow('가입이 완료되었어요.\n로그인 후에 이용해주세요.');
                                setTimeout(() => {
                                    navigation.replace('LoginScreen');
                                }, 2500)
                            })
                            .catch((err) => {
                                console.log('err', err.response.errors[0].message)
                                const errorMessage = err?.response?.errors[0]?.message;
                                toastRef.current.show(errorMessage);
                            })
                    }
                })
                .catch((err) => {

                })
        }
    }, [email, password, encodeData]);

    const toastShow = useCallback((value: string) => {
        toastRef.current.show(value);
    }, []);

    const emailOnBlur = useCallback(() => {
        // 이메일 인풋 out
        const emailValidation = !validateEmail(email.value);
        if (email.value === '') {
            errorEmail[1](true);
            toastShow('이메일을 입력해주세요.');
        } else if (!emailValidation) {
            errorEmail[1](true);
            toastShow('이메일을 형식을 확인해주세요.');
        } else {
            clickDuplicateEmail();
        }
    }, [email]);

    const clickDuplicateEmail = useCallback(() => {
        const emailValue = email.value;
        if (!validateEmail(emailValue)) {
            checkDuplicateCarmerceUserEmailApi(emailValue)
                .then((res) => {
                    if (res?.checkDuplicateCarmerceUserEmail.isDuplicate) {
                        setDuplicateCheck(false);
                        errorEmail[1](true);
                        toastShow('이미 가입된 이메일이에요.');
                    } else {
                        setDuplicateCheck(true);
                        toastShow('사용 가능한 이메일이에요.');
                    }
                })
                .catch((err) => {

                })
        }
    }, [email]);

    const passwordOnFocus = useCallback(() => {
        // 비밀번호 인풋 in
        if (password) {
            // 비밀번호에 문자 있을때
            passwordOnBlur();
        }
    }, [password]);

    const passwordOnBlur = useCallback(() => {
        // 비밀번호 인풋 out
        const value = checkValidationPw();
        if (!value[0] || !value[1] || !value[2]) {
            // 형식 불일치
            errorPassword[1](true); // 인풋 에러 스타일 설정
            setPasswordValidation(false); // 메세지 보여주기
        } else {
            // 형식 일치
            errorPassword[1](false); // 인풋 에러 스타일 풀기
            setPasswordValidation(true); // 메세지 안보여주기
        }
    }, [email, password]);

    const passwordConfirmOnFocus = useCallback(() => {
        // 비밀번호 확인 인풋 in
        if (passwordConfirm) {
            // 비밀번호 확인에 문자 있을때
            passwordConfirmOnBlur();
        }
    }, [passwordConfirm]);

    const passwordConfirmOnBlur = useCallback(() => {
        // 비밀번호 확인 인풋 out
        const value = checkValidationPwConfirm();
        if (!value){
            // 형식 불일치
            errorPasswordConfirm[1](true); // 인풋 에러 스타일 설정
            setPasswordConfirmValidation(false); // 메세지 보여주기
        } else {
            errorPasswordConfirm[1](false); // 인풋 에러 스타일 풀기
            setPasswordConfirmValidation(true); // 메세지 안보여주기
        }
    }, [password, passwordConfirm]);

    const checkValidationPw = useCallback(() => {
        // 비밀번호 조건 체크
        const pw = (password.value).trim();
        const num = pw.search(/[0-9]/g); // 숫자 있는지
        const eng = pw.search(/[a-z]/ig); // 영문 있는지
        const spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi); // 특수문자 있는지
        const idValue = email.value.split('@')[0]; // 이메일주소 앞 아이디 값
        // 숫자/영문/특수문자 중 2가지 이상이 있고, 8자 이상일때
        const check1 = ((num > -1 && eng > -1) || (eng > -1 && spe > -1) || (spe > -1 && num > -1)) && pw.length > 7;
        // 아이디값이 없을때
        const check2 = pw.search(idValue) === -1;
        // 같은 문자 3번 이상 입력 문자 없을때
        const check3 = !(/(\w)\1\1/.test(pw));
        check1 ? setPasswordCheck1(true) : setPasswordCheck1(false);
        check2 ? setPasswordCheck2(true) : setPasswordCheck2(false);
        check3 ? setPasswordCheck3(true) : setPasswordCheck3(false);
        return [check1, check2, check3];
    }, [email, password]);

    const checkValidationPwConfirm = useCallback(() => {
        // 비밀번호 확인 조건 체크
        const pw = (password.value).trim();
        const pwConfirm = (passwordConfirm.value).trim();
        // 비밀번호 === 비밀번호 입력
        const check = pw === pwConfirm;
        check ? setPasswordConfirmCheck(true) : setPasswordConfirmCheck(false);
        return check;
    }, [password, passwordConfirm])


    const ValidationMessageDom = ({value, text}: IValidationMessageDom) => (
        <Wrapper flexDirection={'row'} mb={1}>
            <Txt size={'xs'} color={!value ? 'red' : 'primary'}>{!value ? 'X' : 'O'} </Txt>
            <Txt size={'xs'} color={!value ? 'red' : 'primary'}>{text}</Txt>
        </Wrapper>
    )

  return (
      <>
          <BasicLayout onPress={() => navigation.reset({routes: [{name: 'LoginScreen'}]})}>
              <Wrapper flexNum={1} between>
                  <Wrapper>
                      <Input placeholder="이메일" email hook={email} maxLength={320} borderRadius={10} error={errorEmail} onBlur={emailOnBlur} />
                      <Input placeholder="비밀번호" hook={password} maxLength={20} borderRadius={10} secure={true} mt={14} error={errorPassword} onFocus={passwordOnFocus} onBlur={passwordOnBlur} />
                      {
                          password.value ?
                              <Wrapper mt={10}>
                                  <ValidationMessageDom value={passwordCheck1} text={'영문/숫자/특수문자 2가지 이상 조합(8자~16자)'} />
                                  <ValidationMessageDom value={passwordCheck2} text={'이메일 주소의 아이디와 중복 불가'} />
                                  <ValidationMessageDom value={passwordCheck3} text={'연속된/동일한 문자열 3번 이상 반복 불가'} />
                              </Wrapper>
                              :
                              <></>
                      }
                      <Input placeholder="비밀번호 확인" hook={passwordConfirm} maxLength={20} borderRadius={10} secure={true} mt={14} onFocus={passwordConfirmOnFocus} error={errorPasswordConfirm} onBlur={passwordConfirmOnBlur} />
                      {
                          passwordConfirm.value ?
                              <Wrapper mt={10}>
                                <ValidationMessageDom value={passwordConfirmCheck} text={!passwordConfirmCheck? '입력하신 비밀번호가 서로 달라요.' : '입력하신 비밀번호가 일치해요.'} />
                              </Wrapper>
                              :
                              <></>
                      }
                  </Wrapper>
                  <Wrapper mb={20} mt={20}>
                      <ButtonNew title={locales.btn.ok} type={'primary'} onPress={clickSubmit} disabled={submitDisabled} />
                  </Wrapper>
              </Wrapper>
          </BasicLayout>
          <Toast ref={toastRef} />
      </>
  );
};


export default SignUpScreen;
