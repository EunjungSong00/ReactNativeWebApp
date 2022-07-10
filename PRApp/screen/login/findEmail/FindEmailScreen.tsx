import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import findCarmerceUserEmailApi from '../../../src/api/login/findCarmerceUserEmailApi';
import {useStores} from '../../../src/module/store';
import {whiteBlue} from '../../../public/theme';
import BasicLayout from '../../../src/component/template/BasicLayout';
import Button from '../../../src/component/atom/Button';
import Toast from '../../../src/component/atom/Toast';
import FindEmailSuccess from 'FindEmailSuccess';

const FindEmailScreen = ({navigation, route}: any) => {
  const [email, setEmail] = useState();
  const toastRef = useRef<any>(null);
  const {niceStore} = useStores();
  const isFocused = useIsFocused();

  useEffect(() => {
    const encodeData = niceStore.encodeData;
    if (encodeData) {
      findCarmerceUserEmailApi(encodeData)
        .then((res) => {
          console.log('findEmailApires', res);
          const emailValue = res?.findCarmerceUserEmail?.email;
          if (emailValue) {
            setEmail(emailValue);
          } else {
            toastRef.current.show('해당 정보로 가입된 계정이 없어요.');
          }
        })
        .catch((err) => {
          console.log('findEmailApierr', err);
          toastRef.current.show('본인인증에 실패했어요.');
        });
      niceStore.setNiceEncodeData('');
    }
  }, [isFocused]);

  const goNicePass = useCallback(() => {
    navigation.navigate('Nice', {title: 'FindEmailScreen'});
  }, []);

  return (
    <>
      <BasicLayout title="이메일 찾기">
        {email ? (
          <FindEmailSuccess navigation={navigation} email={email} />
        ) : (
          <Button whcbr={['100%', 56, whiteBlue]} onPress={goNicePass} mt={9} fontWeight="bold" fontSize={18} children="PASS 인증" />
        )}
      </BasicLayout>
      <Toast ref={toastRef} />
    </>
  );
};

export default FindEmailScreen;
