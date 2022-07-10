import React, {useCallback, useEffect, useRef} from 'react';
import {Animated, TouchableOpacity} from 'react-native';
import styled from "@emotion/native";
import theme from "../../public/theme";
import ButtonTwo from "../../src/component/template/ButtonTwo";
import Txt from "../../src/component/atom/Txt";
import Wrapper from "../../src/component/atom/Wrapper";

/*정보 불러오기 팝업*/
const PaymentTypePopup = ({navigation, paymentData, paymentStore, setPopupDisable}: any) => {
    const animation = useRef(new Animated.Value(400)).current;

    // 처음 보여질때 애니메이션
    useEffect(() => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, []);

    // 직접입력 선택
    const clickDelete = useCallback(() => {
        // 저장되어있는 결제 정보 삭제
        paymentStore.setPaymentReset();
        navigation.navigate('PaymentLicenseScreen');
    }, [paymentStore]);

    // 불러오기 선택
    const clickSubmit = useCallback(() => {
        // 불러온 정보 스토어에 저장
        paymentStore.setCarmerceUser(paymentData.carmerceUser);
        paymentStore.setPaymentDriverLicense(paymentData.driversLicense);
        paymentStore.setPaymentAuthentication(paymentData.niceIdentityAuthenticationSocket);
        paymentStore.setJointOwnership(paymentData.jointOwnership);
        paymentStore.setRefundAccount(paymentData.refundAccount);
        navigation.navigate('PaymentLicenseScreen');
    }, [paymentStore]);

    return (
        <>
            <Wrapper width={'100%'} height={'100%'} position={'absolute'}>
                    <Wrapper width={'100%'} height={'200%'} position={'absolute'} backgroundColor={theme.color.black} opacity={0.5} style={{top: '-100%'}}>
                        <TouchableOpacity activeOpacity={1} onPress={setPopupDisable} style={{width: '100%', height: '100%'}} />
                    </Wrapper>
                    <Animated.View style={{
                        width: '100%',
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        transform: [{translateY: animation}]
                    }}>
                    <ContentWrapper>
                        <Txt size={'sm'} weight={'bold'} lineHeight={25} textAlign={'center'}>
                            {`사전에 입력하신 정보가 있습니다.\n간편 입력을 도와드려도 될까요?`}
                        </Txt>
                        <ButtonTwo mt={30} titleLeft={'직접 입력'} titleRight={'불러오기'} onPressLeft={clickDelete} onPressRight={clickSubmit} />
                    </ContentWrapper>
                </Animated.View>
            </Wrapper>
        </>
    )
}
export default PaymentTypePopup;

const ContentWrapper = styled(Wrapper)`
  width: 100%;
  background: ${theme.color.white};
  padding: 35px 15px 20px;
  border-radius: 12px 12px 0 0;
`;
