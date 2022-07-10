import React, {ReactElement, useCallback, useEffect} from 'react';
import InstantLayout from "../../src/component/template/InstantLayout";
import useInput from "../../src/hook/useInput";
import usePopup from "../../src/hook/usePopup";
import theme from "../../public/theme";
import {useStores} from "../../src/module/store";
import {numberComma} from "../../src/module/formatter";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import {SubTitle} from "PaymentRefundScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import InputLine from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Img from "../../src/component/atom/Img";
import Txt from "../../src/component/atom/Txt";

interface IInformationListDom {
    title: string;
    children: ReactElement;
}

interface IInformationInputDom {
    hook: any;
    cash?: boolean;
    amount?: number;
    placeholder?: string;
    maxLength?: number;
}

/*대출 설정*/
const PaymentLoanSettingScreen = ({navigation}: any) => {
    const loanAmount = useInput('');
    const loanTerm = useInput('');
    const vehicleId = '1';
    const vehicleNumber = 123123;
    const vehicleSalePrice = 2456;
    const {setPopupText, Popup} = usePopup();
    const {paymentStore} = useStores();
    console.log(paymentStore)

    useEffect(() => {
        const loanAmountValue = loanAmount.value.replace(',', '');
        if (loanAmountValue && Number(loanAmountValue) > Number(vehicleSalePrice)) {
            loanAmount.setValue(loanAmountValue.slice(0, -1))
        }
    }, [loanAmount]);

    useEffect(() => {
        const loanTermValue = loanTerm.value;
        if (loanTermValue && Number(loanTermValue) > 60) {
            loanTerm.setValue('60');
        }
    }, [loanTerm]);

    const InformationListDom = useCallback(({title, children}: IInformationListDom) => (
        <Wrapper row h paddingY={20}>
            <Wrapper flexNum={1}>
                <Txt size={'sm'} weight={'thick'}>{title}</Txt>
            </Wrapper>
            <Wrapper flexNum={3}>
                {children}
            </Wrapper>
        </Wrapper>
    ), []);

    const InformationInputDom = useCallback(({hook, cash, amount, placeholder, maxLength}: IInformationInputDom) => (
        <Wrapper mt={-13}>
            <InputLine comma keyboardType={'number-pad'} hook={hook} placeholder={placeholder} maxLength={maxLength} fontFamily={theme.font.thick} inputStyle={{fontSize: 18}}>
                <Txt size={'md'} weight={'thick'}>{cash? '만원' : '개월'}</Txt>
            </InputLine>
            {
                cash?
                    <Txt size={'xs'} color={'textGray'} weight={'medium'} textAlign={'right'} mt={-15}>현금 결제  : {amount}만원</Txt>
                    :
                    null
            }
        </Wrapper>
    ), []);

    const clickNext = useCallback(() => {
        if (!loanAmount.value) {
            setPopupText('대출금액을 입력해주세요.');
        } else if (!loanTerm.value) {
            setPopupText('대출기간을 입력해주세요.');
        } else {
            paymentStore.setPaymentLoanInfo({
                loanAmount: loanAmount.value,
                loanTerm: loanTerm.value,
                vehicleSalePrice,
                vehicleId,
                vehicleNumber});
            navigation.navigate('PaymentRateLimitScreen');
        }
    }, [loanAmount, loanTerm]);

    return (
        <>
            <InstantLayout title={'대출 설정'} keyboardView>
                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <SubTitle text={`차량 구매에 필요하신\n대출 금액 및 기간을 설정해주세요.`} />
                            <Wrapper w>
                                <Img url={'http://www.autohub.co.kr/AttEdit/CarPhoto/middle/1B07/1B07002324R1.jpg'} width={150} height={150} />
                            </Wrapper>
                            <Wrapper>
                                <InformationListDom title={'차량금액'}>
                                    <Txt size={'md'} weight={'thick'}>{numberComma(vehicleSalePrice)} 만원</Txt>
                                </InformationListDom>
                                <InformationListDom title={'대출금액'}>
                                    <InformationInputDom hook={loanAmount} placeholder={'결제금액 한도 내 입력'} maxLength={5} cash amount={Number(vehicleSalePrice) - Number(loanAmount.value.replace(',',''))} />
                                </InformationListDom>
                                <InformationListDom title={'대출기간'}>
                                    <InformationInputDom hook={loanTerm} placeholder={'분할상환 기간 ( 6~60 이내 )'} maxLength={2} />
                                </InformationListDom>
                            </Wrapper>
                            <Wrapper mt={-10}>
                                <Txt size={'xs'} color={'red'} textAlign={'center'}>{`카머스를 통한 단순 한도조회는\n신용점수에 영향을 주지 않습니다.`}</Txt>
                            </Wrapper>
                        </Wrapper>
                        <Wrapper mt={20}>
                            <ButtonNew title={'다음'} type={'primary'} onPress={clickNext} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default PaymentLoanSettingScreen;