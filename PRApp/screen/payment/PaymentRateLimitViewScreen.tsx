import React, {useCallback} from 'react';
import {ScrollView} from "react-native";
import theme from "../../public/theme";
import InstantLayout from "../../src/component/template/InstantLayout";
import {ProductDom} from "PaymentRateLimitScreen";
import {INavigationRoute} from "../order/OrderStateScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import ButtonNew from "../../src/component/atom/ButtonNew";

interface IDescriptionDom {
    title: string;
    text: any[];
}

/*간편금리 한도조회 상세*/
const PaymentRateLimitViewScreen = ({navigation, route}: INavigationRoute) => {
    const item = route?.params?.item;

    const DescriptionDom = useCallback(({title, text}: IDescriptionDom) => (
        <Wrapper mb={35}>
            <Txt size={'sm'} weight={'thick'} mb={20}>{title}</Txt>
            {
                text.map((item: any, index: number) => (
                    <Wrapper mb={1} key={index}>
                        <Wrapper row mb={1}>
                            <Txt size={'xs'} weight={'medium'} mr={1}>ㆍ</Txt>
                            <Txt size={'xs'} weight={'medium'}>{item}</Txt>
                        </Wrapper>
                    </Wrapper>
                ))
            }
        </Wrapper>
    ), []);

    // 대출 신청하기 선택시
    const clickNext = useCallback(() => {
        navigation.navigate('PaymentCompleteScreen');
    }, []);

    return (
        <>
            <InstantLayout title={item.bankName || '-'}>
                <Wrapper flexNum={1} backgroundColor={'white'}>
                    <ScrollView>
                        <Wrapper backgroundColor={theme.color.backgroundGray}>
                            <Wrapper d paddingY={20} backgroundColor={'white'}>
                                <ProductDom arrow={false} item={item} />
                            </Wrapper>
                            <Wrapper d backgroundColor={theme.color.white} mt={20} paddingTop={25} pb={70}>
                                {
                                    item.loanDetailPage.map((item: {title: string; text: string[]}) => (
                                        <DescriptionDom title={item.title} text={item.text} key={item.title} />
                                    ))
                                }
                            </Wrapper>
                        </Wrapper>
                    </ScrollView>
                    <Wrapper d position={'absolute'} width={'100%'} mb={20} style={{bottom: 0}}>
                        <ButtonNew title={'대출 신청하기'} type={'primary'} onPress={clickNext} />
                    </Wrapper>
                </Wrapper>
            </InstantLayout>
        </>
    )
}
export default PaymentRateLimitViewScreen;