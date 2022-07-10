import React, {useCallback, useState} from 'react';
import InstantLayout from "../../src/component/template/InstantLayout";
import useInput from "../../src/hook/useInput";
import {useStores} from "../../src/module/store";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import {SubTitle} from "PaymentRefundScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import InputLine from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Txt from "../../src/component/atom/Txt";
import Select from "../../src/component/atom/Select";
import usePopup from "../../src/hook/usePopup";

const jobArr = [
    { label: '직장인', value: '직장인' },
    { label: '사업자', value: '사업자' },
    { label: '공무원', value: '공무원' },
    { label: '무직(주부 등)', value: '무직(주부 등)' }
];

const typeArr = [
    { label: '정규직', value: '정규직' },
    { label: '비정규직', value: '비정규직' },
    { label: '프리랜서', value: '프리랜서' }
];

/*추가정보 입력 -1*/
const PaymentAdditionalFirstScreen = ({navigation}: any) => {
    const [job, setJob] = useState('');
    const [type, setType] = useState('');
    const price = useInput('');
    const {setPopupText, Popup} = usePopup();
    const {paymentStore} = useStores();

    const onChangeJob = useCallback((value) => {
        setJob(value);
    }, []);

    const onChangeType = useCallback((value) => {
        setType(value);
    }, []);

    const clickNext = useCallback(() => {
        if (!job) {
            setPopupText('직업을 선택해주세요.');
        } else if (!type) {
            setPopupText('고용형태를 선택해주세요.');
        } else if (!price.value) {
            setPopupText('연소득을 입력해주세요.');
        } else {
            paymentStore.setPaymentLoanAdditionalInfo({annualIncome: price.value});
            navigation.navigate('PaymentAdditionalSecondScreen');
        }
    }, [job, type, price]);

    return (
        <>
            <InstantLayout title={'추가정보 입력'} keyboardView>
                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <SubTitle text={`대출 금리 및 한도조회를 위한\n추가정보를 알려주세요.`} />
                            <Wrapper>
                                <Select title={'직업'} value={job} items={jobArr} placeholder={'구분'} onValueChange={onChangeJob} />
                                <Select title={'고용형태'} value={type} items={typeArr} placeholder={'구분'} onValueChange={onChangeType} />
                                <InputLine hook={price} title={'연소득'} placeholder={'소득금액'} comma keyboardType={'number-pad'} maxLength={8}>
                                    <Txt size={'md'} weight={'thick'}>만원</Txt>
                                </InputLine>
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
export default PaymentAdditionalFirstScreen;