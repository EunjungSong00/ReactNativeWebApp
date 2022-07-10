import React, {useCallback, useState} from 'react';
import theme from "../../public/theme";
import usePopup from "../../src/hook/usePopup";
import {useStores} from "../../src/module/store";
import InstantLayout from "../../src/component/template/InstantLayout";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import OrderDeliveryTop from "OrderDeliveryTop";
import {ReasonButton, ReasonTitle} from "OrderRefundComponent";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import {PaymentTitle} from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";

export const reasonFirstArr = [
    {title: '마음이 변했어요. (단순 변심)', value: '마음이 변했어요. (단순 변심)'},
    {title: '차량 정보가 달라요. (정보 불일치)', value: '차량 정보가 달라요. (정보 불일치)'},
    {title: '차량에 결함이 있어요. (불량)', value: '차량에 결함이 있어요. (불량)'},
]

/*주문상태 환불접수*/
const OrderRefundScreen = ({navigation, route}: any) => {
    const [reasonFirst, setReasonFirst] = useState();
    const {Popup, setPopupText} = usePopup();
    const {refundStore} = useStores();
    // console.log('OrderRefundScreen', route.params.data)

    const clickReasonFirst = useCallback((value) => {
        setReasonFirst(value);
    }, []);

    const clickSubmit = useCallback(() => {
        if (!reasonFirst) {
            setPopupText('환불사유를 선택해주세요.');
        } else {
            refundStore.setOrderId(route.params.data?.orderId);
            refundStore.setAddress({
                zipcode: route.params.data?.recipientZipCode,
                address: route.params.data?.deliveryAddressEnd,
                detailAddress: route.params.data?.deliveryDetailAddress,
            });
            navigation.navigate('OrderRefundReasonScreen', {type: reasonFirst});
        }
    }, [reasonFirst]);

    return (
        <>
            <InstantLayout title={'환불접수'}>
                <Wrapper flexNum={1} backgroundColor={theme.color.white}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <OrderDeliveryTop data={route.params.data} type={'delivery'} status={'complete'} navigation />
                            <ReasonTitle title={'환불 사유를 먼저 선택해 주세요'} />
                            <Wrapper d>
                                <Wrapper paddingY={30}>
                                    {
                                        reasonFirstArr.map((item) => (
                                            <ReasonButton key={item.value} title={item.title} value={item.value} reason={reasonFirst} onPress={clickReasonFirst} />
                                        ))
                                    }
                                </Wrapper>
                                <Wrapper>
                                    <Wrapper w mb={15}>
                                        <PaymentTitle title={'환불시 주의사항'} />
                                    </Wrapper>
                                    <Wrapper mb={25}>
                                        <Txt size={'xs'} weight={'medium'}>
                                            차량을 인수한 날로부터 7일의 환불기간 내(인수일 1일포함) 차량을 반환하여야 환불이 가능합니다.
                                            환불처리는 환불기간 내에 당사에게 환불접수 를 하는 고객에 한해 처리됩니다.
                                        </Txt>
                                    </Wrapper>
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                        <Wrapper d mb={15}>
                            <ButtonNew title={'환불접수 시작'} type={'primary'} onPress={clickSubmit} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default OrderRefundScreen;