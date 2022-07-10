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
import {getStorage, setStorage} from "../../../src/module/manageAsyncStorage";
import updateShippingAddressApi from "../../../src/api/cart/shipping/updateShippingAddressApi";
import shippingAddressesApi from "../../../src/api/cart/shipping/shippingAddressesApi";
import {NavigationStackScreenProps} from "react-navigation-stack";
import usePopup from "../../../src/hook/usePopup";
import {useStores} from "../../../src/module/store";
import shippingAddressApi from '../../../src/api/cart/shipping/shippingAddressApi';

// ID 를 받아 오도록
const EditEnterShippingInfoScreen = ({navigation, route} : NavigationStackScreenProps) => {
    const newZonecode = route?.params?.zipcode;
    const newAddress = route?.params?.fullAddress;
    const zonecode = useInput(); // 우편번호
    const zonecodeError = useState(false);  // 우편번호 오류 처리
    const address = useInput(); // 주소
    const addressError = useState(false);   // 주소 오류 처리
    const detailAddress = useInput();   // 상세주소
    const detailAddressError = useState(false); // 상세 주소 오류 처리
    const recipientName = useInput();    // 수령인 이름
    const recipientNameError = useState(false);  // 수취인 이름 오류 처리
    const recipientPhoneNumber = useInput(); // 수령인 핸드폰 번호
    const recipientPhoneNumberError = useState(false);   // 수령인 핸드폰 번호 오류 처리
    const [isDefault, setIsDefault] = useState(false);
    const android = Platform.OS === 'android'
    const validationNameCheck = validateName(recipientName.value);
    const validatePhoneCheck = validatePhone(recipientPhoneNumber.value);
    const {Popup, setPopupText} = usePopup();
    const {shippingStore} = useStores();
    const editId = shippingStore?.shippingId;

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

    // id 비교하기
    useEffect(() => {
        void getShippingId();
    },[]);

    useEffect(()=>{
        getShippingAddress();
    },[])

      // 우편번호, 주소 값 유무
    useEffect(() => {
        newZonecode ? zonecode.setValue(newZonecode) : zonecode;
        newAddress ? address. setValue(newAddress) : address;
    }, [zonecode, address]);

    // 수정시 아이디 가져오기
    const getShippingId= useCallback(() => {
        const id = shippingStore?.shippingId;
    },[]);

    const getShippingAddress = useCallback(async() => {
        const getEditId = shippingStore && shippingStore.shippingId;
        await shippingAddressApi(Number(getEditId), navigation)
        .then((response) => {
            console.log('getShippingAddress res', response);
            const recipientInfo = {
                address: response?.shippingAddress?.address,
                detailAddress: response?.shippingAddress?.detailAddress,
                zipCode: response?.shippingAddress?.zipCode,
                recipientName: response?.shippingAddress?.recipientName,
                recipientPhoneNumber: response?.shippingAddress?.recipientPhoneNumber
            }
            // console.log('recipientInfo', recipientInfo);
            address.setValue(recipientInfo?.address)
            detailAddress.setValue(recipientInfo?.detailAddress)
            zonecode.setValue(recipientInfo?.zipCode)
            recipientName.setValue(recipientInfo?.recipientName)
            recipientPhoneNumber.setValue(recipientInfo?.recipientPhoneNumber)
            recipientName.setValue(recipientInfo?.recipientName);
            recipientPhoneNumber.setValue(recipientInfo?.recipientPhoneNumber);
            setIsDefault(response?.shippingAddress?.isDefault);
        })
    }, [navigation])

    // AddressInput Component
    const AddressInput = useCallback(({hook, onPress, placeholder, error, width, onBlur, mr, mt, maxLength}) => (
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={{width: width ? width : '100%'}}>
            <InputMd hook={hook} placeholder={placeholder} error={error} onBlur={onBlur} mr={mr} mt={mt}
                     pointerEvents={'none'} maxLength={maxLength}/>
        </TouchableOpacity>
    ), []);


    // 회원 가입 주소와 동일 체크시
    const onPressIsDefault = useCallback(() => {
        setIsDefault(!isDefault);
        console.log('onPressIsDefault  isDefault', isDefault);
    }, [isDefault]);

    // 우편번호 찾기
    const onPressFindPostNumber = useCallback(() => {
        navigation.navigate('SearchPostCodeScreen', {routeName: 'EditEnterShippingInfoScreen'});
    }, []);

    const updateQuery = {
        id: Number(editId),
        address: address.value,
        detailAddress: detailAddress.value,
        zipCode: zonecode.value,
        recipientName: recipientName.value,
        recipientPhoneNumber: recipientPhoneNumber.value,
        isDefault: isDefault,
    }
    // 수정할 시
    const onSubmitEdit = useCallback( async() => {
        // console.log('editId', Number(editId));
        // console.log('editId', editId);
        if (zonecode.value && address.value && detailAddress.value && recipientName.value && recipientPhoneNumber.value) {
            await updateShippingAddressApi(updateQuery, navigation)
                .then((res) => {
                    console.log('res', res);
                    //FIXME: undefined 뜸
                    console.log('변경 성공 : ', res);
                    navigation.goBack('ManageShippingListScreen');
                }).catch((error) => {

                })
        } else if (!zonecode.value && !address.value) {
            setPopupText('주소를 입력해주세요.');
            zonecodeError[1](true);
            addressError[1](true);
        } else if (!detailAddress.value) {
            setPopupText('상세 주소를 입력해주세요.');
            detailAddressError[1](true);
        } else if (!recipientName.value && !recipientPhoneNumber.value) {
            setPopupText('수령인 정보를 입력해주세요.');
            recipientNameError[1](true);
            recipientPhoneNumberError[1](true);
        } else if (validationNameCheck || !recipientName.value  || recipientName.value.length < 2) {
            setPopupText('수령인 정보를 입력해주세요.');
            recipientNameError[1](true);
        } else if (validatePhoneCheck || !recipientPhoneNumber.value || recipientPhoneNumber.value.length < 11) {
            setPopupText('수령인 정보를 입력해주세요.');
            recipientPhoneNumberError[1](true);
        }
    }, [zonecode.value, address.value, detailAddress.value, recipientName.value, recipientPhoneNumber.value, updateQuery, navigation]);

    return (
        <>
            <InstantLayout title={'배송지 정보 입력'}>
                <Wrapper flexNum={1} bgColor={theme.color.white}>
                    <ScrollViewBetween>
                        <Wrapper bgColor={theme.color.white}>
                            <Wrapper d>
                                <Wrapper row between mt={26}>
                                    <TitleTxt children={'차량 받으실 주소'}/>
                                    <ChkInfo onPress={onPressIsDefault} value={isDefault} title={'기본배송지로 설정'}/>
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
                                <InputMd hook={recipientName} placeholder={'받으시는분'}
                                         maxLength={6}
                                         error={recipientNameError} returnKeyType="next" mt={10} korean/>

                                {/* 휴대폰 번호 */}
                                <Wrapper row between mt={10}>
                                    <InputMd hook={recipientPhoneNumber} placeholder={'휴대폰 번호'}
                                             error={recipientPhoneNumberError} returnKeyType="send"
                                             keyboardType={'number-pad'} height={50} maxLength={11} mr={10} stringNumber/>
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                        <Wrapper d bgColor={theme.color.white} pt={10} pb={20}>
                            <ButtonNew title={'수정'} onPress={onSubmitEdit} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    );
};
export default observer(EditEnterShippingInfoScreen);

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

