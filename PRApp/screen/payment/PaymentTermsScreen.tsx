import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from "react-native";
import styled from "@emotion/native";
import {useStores} from "../../src/module/store";
import theme from "../../public/theme";
import locales from "../../public/locales";
import {setStorage} from "../../src/module/manageAsyncStorage";
import InstantLayout from "../../src/component/template/InstantLayout";
import {INavigationRoute} from "../order/OrderStateScreen";
import Text from "../../src/component/atom/Text";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import Img from "../../src/component/atom/Img";
import ButtonNew from "../../src/component/atom/ButtonNew";

interface ITermArr {
    title: string,
    value: any,
    onPress?: () => void,
    list?: any[],
    visible?: boolean,
    clickVisible?: () => void
}

/* 이용약관 */
const PaymentTermsScreen = ({navigation, route}: INavigationRoute) => {
    const [agreeAll, setAgreeAll] = useState<boolean>(false);
    const [service, setService] = useState<boolean>(false);
    /*const [credit, setCredit] = useState<boolean>(false);
    const [agency, setAgency] = useState<boolean>(false);*/
    const [auth, setAuth] = useState<boolean>(false);
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
    const {paymentStore} = useStores();

    useEffect(() => {
        if (route?.params?.orderId) {
            // 이용약관 넘어올때 orderId 있으면 저장
            paymentStore.setPaymentOrderId(route.params.orderId);
            setStorage('orderId', route.params.orderId);
        } else {
            navigation.goBack();
        }
    }, []);

    useEffect(() => {
        // 하나씩 전부다 동의 했을때 전체동의 true
        setAgreeAll(service && /*credit && agency &&*/ auth);
    }, [service, /*credit, agency,*/ auth]);

    useEffect(() => {
        // 전체동의 변경시 submit 버튼 disabled 처리
        setSubmitDisabled(!agreeAll);
    }, [agreeAll]);

    // 전체 동의 선택시
    const clickAgreeAll = useCallback(() => {
        const value = !agreeAll;
        setAgreeAll(value);
        setService(value);
        /*setCredit(value);
        setAgency(value);*/
        setAuth(value);
    }, [agreeAll]);


    const clickService = useCallback(() => {
        setService(!service);
    }, [service]);

    /*const clickCredit = useCallback(() => {
        setCredit(!credit);
    }, [credit]);

    const clickAgency = useCallback(() => {
        setAgency(!agency);
    }, [agency]);*/

    const clickAuth = useCallback(() => {
        setAuth(!auth);
    }, [auth]);

    const termArr: ITermArr[] = [
        {
            title: '[필수] 서비스 이용 동의',
            value: service,
            onPress: clickService,
            list: [
                {
                    title: '서비스 이용약관 동의',
                    type: 'privacy'
                },
                {
                    title: '개인정보 수집·이용·제공 동의',
                    type: 'customer'
                }
            ]
        },
        /*{
            title: '[필수] 개인(신용)정보 제공 동의',
            value: credit,
            onPress: clickCredit,
            list: [
                {
                    'title': '개인(신용)정보 제 3자 제공동의',
                    'name': 'TosScreen'
                },
                {
                    'title': '개인(신용)정보 수집·이용 동의',
                    'name': 'TosScreen'
                }
            ]
        },
        {
            title: '[필수] 금융기관 개인(신용)정보 동의',
            value: agency,
            onPress: clickAgency,
            list: [
                {
                    'title': '금융사 개인정보 수집·이용·제공 동의',
                    'name': 'TosScreen'
                },
                {
                    'title': '금융사 개인(신용)정보 조회 동의',
                    'name': 'TosScreen'
                },
                {
                    'title': '개인(신용)정보 수집·이용·제공 동의(서민금융진흥원) ',
                    'name': 'TosScreen'
                },
                {
                    'title': '개인(신용)정보 조회 동의(서민금융진흥원) ',
                    'name': 'TosScreen'
                },
                {
                    'title': '계약 체결·이행 등을 위한 필수 동의(서울보증보험)',
                    'name': 'TosScreen'
                }
            ]
        },*/
        {
            title: '[필수] 휴대폰 본인확인 동의',
            value: auth,
            onPress: clickAuth,
            list: [
                {
                    title: '휴대폰 본인확인서비스 이용약관',
                    type: 'phone'
                },
                {
                    title: '개인정보 이용 및 활용 동의',
                    type: 'phoneCustomer'
                },
                {
                    title: '고유식별정보 처리 동의',
                    type: 'phoneUnique'
                }
            ]
        },
    ]

    // 체크박스 리스트
    const DetailCheckBox = useCallback(({value}: {value: ITermArr}) => {
            const [visible, setVisible] = useState<boolean>(true);

            const clickVisible = useCallback(() => {
                setVisible(!visible)
            }, [visible]);

            return (
                <Wrapper mt={20}>
                    <TitleCheckBox title={value.title} value={value.value} onPress={value.onPress}
                                   visible={visible} clickVisible={clickVisible}/>
                    {
                        !visible?
                            value?.list?.map((item: any) => {
                                return (
                                    <DetailListBox key={item.title} title={item.title} value={value.value} type={item.type}/>
                                )
                            })
                            :
                            null
                    }
                </Wrapper>
            )
        },[]);

    const TitleCheckBox = useCallback(({title, value, onPress, visible, clickVisible}: ITermArr) => (
        // 타이틀 체크박스
            <Wrapper mb={title !== '전체 동의하기'? 5 : 0}>
                <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
                    <Wrapper w row between>
                        <Wrapper w row>
                            <Img
                                src={value ? require('../../public/image/component/check-on.png') : require('../../public/image/component/check-off.png')}
                                width={20} height={20}/>
                            <Text children={title} size={'15px'} ml={13}/>
                        </Wrapper>
                        {
                            title !== '전체 동의하기' &&
                                <Wrapper style={{transform: [{rotateX: visible ? '0deg' : '180deg'}]}}>
                                    <Img src={require('../../public/image/common/icon-arrow-bottom.png')} width={24} height={24}
                                         onPress={clickVisible}/>
                                </Wrapper>
                        }
                    </Wrapper>
                </TouchableOpacity>
            </Wrapper>
    ), []);

    const DetailListBox = useCallback(({title, value, type}: {title: string, value: any, type: string}) => {
        // 리스트 내부
        return (
            <TouchableOpacity activeOpacity={1}
                              style={{paddingVertical: 5}}
                              onPress={() => navigation.navigate('TosScreen', {type: type})}>
                <Wrapper row w between>
                    <Wrapper row w>
                        {
                            value?
                                <Img src={require('../../public/image/component/terms-check-on.png')} width={19} height={20} />
                                :
                                <Img src={require('../../public/image/component/terms-check-off.png')} width={19} height={20} />
                        }
                        <Txt size={'xs'} ml={1}>{title}</Txt>
                    </Wrapper>
                        <Img src={require('../../public/image/icon/ic-path.png')}
                             width={8}
                             height={20}
                             resizeMode={'contain'} />
                </Wrapper>
            </TouchableOpacity>
        )
    }, []);


    const clickSubmit = useCallback(() => {
        navigation.navigate('PaymentTypeScreen');
    }, []);

    return (
        <>
            <InstantLayout title={'이용약관'} >
                <Wrapper flexNum={1} d pt={20} between>
                    <Wrapper>
                        <AgreeAllBox>
                            <TitleCheckBox title={'전체 동의하기'} value={agreeAll} onPress={clickAgreeAll} />
                        </AgreeAllBox>
                        <ScrollView>
                            <Wrapper ml={17} mr={17}>
                                {
                                    termArr.map((item, index) => {
                                        return (
                                            <DetailCheckBox key={index} value={item} />
                                        )
                                    })
                                }
                            </Wrapper>
                        </ScrollView>
                    </Wrapper>
                    <Wrapper mb={20}>
                        <ButtonNew title={locales.btn.ok} type={'primary'} onPress={clickSubmit} disabled={submitDisabled} />
                    </Wrapper>
                </Wrapper>
            </InstantLayout>
        </>
    )
}
export default PaymentTermsScreen;

const AgreeAllBox = styled(Wrapper)`
  background-color: ${theme.color.white};
  padding: 15px 16px;
  border: 1px solid ${theme.color.lineGray5};
  border-radius: 6px;
`;
