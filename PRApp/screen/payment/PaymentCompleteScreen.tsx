import React, {useCallback, useEffect, useState} from 'react';
import theme from "../../public/theme";
import InstantLayout from "../../src/component/template/InstantLayout";
import {useStores} from "../../src/module/store";
import {SubTitle} from "PaymentRefundScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Img from "../../src/component/atom/Img";


/*대출 완료*/
const PaymentCompleteScreen = ({navigation}: any) => {
    const [text, setText] = useState<string>('');
    const {paymentStore} = useStores();

    useEffect(() => {
        let value = '';
        if (paymentStore.select === '현대') {
            value = '대출금 입금 및 잔금 입금이'
        } else {
            value = '대출금 입금이'
        }
        setText(value);
    }, []);

    const clickNext = useCallback(() => {
        navigation.navigate('PaymentDepositScreen');
    }, []);

    return (
        <>
            <InstantLayout title={'대출완료'} back>
                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                    <Wrapper w>
                        <Wrapper mt={50} mb={25}>
                            <Img src={require('../../public/image/payment/payment-complete.png')} width={75} height={62} />
                        </Wrapper>
                        <SubTitle text={`축하합니다!\n카머스대출이 성공적으로 완료되었습니다.`} />
                        <Wrapper width={'100%'} w backgroundColor={theme.color.primary1} borderRadius={8} paddingY={25}>
                            <Txt size={'sm'} color={'primary'} weight={'medium'} mb={10}>
                                {text}
                            </Txt>
                            <Txt size={'lg'} color={'primary'} weight={'thick'} mb={10}>90분 이내에 확인</Txt>
                            <Txt size={'sm'} color={'primary'} weight={'medium'}>되시면 구매가 완료됩니다.</Txt>
                        </Wrapper>
                    </Wrapper>
                    <Wrapper mt={20}>
                        <ButtonNew title={'확인'} type={'primary'} onPress={clickNext} />
                    </Wrapper>
                </Wrapper>
            </InstantLayout>
        </>
    )
}
export default PaymentCompleteScreen;