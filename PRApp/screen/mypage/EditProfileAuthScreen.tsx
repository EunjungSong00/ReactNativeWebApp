import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from '../../src/component/atom/Wrapper';
import Text from '../../src/component/atom/Text';
import InstantLayout from '../../src/component/template/InstantLayout';
import Input from '../../src/component/atom/Input';
import useInput from '../../src/hook/useInput';
import Button from '../../src/component/atom/Button';
import checkCarmerceUserApi from '../../src/api/mypage/checkCarmerceUserApi';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import {activateErrorPopup} from '../../src/module/formatter';

/*회원정보 수정 진입*/
const EditProfileAuthScreen = ({navigation}: NavigationStackScreenProps) => {
  const password = useInput();

  const checkCarmerceUser = useCallback(async (password: string) => {
    if (!password) {
      activateErrorPopup(navigation, '비밀번호를 입력해주세요.');
    } else {
      const response = password && (await checkCarmerceUserApi({password}, navigation));
      response?.checkCarmerceUser
        ? navigation.navigate('EditProfileScreen', {
            name: response?.checkCarmerceUser?.name,
            email: response?.checkCarmerceUser?.email,
            phoneNumber: response?.checkCarmerceUser?.phoneNumber,
            id: response?.checkCarmerceUser?.email?.split('@')?.[0]
          })
        : response?.message === '10회'
        ? activateErrorPopup(navigation, response?.message, () => navigation.navigate('ResetPasswordRequestScreen'))
        : activateErrorPopup(navigation, response?.message);
    }
  }, []);

  return (
    <InstantLayout title={'회원정보 관리'}>
      <Wrapper flex={1} backgroundColor={'white'} padding={25} between style={{flexGrow: 1}}>
        <Wrapper>
          <Text color="#111111" weight="bold" size={'26px'} mt={9}>
            정보 수정을 위해
          </Text>
          <Text color="#111111" weight="bold" size={'26px'} mt={9}>
            비밀번호를 입력해주세요
          </Text>
          <Input placeholder="비밀번호" maxLength={20} hook={password} mt={29} secure />
        </Wrapper>
        <Button children={'확인'} whcbr={['100%', 56, '#06f', 'none', 6]} fontSize={19} fontWeight="bold" mt="auto" onPress={() => checkCarmerceUser(password.value)} />
      </Wrapper>
    </InstantLayout>
  );
};
export default EditProfileAuthScreen;
