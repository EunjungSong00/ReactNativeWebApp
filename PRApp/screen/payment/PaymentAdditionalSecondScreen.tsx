import React, {useCallback, useState} from 'react';
import {TouchableOpacity} from "react-native";
import theme from "../../public/theme";
import {useStores} from "../../src/module/store";
import InstantLayout from "../../src/component/template/InstantLayout";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import {SubTitle} from "PaymentRefundScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import {PaymentTitle} from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Txt from "../../src/component/atom/Txt";

const insuranceArr = ['직장의료보험', '지역의료보험'];
const housingTypeArr = ['아파트', '단독', '빌라/연립', '기타'];
const typeHomeOwnershipArr = ['자가', '전세', '월세', '기타'];
const isOwnACarArr = ['있음', '없음'];

/*추가정보 입력 -2*/
const PaymentAdditionalSecondScreen = ({navigation}: any) => {
    const [insurance, setInsurance] = useState(insuranceArr[0]);
    const [housingType, setHousingType] = useState(housingTypeArr[0]);
    const [typeHomeOwnership, setTypeHomeOwnership] = useState(typeHomeOwnershipArr[0]);
    const [isOwnACar, setIsOwnACar] = useState(isOwnACarArr[0]);
    const {paymentStore} = useStores();

    const TapListDom = useCallback(({title, value, arr, onPress}) => (
        <Wrapper mb={35}>
            <PaymentTitle title={title} />
            <Wrapper row backgroundColor={theme.color.lineGray5} padding={1} borderRadius={6} mt={15}>
                {
                    arr.map((item: any) => (
                        <TapBoxDom key={item} title={item} value={value} onPress={onPress} />
                    ))
                }
            </Wrapper>
        </Wrapper>
    ), [insurance, housingType, typeHomeOwnership, isOwnACar]);

    const TapBoxDom = useCallback(({title, value, onPress}) => (
            <TouchableOpacity activeOpacity={1} onPress={() => onPress(title)} style={{backgroundColor: value === title? theme.color.white : '', flex: 1, borderRadius: 6}}>
                <Txt size={'sm'} weight={value === title? 'thick' : 'medium'} textAlign={'center'} paddingY={10}>{title}</Txt>
            </TouchableOpacity>
    ), []);

    const clickHousingType = useCallback((value) => {
        setHousingType(value);
    }, []);

    const clickInsurance = useCallback((value) => {
        setInsurance(value);
    }, []);

    const clickTypeHomeOwnership = useCallback((value) => {
        setTypeHomeOwnership(value);
    }, []);

    const clickIsOwnACar = useCallback((value) => {
        setIsOwnACar(value);
    }, []);

    const clickNext = useCallback(() => {
        const data = paymentStore.loanAdditionalInfo;
        data.housingType = housingType;
        data.isOwnACar = isOwnACar;
        data.typeHomeOwnership = typeHomeOwnership;
        navigation.navigate('PaymentLoanSettingScreen');
    }, []);

    return (
        <>
            <InstantLayout title={'추가정보 입력'} keyboardView>
                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <SubTitle text={`대출 금리 및 한도조회를 위한\n추가정보를 알려주세요.`} />
                            <TapListDom title={'의료보험'} value={insurance} arr={insuranceArr} onPress={clickInsurance} />
                            <TapListDom title={'주거형태'} value={housingType} arr={housingTypeArr} onPress={clickHousingType} />
                            <TapListDom title={'주택 소유 형태'} value={typeHomeOwnership} arr={typeHomeOwnershipArr} onPress={clickTypeHomeOwnership} />
                            <TapListDom title={'자동차 소유 여부'} value={isOwnACar} arr={isOwnACarArr} onPress={clickIsOwnACar} />
                        </Wrapper>
                        <Wrapper mt={20}>
                            <ButtonNew title={'다음'} type={'primary'} onPress={clickNext} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
        </>
    )
}
export default PaymentAdditionalSecondScreen;