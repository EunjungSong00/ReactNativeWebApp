import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from "react-native";
import theme from "../../public/theme";
import {bankImg} from "../../public/bankImgList";
import {useStores} from "../../src/module/store";
import InstantLayout from "../../src/component/template/InstantLayout";
import {numberComma} from "../../src/module/formatter";
import loanLimitInquiryApi, {OrderByType} from "../../src/api/payment/loanLimitInquiryApi";
import {INavigationRoute} from "../order/OrderStateScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import {PaymentTitle} from "../../src/component/atom/InputLine";
import Txt from "../../src/component/atom/Txt";
import Img from "../../src/component/atom/Img";
import ButtonNew from "../../src/component/atom/ButtonNew";

interface IResultListDom {
    title: string;
    item?: any;
    mr?: number;
    ml?: number;
}

interface IProductListDom {
    arrow?: boolean;
    item?: any;
}

// 은행 정보 dom
export const ProductDom = ({arrow = true, item}: IProductListDom) => (
    <Wrapper row paddingY={20} borderBottomWidth={arrow? 1 : 0} borderColor={theme.color.lineGray5}>
        <Wrapper backgroundColor={theme.color.backgroundGray} width={60} height={60} borderRadius={15} w h>
            <Img src={bankImg[item.bankName]} width={30} height={30}/>
        </Wrapper>
        <Wrapper row between flexNum={1} ml={20}>
            <Wrapper>
                <Txt size={'sm'} weight={'thick'}>{item?.bankName || '-'}</Txt>
                <Txt size={'xs'} weight={'medium'} color={'textGray'} style={{marginTop: 5, marginBottom: 10}}>{item?.loanProductName || '-'}</Txt>
                <Wrapper row>
                    <Txt size={'lg'} weight={'thick'} color={'primary'} mr={30}>{item?.loanInterestRate || '-'}%</Txt>
                    <Txt size={'lg'} weight={'thick'}>{item?.loanLimit? numberComma(item.loanLimit) : '-'}만원</Txt>
                </Wrapper>
            </Wrapper>
            {
                arrow &&
                    <Wrapper mt={15}>
                        <Img src={require('../../public/image/icon/ic-path.png')} width={8} height={20} />
                    </Wrapper>
            }
        </Wrapper>
    </Wrapper>
)

/*간편금리 한도조회*/
const PaymentRateLimitScreen = ({navigation}: INavigationRoute) => {
    const [load, setLoad] = useState<boolean>(false);
    const [loanLimitInquiryList, setLoanLimitInquiryList] = useState<any[]>();
    const [loanLimitInquiryLowest, setLoanLimitInquiryLowest] = useState<{}>({});
    const [loanLimitInquiryMaximum, setLoanLimitInquiryMaximum] = useState<{}>({});
    const [filter, setFilter] = useState<number>(0);
    const {paymentStore} = useStores();

    useEffect(() => {
        getLoanLimitInquiryList();
    }, [filter]);

     // 리스트 불러오기
    const getLoanLimitInquiryList = useCallback(() => {
        const data = {
            filter: OrderByType[filter],
            navigation
        }
        loanLimitInquiryApi(data)
            .then((res) => {
                console.log('res', res?.loanLimitInquiry)
                if (res?.loanLimitInquiry) {
                    setLoanLimitInquiryList(res?.loanLimitInquiry?.loanProducts || []);
                    setLoanLimitInquiryLowest(res?.loanLimitInquiry?.lowestInterestRateProduct);
                    setLoanLimitInquiryMaximum(res?.loanLimitInquiry?.maximumInterestRateProduct);
                    setLoad(true);
                }
            })
    }, [filter]);

    // 리스트 선택시
    const clickProductList = useCallback((item) => {
        navigation.navigate('PaymentRateLimitViewScreen', {item: item});
    }, []);

    // 상단 은행 금리정보 dom
    const ResultListDom = useCallback(({title, item, mr, ml}: IResultListDom) => (
        <TouchableOpacity activeOpacity={1} onPress={() => clickProductList(item)} style={{flex: 1}}>
            <Wrapper flexNum={1} backgroundColor={theme.color.white} paddingX={20} paddingY={12} borderRadius={15} mr={mr} ml={ml}>
                <Txt size={'xs'} weight={'thick'} color={'primary'}>{title}</Txt>
                <Wrapper row mt={10}>
                    <Img src={bankImg[item.bankName]} width={30} height={30}/>
                    <Wrapper ml={10}>
                        <Txt size={'sm'} weight={'thick'} mb={1}>{item.bankName}</Txt>
                        <Txt size={'xs'} weight={'thick'} color={'primary'}>{title === '최저금리' ? item.loanInterestRate + '%' : numberComma(item.loanLimit) + '만원'}</Txt>
                    </Wrapper>
                </Wrapper>
            </Wrapper>
        </TouchableOpacity>
    ), []);

    // 금리 낮은순 & 한도 높은순 토글
    const clickFilter = useCallback((value) => {
        setFilter(value);
    }, []);

    // 다시 조회하기 선택
    const clickNext = useCallback(() => {
        getLoanLimitInquiryList();
    }, []);

    return (
        <>
            <InstantLayout title={'간편금리 ㆍ 한도조회'}>
                <Wrapper flexNum={1} backgroundColor={'white'}>
                {
                    load?
                        <>
                            {
                            loanLimitInquiryList && loanLimitInquiryList?.length > 0 ?
                                <ScrollView>
                                    <Wrapper paddingY={25} backgroundColor={theme.color.primary1}>
                                        <Wrapper row d>
                                            <Txt size={'sm'} weight={'thick'}>{paymentStore.carmerceUser.name || ''} </Txt>
                                            <Txt size={'sm'} weight={'medium'}>님의 한도조회 결과</Txt>
                                        </Wrapper>
                                        <Wrapper row mt={20} marginX={20}>
                                            <ResultListDom title={'최저금리'} item={loanLimitInquiryLowest} mr={10} />
                                            <ResultListDom title={'최대한도'} item={loanLimitInquiryMaximum} ml={10} />
                                        </Wrapper>
                                    </Wrapper>
                                    <Wrapper d paddingY={20} flexNum={1} backgroundColor={'white'}>
                                        <Wrapper row between w>
                                            <Wrapper row>
                                                <PaymentTitle title={'대출가능상품'}/>
                                                <Txt size={'sm'} weight={'medium'} ml={1}>({loanLimitInquiryList?.length || '-'}건)</Txt>
                                            </Wrapper>
                                            <Wrapper row>
                                                <Txt size={'xs'} weight={'medium'} color={filter === 0 ? 'primary' : 'text'}
                                                     onPress={() => clickFilter(0)}>금리 낮은순</Txt>
                                                <Txt size={'xs'} marginX={2}>|</Txt>
                                                <Txt size={'xs'} weight={'medium'} color={filter === 1 ? 'primary' : 'text'}
                                                     onPress={() => clickFilter(1)}>한도 높은순</Txt>
                                            </Wrapper>
                                        </Wrapper>
                                        <Wrapper mt={10}>
                                            {
                                                loanLimitInquiryList && loanLimitInquiryList.map((item: any, index) => (
                                                    <TouchableOpacity key={item.bankCode + index} activeOpacity={1} onPress={() => clickProductList(item)}>
                                                        <ProductDom item={item} />
                                                    </TouchableOpacity>
                                                ))
                                            }
                                        </Wrapper>
                                    </Wrapper>
                                </ScrollView>
                                :
                                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                                    <Wrapper flexNum={1} w h>
                                        <Img src={require('../../public/image/component/icon-exclamation.png')} width={65} height={65}/>
                                        <Txt size={'sm'} weight={'medium'} color={'textGray'}>대출가능내역이 없습니다.</Txt>
                                    </Wrapper>
                                    <Wrapper mt={20}>
                                        <ButtonNew title={'다시 조회하기'} type={'gray'} onPress={clickNext}/>
                                    </Wrapper>
                                </Wrapper>
                            }
                        </>
                        :
                        null
                }
                </Wrapper>
            </InstantLayout>
        </>
    )
}
export default PaymentRateLimitScreen;