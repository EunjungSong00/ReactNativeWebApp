import React, {useCallback, useEffect, useRef, useState} from 'react';
import InstantLayout from "../../../src/component/template/InstantLayout";
import Wrapper from "../../../src/component/atom/Wrapper";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import IRootStackParamList from "../../../src/interface/IRootStackParamList";
import Txt from "../../../src/component/atom/Txt";
import Img from "../../../src/component/atom/Img";
import theme from "../../../public/theme";
import {Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity} from "react-native";
import Input from "../../../src/component/atom/Input";
import useInput from "../../../src/hook/useInput";
import ButtonNew from "../../../src/component/atom/ButtonNew";
import styled from "@emotion/native";
import Toast from "../../../src/component/atom/Toast";
import {validateName, validatePhone} from "../../../src/module/checkValidity";
import ScrollViewBetween from "../../../src/component/template/ScrollViewBetween";
import InputMd from "../../../src/component/atom/InputMd";
import createShippingAddressApi from "../../../src/api/cart/shipping/createShippingAddressApi";
import {inject, observer} from "mobx-react";
import usePopup from "../../../src/hook/usePopup";
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';
import { NavigationRoute } from 'react-navigation';
import {useStores} from "../../../src/module/store";

// ID 를 받아 오도록
const EnterShippingInfoScreen = ({navigation, route}: {navigation: StackNavigationProp; route: NavigationRoute}) => {
    const newZonecode = route?.params?.zipcode;
    const newAddress = route?.params?.fullAddress;
    const zonecode = useInput(); // 우편번호
    const zonecodeError = useState(false);  // 우편번호 오류 처리
    const address = useInput(); // 주소
    const addressError = useState(false);   // 주소 오류 처리
    const detailAddress = useInput();   // 상세주소
    const detailAddressError = useState(false); // 상세 주소 오류 처리
    const receiverName = useInput();    // 수령인 이름
    const receiverNameError = useState(false);  // 수취인 이름 오류 처리
    const receiverPhoneNumber = useInput(); // 수령인 핸드폰 번호
    const receiverPhoneNumberError = useState(false);   // 수령인 핸드폰 번호 오류 처리
    const [isDefault, setIsDefault] = useState(false);
    const android = Platform.OS === 'android'
    const validationNameCheck = validateName(receiverName.value);
    const validatePhoneCheck = validatePhone(receiverPhoneNumber.value);
    const {Popup, setPopupText} = usePopup();
    const {shippingStore} = useStores();
    const shippingDate = shippingStore?.shippingDate;

    // ChkInfo Component
    const ChkInfo = useCallback(({value, onPress, title}) => (
        <TouchableOpacity onPress={onPress}>
            <Wrapper row w>
                <Img src={value ? require('../../../public/image/component/check-on.png') : require('../../../public/image/component/check-off.png')}
                     width={16} height={16}/>
                <Txt children={title} size={'xs'} ml={2}/>
            </Wrapper>
        </TouchableOpacity>
    ), []);

    // AddressInput Component
    const AddressInput = useCallback(({hook, onPress, placeholder, error, width, onBlur, mr, mt, maxLength}) => (
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={{width: width ? width : '100%'}}>
            <InputMd hook={hook} placeholder={placeholder} error={error} onBlur={onBlur} mr={mr} mt={mt}
                     pointerEvents={'none'} maxLength={maxLength} />
        </TouchableOpacity>
    ), []);

    // 우편번호, 주소 값 유무
    useEffect(() => {
        newZonecode ? zonecode.setValue(newZonecode) : zonecode.setValue('');
        newAddress ? address.setValue(newAddress) : address.setValue('');
    }, [zonecode, address]);

    // 회원 가입 주소와 동일 체크시
    const onPressInfo = useCallback(() => {
        setIsDefault(!isDefault);
    }, [isDefault]);

    // 우편번호 찾기
    const onPressFindPostNumber = useCallback(() => {
        navigation.navigate('SearchPostCodeScreen', {routeName: 'EnterShippingInfoScreen'});
    }, []);

    const basicQuery = {
        address: address.value,
        detailAddress: detailAddress.value,
        zipCode: zonecode.value,
        recipientName: receiverName.value,
        recipientPhoneNumber: receiverPhoneNumber.value,
        isDefault: isDefault,
    }
    // 다음 버튼 클릭시
    const onSubmitNext = useCallback(async () => {
        if (zonecode.value && address.value && detailAddress.value && receiverName.value && receiverPhoneNumber.value) {
            await createShippingAddressApi(basicQuery, navigation)
                .then((res) => {
                    // console.log('res', res);
                    const resId = res?.createShippingAddress?.id;
                    const fullAddress = {
                        address: res && res.createShippingAddress && res.createShippingAddress.address,
                        detailAddress: res && res.createShippingAddress && res.createShippingAddress.detailAddress,
                        recipientName: res && res.createShippingAddress && res.createShippingAddress.recipientName,
                        recipientPhoneNumber: res && res.createShippingAddress && res.createShippingAddress.recipientPhoneNumber,
                        zipCode: res && res.createShippingAddress && res.createShippingAddress.zipCode
                    }
                    res && res.createShippingAddress && shippingStore.setShippingId(resId);
                    res && res.createShippingAddress && shippingStore.setFullAddress(fullAddress);
                    res && res.createShippingAddress && navigation.replace('ManageShippingListScreen');
                })
            // console.log('전송!');
        } else if (!zonecode.value && !address.value) {
            setPopupText('주소를 입력해주세요.');
            zonecodeError[1](true);
            addressError[1](true);
        } else if (!detailAddress.value) {
            setPopupText('상세 주소를 입력해주세요.');
            detailAddressError[1](true);
        } else if (!receiverName.value && !receiverPhoneNumber.value) {
            setPopupText('수령인 정보를 입력해주세요.');
            receiverNameError[1](true);
            receiverPhoneNumberError[1](true);
        } else if (!receiverName.value) {
            setPopupText('수령인 정보를 입력해주세요.');
            receiverNameError[1](true);
        } else if (!receiverPhoneNumber.value ) {
            setPopupText('수령인 정보를 입력해주세요.');
            receiverPhoneNumberError[1](true);
        } else if (validatePhoneCheck) {
            setPopupText('휴대폰 번호 형식을 맞춰주세요');
            receiverPhoneNumberError[1](true);
        }

    }, [zonecode.value, address.value, detailAddress.value, receiverName.value, receiverPhoneNumber.value, basicQuery, navigation]);

    useEffect(() => {
        console.log(' receiverPhoneNumber.value.length < 11',  receiverPhoneNumber.value.length < 11)
    }, [ receiverPhoneNumber])
    return (
        <>
            <InstantLayout title={'배송지 정보 입력'}>
                <Wrapper flexNum={1} bgColor={theme.color.white}>
                    <ScrollViewBetween>
                        <Wrapper bgColor={theme.color.white}>
                            <Wrapper d>
                                <Wrapper row between mt={26}>
                                    <TitleTxt children={'차량 받으실 주소'}/>
                                    <ChkInfo onPress={onPressInfo} value={isDefault} title={'기본배송지로 설정'}/>
                                </Wrapper>
                                {/* 우편번호 */}
                                <Wrapper row between mt={13}>
                                    <AddressInput hook={zonecode} placeholder={'우편번호'} width={android ? '66%' : '69%'}
                                                  mr={10} maxLength={5} error={zonecodeError}
                                                  onPress={onPressFindPostNumber}/>
                                    <ButtonNew title={'우편번호 찾기'} onPress={onPressFindPostNumber} height={50} size={'xs'}
                                               type={'darkGray'} width={'100px'}/>
                                </Wrapper>

                                {/* 주소 */}
                                <AddressInput hook={address} placeholder={'주소'} width={'100%'}
                                              error={addressError} onPress={onPressFindPostNumber} maxLength={100}
                                              mr={0} mt={10}/>

                                {/* 상세주소 */}
                                <InputMd hook={detailAddress} placeholder={'상세 주소'}
                                         error={detailAddressError} returnKeyType="next" mt={10} maxLength={30}/>

                                {/* 수령인 정보 */}
                                <TitleTxt children={'수령인 정보'} mt={30}/>
                                <InputMd hook={receiverName} placeholder={'받으시는분'}
                                         // onChange={setValue(onlyKorean())}
                                         maxLength={6}
                                         korean
                                         error={receiverNameError} returnKeyType="next" mt={10}/>

                                {/* 휴대폰 번호 */}
                                <Wrapper row between mt={10}>
                                    <InputMd hook={receiverPhoneNumber} placeholder={'휴대폰 번호'}
                                             error={receiverPhoneNumberError} returnKeyType="send"
                                             keyboardType={'number-pad'} maxLength={11} mr={10}
                                             stringNumber
                                    />
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                        <Wrapper d bgColor={theme.color.white} pt={10} pb={20}>
                            <ButtonNew title={'다음'} onPress={onSubmitNext} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    );
};
export default observer(EnterShippingInfoScreen);

const TitleTxt = styled(Txt)`
  font-family: ${theme.font.bold};
  font-size: ${theme.size.sm};
`;

const InputWrapper = styled(Wrapper)<any>`
  //height: 50px;
  border-radius: 6px;
  padding: 16px 15px;
  border: 1px solid #f1f2f4;
  background-color: #f1f2f4;
`;

