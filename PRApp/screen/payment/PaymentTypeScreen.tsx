import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, TouchableOpacity} from "react-native";
import theme from "../../public/theme";
import locales from "../../public/locales";
import usePopup from "../../src/hook/usePopup";
import {useStores} from "../../src/module/store";
import {activateErrorPopup} from "../../src/module/formatter";
import InstantLayout from "../../src/component/template/InstantLayout";
import PaymentTypePopup from "PaymentTypePopup";
import carmerceUserDetailForPurchaseApi from "../../src/api/payment/carmerceUserDetailForPurchaseApi";
import {PurchaseType} from "../../src/api/payment/cashPurchaseApi";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import Img from "../../src/component/atom/Img";
import ButtonNew from "../../src/component/atom/ButtonNew";

const typeList = {
    'personal': {title: '개인', value: PurchaseType[0]},
    'business': {title: '개인사업자', value: PurchaseType[1]},
    'corporate': {title: '법인사업자', value: PurchaseType[2]},
}

/* 명의선택 */
const PaymentTypeScreen = ({navigation}: any) => {
    const [type, setType] = useState<'personal' | 'business' | 'corporate'>();
    const [publicType, setPublicType] = useState<boolean>(false);
    const [popupDisabled, setPopupDisabled] = useState<boolean>(false);
    const [paymentData, setPaymentData] = useState<{} | null>(null);
    const {Popup, setPopupText} = usePopup();
    const {paymentStore} = useStores();

    useEffect(() => {
        // 정보 불러오기 팝업 노출시 백버튼 제어
        const backAction = () => {
            if (popupDisabled) {
                setPopupDisabled(false);
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress", backAction
        );

        return () => backHandler.remove();
    }, [popupDisabled]);

    // 개인, 개인사업자, 법인사업자 선택시
    const clickType = useCallback((value: string) => {
        if (value === 'personal') {
            setType(value);
            value !== type ? setPublicType(false) : null;
        } else {
            activateErrorPopup(navigation, '서비스 준비중이에요.');
        }
    }, [type]);

    // 공동명의 선택시
    const clickPublicType = useCallback(() => {
        setPublicType(!publicType)
    }, [publicType]);

    // 확인 선택시
    const clickSubmit = useCallback(() => {
        if (type) {
            const typeValue = type === 'personal' && publicType ? PurchaseType[1] : typeList[type].value;
            paymentStore.setPaymentTypeName(typeValue);
            // 사전 정보 확인
            getUserPaymentInfo();
        }
    }, [paymentStore, type, publicType]);

    // 사전 정보 확인
    const getUserPaymentInfo = useCallback(() => {
        carmerceUserDetailForPurchaseApi(navigation)
            .then((res) => {
                console.log(res);
                const userData = res?.carmerceUserDetailForPurchase;
                if (userData) {
                    if (userData?.driversLicense?.name) {
                        setPaymentData(userData);
                        setPopupDisabled(true);
                    } else {
                        paymentStore.setPaymentReset();
                        navigation.navigate('PaymentLicenseScreen');
                    }
                }
            })
    }, []);

    const TypeListDom = useCallback(({value}: {value: 'personal' | 'business' | 'corporate'}) => {
        const typeBool = type === value;
        return (
            <Wrapper mt={17}>
                <TouchableOpacity activeOpacity={1} onPress={() => clickType(value)}>
                    <Wrapper backgroundColor={theme.color.white} paddingY={20} paddingX={25} borderRadius={8}
                             borderColor={typeBool ? theme.color.primary : theme.color.white} borderWidth={2}>
                        <Txt size={'sm'} color={typeBool ? 'primary' : 'text'} weight={'bold'}>{typeList[value].title}</Txt>
                    </Wrapper>
                </TouchableOpacity>
                {
                    value === 'personal' && typeBool ?
                        <TouchableOpacity activeOpacity={1} onPress={clickPublicType}>
                            <Wrapper row marginX={25} mt={25} mb={10}>
                                {
                                    publicType ?
                                        <Img src={require('../../public/image/component/check-round-on.png')} width={19} height={20}/>
                                        :
                                        <Img src={require('../../public/image/component/check-round-off.png')} width={19} height={20}/>
                                }
                                <Txt size={'sm'} color={'primary'} weight={'bold'} ml={10}>공동명의구매</Txt>
                            </Wrapper>
                        </TouchableOpacity>
                        :
                        <></>
                }
            </Wrapper>
        )
    }, [type, publicType]);

    return (
        <>
            <InstantLayout title={'명의 선택'}>
                <>
                    <Wrapper flexNum={1} d pt={30} between>
                        <Wrapper>
                            <Txt weight={'thick'} size={'lg'} mb={20} style={{textAlign: 'center'}}>어떤 형태로 차량을 구매하세요?</Txt>
                            <Wrapper backgroundColor={theme.color.primary1} width={'100%'} paddingY={10} paddingX={20} borderRadius={8}>
                                <Txt size={'xs'} color={'primary'}>•   공동명의시 꼭! 아래 체크를 확인 부탁 드려요.</Txt>
                            </Wrapper>
                            <TypeListDom value={'personal'} />
                            <TypeListDom value={'business'} />
                            <TypeListDom value={'corporate'} />
                        </Wrapper>
                        <Wrapper mb={20}>
                            <ButtonNew title={locales.btn.ok} type={'primary'} onPress={clickSubmit} disabled={!type} />
                        </Wrapper>
                    </Wrapper>
                    {
                        popupDisabled?
                            <PaymentTypePopup navigation={navigation} paymentData={paymentData} paymentStore={paymentStore} setPopupDisable={() => setPopupDisabled(false)} />
                            :
                            null
                    }
                </>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default PaymentTypeScreen;