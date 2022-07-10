import React, {useCallback} from 'react';
import {useStores} from "../../src/module/store";
import {INavigationRoute} from "../order/OrderStateScreen";
import InstantLayout from "../../src/component/template/InstantLayout";
import Wrapper from "../../src/component/atom/Wrapper";
import ButtonNew from "../../src/component/atom/ButtonNew";

/* 결제 선택 */
const PaymentSelectScreen = ({navigation}: INavigationRoute) => {
    const {paymentStore} = useStores();

    const clickSelect = useCallback((value: string) => {
        paymentStore.setPaymentSelect(value);
        navigation.navigate('PaymentTermsScreen');
    }, []);

    return (
        <>
            <InstantLayout title={'결제 선택'}>
                <Wrapper flexNum={1} w h d>
                    <ButtonNew title={'현금'} type={'primary'} mb={20} onPress={() => clickSelect('현금')} />
                    <ButtonNew title={'현금+대출'} type={'primary'} mb={20} onPress={() => clickSelect('현대')} />
                    <ButtonNew title={'대출'} type={'primary'} onPress={() => clickSelect('대출')} />
                </Wrapper>
            </InstantLayout>
        </>
    )
}
export default PaymentSelectScreen;