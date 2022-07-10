import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from "react-native";
import styled from "@emotion/native";
import theme from "../../public/theme";
import {useStores} from "../../src/module/store";
import useInput from "../../src/hook/useInput";
import usePopup from "../../src/hook/usePopup";
import {identificationNumberHypen, identificationNumberStar} from "../../src/module/formatter";
import {validateIdentificationNumber} from "../../src/module/checkValidity";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import InstantLayout from "../../src/component/template/InstantLayout";
import upsertJointOwnershipApi, {EPurpose} from "../../src/api/payment/upsertJointOwnershipApi";
import {INavigationRoute} from "../order/OrderStateScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import InputLine, {PaymentTitle} from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Txt from "../../src/component/atom/Txt";
import TextArea from "../../src/component/atom/TextArea";

/*공동명의자 정보입력*/
const PaymentJointTenancyScreen = ({navigation}: INavigationRoute) => {
    const name = useInput('');
    const phoneNumber = useInput('');
    const residentRegistrationNumber = useInput(''); //주민등록번호
    const residentRegistrationNumberTemp = useInput('');
    const [residentRegistrationNumberChk, setResidentRegistrationNumberChk] = useState<boolean>(false);
    const shareRatioOwner = useInput('');
    const shareRatioJointOwner = useInput('');
    const [purpose, setPurpose] = useState<EPurpose | string>('');
    const [purposeEtc, setPurposeEtc] = useState<string>('');
    const {setPopupText, Popup} = usePopup();
    const {paymentStore} = useStores();

    useEffect(() => {
        const jointOwnership = paymentStore.jointOwnership;
        // 공동명의자 정보 저장값 있을때
        if (jointOwnership.name) {
            name.setValue(jointOwnership.name);
            phoneNumber.setValue(jointOwnership.phoneNumber);
            residentRegistrationNumber.setValue(jointOwnership.residentRegistrationNumber);
            shareRatioOwner.setValue(jointOwnership.shareRatioOwner.toString());
            shareRatioJointOwner.setValue(jointOwnership.shareRatioJointOwner.toString());
            setPurpose(jointOwnership.purpose);
            setPurposeEtc(jointOwnership.purposeEtc);
        }
    }, []);

    useEffect(() => {
        // 주민등록번호 validation check
        setResidentRegistrationNumberChk(validateIdentificationNumber(residentRegistrationNumber));
    }, [residentRegistrationNumber]);

    useEffect(() => {
        // 주민등록번호 뒷자리 *** 처리
        let valueRe = identificationNumberHypen(residentRegistrationNumber.value);
        valueRe ? residentRegistrationNumber.setValue(valueRe) : false;
        valueRe = identificationNumberStar(valueRe);
        setResidentRegistrationNumberChk(validateIdentificationNumber(residentRegistrationNumber));
        residentRegistrationNumberTemp.setValue(valueRe);
    }, [residentRegistrationNumber]);

    // 공동명의 목적 text 입력
    const onChangePurposeEtc = useCallback((value) => {
        setPurposeEtc(value)
    }, []);

    // 확인 선택
    const clickSubmit = useCallback(() => {
        if (!name.value && !phoneNumber.value && !residentRegistrationNumber.value) {
            setPopupText('명의자 정보를 모두 입력해주세요.');
        } else if (phoneNumber.value.length < 10 ) {
            setPopupText('휴대폰 번호를 다시 확인해주세요.');
        } else if (residentRegistrationNumber.value.length < 13) {
            setPopupText('주민등록번호를 다시 확인해주세요.');
        } else if (!shareRatioOwner.value || !shareRatioJointOwner.value) {
            setPopupText('지분율을 입력해주세요.');
        } else if (!purpose) {
            setPopupText('공동명의 목적을 선택해주세요.');
        } else if (purpose === EPurpose[3] && !purposeEtc) {
            setPopupText('공동명의 목적을 기재해주세요.');
        } else {
            setJointOwnership();
        }
    }, [name, phoneNumber, residentRegistrationNumber, shareRatioOwner, shareRatioJointOwner, purpose, purposeEtc]);

    const setJointOwnership = useCallback(() => {
        // 공동명의 정보 저장
        const data = {
            name: name.value,
            phoneNumber: phoneNumber.value,
            residentRegistrationNumber: residentRegistrationNumber.value,
            shareRatioOwner: shareRatioOwner.value,
            shareRatioJointOwner: shareRatioJointOwner.value,
            purpose,
            purposeEtc
        }
        upsertJointOwnershipApi({...data, ...{navigation: navigation}})
            .then((res) => {
                if (res?.upsertJointOwnership) {
                    paymentStore.setJointOwnership(data);
                    navigation.navigate('PaymentRefundScreen');
                }
            })
    }, [name, phoneNumber, residentRegistrationNumber, shareRatioOwner, purpose, purposeEtc]);

    // 공동명의 목적 radio dom
    const PurposeDom = useCallback(({title, value}: any) => (
        <TouchableOpacity activeOpacity={1} onPress={() => setPurpose(value)}>
            <Wrapper row mb={20}>
                <RadioBox w h backgroundColor={purpose === value? theme.color.primary : theme.color.lineGray}>
                    <RadioDot />
                </RadioBox>
                <Txt size={'sm'} weight={'medium'}>{title}</Txt>
            </Wrapper>
        </TouchableOpacity>
    ), [purpose]);

    return (
        <>
            <InstantLayout title={'공동 명의자 정보 입력'} keyboardView>
                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <Wrapper>
                                <InputLine hook={name} title={'공동 명의자'} placeholder={'이름'} maxLength={6} korean />
                                <InputLine hook={phoneNumber} title={'휴대폰 번호'} placeholder={'숫자 10자리 또는 11자리'} maxLength={11} keyboardType={'number-pad'} number en />
                                <Wrapper>
                                    <Wrapper position={'absolute'} style={{zIndex: 8}} width={'100%'}>
                                        <InputLine hook={residentRegistrationNumberTemp} title={'주민등록번호'} en readOnly />
                                    </Wrapper>
                                    <Wrapper position={'relative'} style={{zIndex: 9}} width={'100%'}>
                                        <InputLine hook={residentRegistrationNumber} title={'주민등록번호'} placeholder={'주민등록번호 앞자리  - 주민등록번호 뒷자리'} valid={residentRegistrationNumber.value && !residentRegistrationNumberChk} en maxLength={14} keyboardType={'number-pad'} inputStyle={{color: 'transparent'}} />
                                    </Wrapper>
                                </Wrapper>
                            </Wrapper>
                            <Wrapper mt={30}>
                                <PaymentTitle title={'지분율'} />
                                <Wrapper>
                                    <InputLine hook={shareRatioOwner} publicHook={shareRatioJointOwner} title={'명의자'} placeholder={'1% 이상 99% 이하로 입력하세요'} type={'primary'} fontFamily={theme.font.thick} keyboardType={'number-pad'} maxLength={2}>
                                        {
                                            shareRatioOwner.value? <Txt weight={'thick'}>%</Txt> : null
                                        }
                                    </InputLine>
                                    <InputLine hook={shareRatioJointOwner} publicHook={shareRatioOwner} title={'공동 명의자'} placeholder={'전체(100%)-명의자 지분(%)'} type={'primary'} keyboardType={'number-pad'} fontFamily={theme.font.thick} maxLength={2}>
                                        {
                                            shareRatioOwner.value? <Txt weight={'thick'}>%</Txt> : null
                                        }
                                    </InputLine>
                                </Wrapper>
                            </Wrapper>
                            <Wrapper mt={30}>
                                <PaymentTitle title={'공동 명의 목적'} />
                                <Wrapper mt={25} mb={10}>
                                    <PurposeDom title={'세금우대'} value={EPurpose[0]} />
                                    <PurposeDom title={'자동차보험료 할인'} value={EPurpose[1]} />
                                    <PurposeDom title={'재산 분할'} value={EPurpose[2]} />
                                    <PurposeDom title={'기타'} value={EPurpose[3]} />
                                    <TextArea value={purposeEtc}
                                              onChangeText={onChangePurposeEtc}
                                              placeholder={'공동 명의 목적을 기재해주세요. (20글자 이내)'}
                                              height={'100px'}
                                              maxLength={20}
                                              readOnly={purpose !== EPurpose[3]}
                                              border />
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                        <Wrapper mb={20} mt={20}>
                            <ButtonNew title={'확인'} type={'primary'} onPress={clickSubmit} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default PaymentJointTenancyScreen;

const RadioBox = styled(Wrapper)`
  width: 23px;
  height: 23px;
  border-radius: 12px;
  margin-right: 10px;
`;

const RadioDot = styled(View)`
  width: 10px;
  height: 10px;
  background-color: ${theme.color.white};
  border-radius: 12px;
`;