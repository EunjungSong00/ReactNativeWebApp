import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {useStores} from "../../src/module/store";
import usePopup from "../../src/hook/usePopup";
import {setStorage} from "../../src/module/manageAsyncStorage";
import InstantLayout from "../../src/component/template/InstantLayout";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import OrderDeposit from "../order/OrderDeposit";
import cashPurchaseApi from "../../src/api/payment/cashPurchaseApi";
import {INavigationRoute} from "../order/OrderStateScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Txt from "../../src/component/atom/Txt";

interface ISubText {
    text: string;
    mt?: number;
    mb?: number;
    color?: string;
    textAlign?: string | undefined;
    lineHeight?: number;
    underline?: boolean;
    onPress?: () => void;
}

/*입금안내*/
const PaymentDepositScreen = ({navigation}: INavigationRoute) => {
    const {setPopupText, setPopupContents, Popup} = usePopup();
    const [accountValue, setAccountValue] = useState({});
    const {paymentStore} = useStores();

    useEffect(() => {
        getCashPurchase();
    }, []);

    // 입금안내 정보 가져오기
    const getCashPurchase = () => {
        if (paymentStore.orderId) {
            const data = {
                orderId: paymentStore.orderId || '',
                vAmount: paymentStore.deliveryPrice.vAmount,
                purchaseType: paymentStore.typeName,
                refundAccount: {
                    bankCode: paymentStore.refundAccount.bankCode,
                    accountHolder: paymentStore.driverLicense.name,
                    accountNumber: paymentStore.refundAccount.accountNumber
                },
                driverLicense: {
                    driverLicenseNumber: paymentStore.driverLicense.driversLicenseNumber,
                    driverName: paymentStore.driverLicense.name,
                    residentRegistrationNumber: (paymentStore.driverLicense.residentRegistrationNumber).slice(0,7),
                    address: paymentStore.driverLicense.fullAddress,
                    issueDate: paymentStore.driverLicense.issueDate
                },
                deliveryRequestDto: {
                    deliveryPrice: paymentStore.deliveryPrice.price,
                    deliveryDistance: paymentStore.deliveryPrice.distance,
                    deliveryAddressEnd: paymentStore.deliveryPrice.addressEnd,
                    deliveryDesiredTime: paymentStore.deliveryPrice.desiredTime,
                    recipientName: paymentStore.deliveryPrice.recipientName,
                    recipientPhoneNumber: paymentStore.deliveryPrice.recipientPhoneNumber,
                    zipCode: paymentStore.deliveryPrice.zipCode,
                    detailAddress: paymentStore.deliveryPrice.detailAddress,
                    deliveryPriceNo: paymentStore.deliveryPrice.deliveryPriceNo
                }
            }
            cashPurchaseApi({...data, ...{navigation}})
                .then((res) => {
                    console.log('cashPurchase', res)
                    if (res.cashPurchase) {
                        // 입금안내 정보 저장
                        setAccountValue(res.cashPurchase);
                        // 구매진행 잡고있는거 안풀리게 orderId 삭제
                        setStorage('orderId', '');
                        paymentStore.setPaymentOrderId('');
                    }
                })
        }
    }

    const SubText = useCallback(({text, ...props}: ISubText) => (
        <Txt size={'xs'} weight={'medium'} {...props}>{text}</Txt>
    ), []);

    const clickSubmit = useCallback(() => {
        /*const value = {
            title: '단기보험가입',
            text: `단기보험 가입정보를 입력하시겠어요?\n받으실 차량을 직접 운전하시기 위해 반드시 필요해요.`,
            two: true,
            cancel: '닫기',
            clickCancel: () => navigation.navigate('MyPageScreen'),
            clickConfirm: () => navigation.navigate('MyPageScreen')
        };
        setPopupContents(value);*/
        navigation.navigate('MyPageScreen');
    }, []);

    return (
        <>
            <InstantLayout title={'입금안내'}>
                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                    <ScrollViewBetween>
                        <OrderDeposit deposit state={'waiting'} data={accountValue} orderId={paymentStore.orderId || ''} setPopupText={setPopupText} navigation />
                        <Wrapper pb={20} mt={20}>
                            <Wrapper row w>
                                <SubText text={`위의 입금 관련 정보는 `} />
                                <SubText text={`마이페이지>주문상태`} onPress={() => navigation.navigate('OrderStateScreen')} underline />
                                <SubText text={` 에서 확인하실 수`} />
                            </Wrapper>
                            <SubText text={`있습니다.`} mb={10} />
                            <SubText text={`입금 확인은 실제 입금하신 시간으로부터 최대 5분 가량 소요될 수\n있습니다.`} mb={10} />
                            <SubText text={`그 외 결제 관련 문의사항은 우측 카카오톡 채팅 버튼 또는\nNNN-NNNN-NNNN 로 상담 부탁드립니다.`} mb={10} />
                            <SubText text={`상담시간:  09:00 ~ 18:00 (월~금)`} mb={30} />
                            <ButtonNew title={'확인'} type={'primary'} onPress={clickSubmit} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default PaymentDepositScreen;