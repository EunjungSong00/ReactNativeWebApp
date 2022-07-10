import React, {Dispatch, memo, SetStateAction, useCallback, useEffect, useState} from 'react';
import {useStores} from "../../src/module/store";
import useInput from "../../src/hook/useInput";
import useTimer from "../../src/hook/useTimer";
import usePopup from "../../src/hook/usePopup";
import {validateIdentificationNumber} from "../../src/module/checkValidity";
import {identificationNumberHypen, identificationNumberStar, onlyNumber} from "../../src/module/formatter";
import InstantLayout from "../../src/component/template/InstantLayout";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import sendNiceIdentityAuthenticationAuthCodeApi from "../../src/api/payment/sendNiceIdentityAuthenticationAuthCodeApi";
import verifyNiceIdentityAuthenticationAuthCodeApi from "../../src/api/payment/verifyNiceIdentityAuthenticationAuthCodeApi";
import Wrapper from "../../src/component/atom/Wrapper";
import InputLine from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Txt from "../../src/component/atom/Txt";

interface ITimer {
    authNumber: string;
    setAuthSuccess: Dispatch<SetStateAction<boolean>>;
    setAuthNumberValid: Dispatch<SetStateAction<boolean>>;
    setPopupText: Dispatch<SetStateAction<string>>
}

/* 본인인증 */
const PaymentAuthenticationScreen = ({navigation, ...props}: any) => {
    const name = useInput('');
    const residentRegistrationNumber = useInput('');
    const [residentRegistrationNumberChk, setResidentRegistrationNumberChk] = useState(false);
    const phoneNumber = useInput('');
    const authNumber = useInput('');
    const [carrierArr, setCarrierArr] = useState([]);
    const [carrier, setCarrier] = useState('SKT');
    const [timerDisabled, setTimerDisabled] = useState(true);
    const [authSuccess, setAuthSuccess] = useState(false);
    const [authNumberValid, setAuthNumberValid] = useState(false);
    const [requestNumber, setRequestNumber] = useState('');
    const [responseNumber, setResponseNumber] = useState('');
    const {setPopupText, Popup} = usePopup();
    const {paymentStore} = useStores();

    useEffect(() => {
        name.setValue(paymentStore.driverLicense?.name);
        console.log('paymentStore.driverLicense.residentRegistrationNumber', identificationNumberStar(paymentStore.driverLicense.residentRegistrationNumber))
        residentRegistrationNumber.setValue(identificationNumberStar(identificationNumberHypen(paymentStore.driverLicense.residentRegistrationNumber)));
        phoneNumber.setValue(paymentStore.authentication?.phoneNumber)
        getMobileList();
    }, []);

    useEffect(() => {
        if (residentRegistrationNumber) {
            setResidentRegistrationNumberChk(validateIdentificationNumber(residentRegistrationNumber));
        }
    }, [residentRegistrationNumber]);

    // 3분 타이머
    const Timer = useCallback(({authNumber, setAuthSuccess, setAuthNumberValid, setPopupText, sendAuthNumberApi}: ITimer) => {
        const timer = useTimer({minute: 3, second: 0});

        const timerText = timer.minutes || timer.seconds ? `${timer.minutes} : ${timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}` : '인증시간 초과';

        const clickAuthNumberConfirm = useCallback((timer,timerText, authNumber) => {
            // 인증번호 입력 후 확인 클릭
            if (timerText === '인증시간 초과') {
                // 재전송\
                timer.reset();
                sendAuthNumberApi();
            } else {
                if (authNumber && authNumber.length === 6) {
                    // 인증 완료
                    const data = {
                        requestNumber,
                        responseNumber,
                        authCode: authNumber,
                        navigation
                    }

                    verifyNiceIdentityAuthenticationAuthCodeApi(data)
                        .then((res) => {
                            if (res.verifyNiceIdentityAuthenticationAuthCode) {
                                paymentStore.setPaymentAuthentication({phoneNumber: res.verifyNiceIdentityAuthenticationAuthCode.phoneNumber})
                                setAuthSuccess(true);
                                setAuthNumberValid(false);
                            } else if (res.extensions) {
                                setAuthSuccess(false);
                                setAuthNumberValid(true);
                            }
                        })
                } else {
                    setAuthNumberValid(true);
                    setPopupText('인증번호가 일치하지 않아요.');
                }
            }
        }, []);

        return (

            <>
                <Txt size={'sm'} color={'red'}>
                    {timerText}
                </Txt>
                <Txt size={'sm'} color={'primary'} ml={15} onPress={()=>clickAuthNumberConfirm(timer,timerText, authNumber)}>
                    {
                        timerText === '인증시간 초과'? '재전송' : '확인'
                    }
                </Txt>
            </>
        )
    }, [requestNumber, responseNumber]);

    const changeCarrier = useCallback((value) => {
        setCarrier(value);
    }, []);

    const getMobileList = useCallback(() => {
        fetch('https://storage.googleapis.com/handle-common-code/mobileCodes.json')
            .then((res) => res.json())
            .then((res) => {
                let mobileList = res?.mobileCode;
                if (mobileList) {
                    mobileList.map((item, index) => {
                        mobileList[index].label = item.name;
                        mobileList[index].value = item.code;
                    });
                    setCarrierArr(mobileList)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    const clickAuthNumber = useCallback(() => {
        //인증번호 전송 클릭
        if (timerDisabled && phoneNumber.value.length > 9) {
            sendAuthNumberApi();
        } else {
            setPopupText('휴대번화번호를 정확하게 입력해주세요.');
        }
    }, [phoneNumber, timerDisabled]);

    const sendAuthNumberApi = () => {
        // 인
        const data = {
            name: name.value,
            residentRegistrationNumber: onlyNumber(residentRegistrationNumber.value),
            mobileCode: carrier,
            phoneNumber: phoneNumber.value,
            navigation
        }
        sendNiceIdentityAuthenticationAuthCodeApi(data)
            .then((res) => {
                if (res.sendNiceIdentityAuthenticationAuthCode) {
                    setRequestNumber(res.sendNiceIdentityAuthenticationAuthCode.requestNumber);
                    setResponseNumber(res.sendNiceIdentityAuthenticationAuthCode.responseNumber);
                    setTimerDisabled(false);
                }
            })
    }

    const clickSubmit = useCallback(() => {
        if (authSuccess) {
            paymentStore.typePublic ?
                navigation.navigate('PaymentJointTenancyScreen')
                :
                navigation.navigate('PaymentRefundScreen')
        } else {
            setPopupText('인증절차를 완료해주세요.');
        }
    }, [paymentStore, authSuccess]);

    return (
        <>
            <InstantLayout title={'본인인증'} keyboardView>
                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <InputLine hook={name} title={'이름'} maxLength={6} readOnly />
                            <InputLine hook={residentRegistrationNumber} title={'주민등록번호'} valid={residentRegistrationNumber.value && !residentRegistrationNumberChk} en maxLength={14} keyboardType={'number-pad'} readOnly />
                            <InputLine hook={phoneNumber} title={'휴대전화번호'} en phone numberString disabled={timerDisabled} maxLength={11} keyboardType={'number-pad'} onPressNumber={clickAuthNumber} selectArr={carrierArr} selectValue={carrier} changeSelect={changeCarrier} />
                            {
                                !timerDisabled?
                                    <InputLine hook={authNumber} title={'인증번호'} placeholder={'인증번호 6자리'} valid={authNumberValid} en maxLength={6} numberString keyboardType={'number-pad'}>
                                        {
                                            !authSuccess?
                                                <Timer authNumber={authNumber.value} setAuthSuccess={setAuthSuccess}setAuthNumberValid={setAuthNumberValid} setPopupText={setPopupText} sendAuthNumberApi={sendAuthNumberApi} />
                                                :
                                                <Txt size={'sm'} color={'primary'}>인증 완료</Txt>
                                        }
                                    </InputLine>
                                    :
                                    null
                            }
                        </Wrapper>
                        <Wrapper mb={20} mt={20}>
                            <ButtonNew title={'다음'} type={'primary'} onPress={clickSubmit} disabled={timerDisabled} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default PaymentAuthenticationScreen;