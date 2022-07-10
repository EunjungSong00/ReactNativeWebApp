import React, {useCallback} from 'react';
import {ScrollView} from 'react-native';
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

/*회원정보 수정*/
const EditProfileScreen = ({navigation, route}: {navigation: StackNavigationProp; route: NavigationRoute}) => {
  const originalPW = useInput();
  const newPW = useInput();
  const newPWCheck = useInput();
  const name = route?.params?.name;
  const email = route?.params?.email;
  const phoneNumber = getPhoneNumberForm(route?.params?.phoneNumber);
  const id = route?.params?.id;
  const successPopup = usePopup();

  const changeCarmerceUserPassword = useCallback(async (originPW: string, newPW: string) => {
    const response = await changeCarmerceUserPasswordApi({currentPassword: originPW, newPassword: newPW}, navigation);
    response?.changeCarmerceUserPassword &&
      successPopup.setPopupContents({title: '수정 완료', text: '비밀번호가 변경되었습니다.', clickConfirm: () => navigation.navigate('GnbNavigatorScreen')});
  }, []);

  return (
    <Wrapper flex={1} backgroundColor={'white'}>
      <InstantLayout title={'회원정보 관리'} keyboardView>
        <>
          <ScrollViewBetween>
            <>
              <Wrapper flex={1} backgroundColor={'white'} size={'100%'} padding={25}>
                <Wrapper>
                  <Text weight="bold" size={'15px'} color="#333333">
                    기본정보
                  </Text>
                  <Information label={'고객명'} value={name} />
                  <Information label={'이메일'} value={email} />
                  <Information label={'연락처'} value={phoneNumber} />
                  <Text weight="bold" mt={55} size={'15px'} color="#333333">
                    비밀번호 변경
                  </Text>
                  <Input placeholder="현재 비밀번호" maxLength={20} hook={originalPW} mt={15} secure />
                  <Input
                    placeholder="새로운 비밀번호"
                    type={validatePassword(newPW.value, id) && 'error'}
                    validationMessage={validatePassword(newPW.value, id) || (newPW.value && 'O 영문/숫자/특수문자 2가지 이상 조합(8~16자)')}
                    maxLength={20}
                    hook={newPW}
                    mt={15}
                    secure
                  />
                  <Input
                    placeholder="새로운 비밀번호 확인"
                    type={validatePasswordCheck(newPWCheck.value, newPW.value) && 'error'}
                    validationMessage={validatePasswordCheck(newPWCheck.value, newPW.value) || (newPWCheck.value && 'O 입력하신 번호가 일치해요.')}
                    maxLength={20}
                    hook={newPWCheck}
                    mt={15}
                    secure
                  />
                </Wrapper>
              </Wrapper>
              <Wrapper paddingX={25} paddingBottom={12} backgroundColor="white">
                <Button
                  children={'확인'}
                  onPress={() => changeCarmerceUserPassword(originalPW.value, newPW.value)}
                  disabled={
                    !(
                      !!originalPW.value &&
                      !!newPW.value &&
                      !!newPWCheck.value &&
                      !validatePassword(originalPW.value, id) &&
                      !validatePassword(newPW.value, id) &&
                      !validatePasswordCheck(newPWCheck.value, newPW.value)
                    )
                  }
                  whcbr={['100%', 56, '#06f', 'none', 6]}
                  fontSize={19}
                  fontWeight="bold"
                  mt="auto"
                />
              </Wrapper>
            </>
          </ScrollViewBetween>
          <successPopup.Popup />
        </>
      </InstantLayout>
    </Wrapper>
  );
};

function Information({label, value}: {label: string; value: string}) {
  return (
    <Wrapper mt={20} row>
      <Text size={'15px'} mr={30}>
        {label}
      </Text>
      <Text size={'15px'}>{value}</Text>
    </Wrapper>
  );
}

export default EditProfileScreen;
