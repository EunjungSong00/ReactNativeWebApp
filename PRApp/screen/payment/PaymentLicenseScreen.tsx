import React, {useCallback, useEffect, useState} from 'react';
import {useStores} from "../../src/module/store";
import useInput from "../../src/hook/useInput";
import usePopup from "../../src/hook/usePopup";
import {dateNumberDot, driverLicenseNumberHypen, identificationNumberHypen, identificationNumberStar, onlyNumberString} from "../../src/module/formatter";
import {validateDriverLicenseNumber, validateIdentificationNumber} from "../../src/module/checkValidity";
import InstantLayout from "../../src/component/template/InstantLayout";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import ButtonTwo from "../../src/component/template/ButtonTwo";
import upsertDriversLicenseApi from "../../src/api/payment/upsertDriversLicenseApi";
import {INavigationRoute} from "../order/OrderStateScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import InputLine from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";

/*운전면허증 등록*/
const PaymentLicenseScreen = ({navigation}: INavigationRoute) => {
    const driverLicenseNumber = useInput('');
    const driverName = useInput('');
    const residentRegistrationNumber = useInput('');
    const residentRegistrationNumberTemp = useInput('');
    const address = useInput('');
    const issueDate = useInput('');
    const [driverLicenseNumberChk, setDriverLicenseNumberChk] = useState<boolean>(false);
    const [residentRegistrationNumberChk, setResidentRegistrationNumberChk] = useState<boolean>(false);
    const [issueDateChk, setIssueDateChk] = useState<boolean>(false);
    const {setPopupText, setPopupContents, Popup} = usePopup();
    const {paymentStore} = useStores();

    useEffect(() => {
        // 운전면허 정보 있을때
        const driverLicense = paymentStore.driverLicense;
        if (driverLicense.name) {
            driverLicenseNumber.setValue(driverLicense.driversLicenseNumber);
            driverName.setValue(driverLicense.name);
            residentRegistrationNumber.setValue(driverLicense.residentRegistrationNumber);
            address.setValue(driverLicense.fullAddress);
            issueDate.setValue(driverLicense.issueDate);
        }
    }, []);

    useEffect(() => {
        // 운전면허번호 validation
        const value = driverLicenseNumber.value;
        const valueRe = driverLicenseNumberHypen(value);
        if (value !== valueRe) {
            driverLicenseNumber.setValue(valueRe);
        }
        setDriverLicenseNumberChk(validateDriverLicenseNumber(driverLicenseNumber));
    }, [driverLicenseNumber]);

    useEffect(() => {
        // 주민등록번호 validation
        const value = residentRegistrationNumber.value;
        let valueRe = identificationNumberHypen(value);
        valueRe ? residentRegistrationNumber.setValue(valueRe) : false;
        valueRe = identificationNumberStar(valueRe);
        setResidentRegistrationNumberChk(validateIdentificationNumber(residentRegistrationNumber));
        residentRegistrationNumberTemp.setValue(valueRe);
    }, [residentRegistrationNumber]);

    useEffect(() => {
        // 발급일자 설정
        const value = issueDate.value;
        const valueRe = dateNumberDot(issueDate.value);
        if (value !== valueRe) {
            issueDate.setValue(valueRe);
        }
        setIssueDateChk(value.length === 10);
    }, [issueDate]);

    // 재실행 선택시
    const clickReset = useCallback(() => {
        navigation.navigate('PaymentLicenseCameraScreen');
    }, []);

    // 다음 선택시
    const clickNext = useCallback(() => {
        if (!driverLicenseNumberChk) {
            setPopupText(`운전면허 정보가 정확하지 않아요.\n확인 후 수정해주세요.`);
        } else if (!residentRegistrationNumberChk) {
            setPopupText(`주민등록번호 정보가 정확하지 않아요.\n확인 후 수정해주세요.`);
        } else if (!issueDateChk) {
            setPopupText(`발급일자 정보가 정확하지 않아요.\n확인 후 수정해주세요.`);
        } else if (!driverName.value && !address.value) {
            setPopupText(`필수 입력 정보를 입력하세요.`);
        } else {
            const value = {
                text: `명의자 정보가 정확한지 한 번 더 확인해주세요.\n계약서 등 중요한 서류에 기재되는 내용이에요.`,
                two: true,
                cancel: '달라요',
                confirm: '일치해요',
                clickConfirm: setDriversLicense
            };
            setPopupContents(value);
        }
    }, [address, driverLicenseNumber, driverName, issueDate, residentRegistrationNumber, driverLicenseNumberChk, residentRegistrationNumberChk, issueDateChk]);

    // 정보 일치하다 했을때
    const setDriversLicense = useCallback(() => {
        // 운전면허 정보 저장
        const data = {
            name: driverName.value,
            driversLicenseNumber: driverLicenseNumber.value,
            residentRegistrationNumber: onlyNumberString(residentRegistrationNumber.value),
            fullAddress: address.value,
            issueDate: issueDate.value
        }
        upsertDriversLicenseApi({...data, ...{navigation: navigation}})
            .then((res) => {
                console.log('upsertDriversLicenseApi', res);
                if (res?.upsertDriversLicense) {
                    paymentStore.setPaymentDriverLicense(data);
                    navigation.navigate('PaymentAuthenticationScreen');
                }
            })
    }, [address, driverLicenseNumber, driverName, issueDate, residentRegistrationNumber]);

    return (
        <>
            <InstantLayout title={'운전면허증 등록'} keyboardView>
                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <InputLine hook={driverLicenseNumber} title={'운전면허번호'} valid={driverLicenseNumber.value && !driverLicenseNumberChk} en maxLength={15} />
                            <InputLine hook={driverName} title={'이름'} maxLength={6} korean />
                            <Wrapper>
                                <Wrapper position={'absolute'} style={{zIndex: 8}} width={'100%'}>
                                    <InputLine hook={residentRegistrationNumberTemp} title={'주민등록번호'} en readOnly />
                                </Wrapper>
                                <Wrapper position={'relative'} style={{zIndex: 9}} width={'100%'}>
                                    <InputLine hook={residentRegistrationNumber} title={'주민등록번호'} valid={residentRegistrationNumber.value && !residentRegistrationNumberChk} en maxLength={14} keyboardType={'number-pad'} inputStyle={{color: 'transparent'}} />
                                </Wrapper>
                            </Wrapper>
                                <InputLine hook={address} title={'주소'} maxLength={100} />
                            <InputLine hook={issueDate} title={'발급일자'} valid={issueDate.value && !issueDateChk} en maxLength={10} keyboardType={'number-pad'} />
                        </Wrapper>
                        <Wrapper mt={20}>
                            {/*<ButtonTwo titleLeft={'재실행'}
                                       titleRight={'다음'}
                                       onPressLeft={clickReset}
                                       onPressRight={clickNext} />*/}
                            <ButtonNew title={'다음'} type={'primary'} onPress={clickNext} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default PaymentLicenseScreen;