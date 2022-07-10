import styled from '@emotion/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, ImageSourcePropType, TextInput} from 'react-native';
import Wrapper from '../../src/component/atom/Wrapper';
import Text from '../../src/component/atom/Text';
import Button from '../../src/component/atom/Button';
import Input from '../../src/component/atom/Input';
import usePopupEl from '../../src/hook/usePopupEl';
import useInput from '../../src/hook/useInput';
import theme, {whiteBlue} from '../../public/theme';
import DismissKeyboardView from '../../src/component/atom/DismissKeyBoardView';
import {validateId, validatePassword} from '../../src/module/checkValidity';

// TODO: 로그인 체크 > 홈 (스토어) <- 필요없을지도??????

const HomeScreen = ({navigation}: any) => {
  const popup = usePopupEl();
  const testTextInput = useInput();
  const testInput = useInput();
  const testPasswordInput = useInput();
  const testValidationInput = useInput();
  const error = useState<boolean>(false);

  useEffect(() => {
    // popup.setPopup(permissionPopupContent);
  }, []);

  const goLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const goHomeIndex = useCallback(() => {
    // navigation.navigate('GnbNavigator');
    // navigation.navigate('EnterShippingInfoScreen');
    navigation.navigate('ManageShippingListScreen');
  }, [navigation]);

  const goPayment = useCallback(() => {
    navigation.navigate('PurchaseScreen');

  },[navigation])

  const PermissionElement = ({src, title, reason}: {src: ImageSourcePropType; title: string; reason: string}) => (
    <Wrapper marginTop={28} row>
      <Image source={src} />
      <Wrapper ml={20}>
        <Text weight="medium">{title}</Text>
        <Text weight="regular" color={theme.color.textGray}>
          {reason}
        </Text>
      </Wrapper>
    </Wrapper>
  );

  const permissions = [
    {
      src: require('../../public/image/icon/ic-cellp.png'),
      title: '기기 및 앱기록 (필수)',
      reason: '앱 오류 확인 및 사용성 개선 용도'
    },
    {
      src: require('../../public/image/icon/icon-pin-3.png'),
      title: '위치 (선택)',
      reason: '사용자 위치 기반 상품 추천 시'
    },
    {
      src: require('../../public/image/icon/icon-download-3.png'),
      title: '저장공간 ・ 카메라 (선택)',
      reason: '구매후기 작성 및 상담톡 이용 시'
    },
    {
      src: require('../../public/image/icon/ic-adress-2.png'),
      title: '전화 ・ SMS (선택)',
      reason: '휴대폰 사용자 본인 인증 용도'
    },
    {
      src: require('../../public/image/icon/ic-adress.png'),
      title: '주소록 ・ 캘린더 (선택)',
      reason: '정보를 활용한 서비스 기능 개선 용도'
    }
  ];

  const permissionPopupContent = (
    <Wrapper>
      <Wrapper w mt={9}>
        <Image source={require('../../public/image/logo/carmerce.png')} />
      </Wrapper>
      <Wrapper w style={{marginTop: 14}}>
        <Text weight="medium" size={'17px'}>
          카머스 앱을 즐기기 위해
        </Text>
        <Text weight="medium" size={'17px'}>
          다음의 권한을 허용해 주세요.
        </Text>
      </Wrapper>
      {permissions.map((permission, key) => (
        <PermissionElement src={permission.src} title={permission.title} reason={permission.reason} key={key} />
      ))}
    </Wrapper>
  );

  return (
    <Wrapper flex={1} h padding={30} bgColor="#fff">
      <DismissKeyboardView>
        <Text weight="bold" size={'30px'}>
          home
        </Text>
        <Button
          mt={20}
          whcbr={['100%', '10%', theme.color.primary, '1px solid #0066ff', 10]}
          fontSize={20}
          onPress={() => popup.setPopup(permissionPopupContent)}
          children="권한 팝업 on"
        />
        <Button mt={20} whcbr={['100%', '10%', theme.color.primary, 'none', 10]} fontSize={20} onPress={goLogin} children="로그인화면" />
        <Button mt={20} whcbr={['100%', '10%', theme.color.primary, 'none', 10]} fontSize={20} onPress={goHomeIndex} children="홈인덱스" />
        <Button mt={20} whcbr={['100%', '10%', theme.color.primary, 'none', 10]} fontSize={20} onPress={goPayment} children="구매하기" />
        <Button mt={20} whcbr={['100%', '10%', theme.color.primary, 'none', 10]} fontSize={20} onPress={() => error[1](true)} children="아이디 에러" />
        {/* <Button mt={20} whcbr={['100%', '10%', primary, 10]} fontSize={20} onPress={() => popup.setPopup(undefined)} children="이건 하얀 버튼이에요" /> */}
        <Input hook={testInput} mt={20} placeholder="아이디" error={error} validationMessage={validateId(testInput.value)} />
        <Input hook={testPasswordInput} mt={20} placeholder="비밀번호 확인" secure={true} validationMessage={validatePassword(testPasswordInput.value, testInput.value)} />
        <Input hook={testValidationInput} mt={20} placeholder="input" />
        <popup.Element nonTitle width="335px" height="585px" onPressPopupEnter={() => navigation.navigate('PermissionScreen')} />
      </DismissKeyboardView>
    </Wrapper>
  );
};
export default HomeScreen;
