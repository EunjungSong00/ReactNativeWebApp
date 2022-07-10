import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import Clipboard from "@react-native-clipboard/clipboard";
import theme from "../../public/theme";
import useTimer from "../../src/hook/useTimer";
import {getStorage} from "../../src/module/manageAsyncStorage";
import {getExpTime, numberComma, setYearMonthDayTime} from "../../src/module/formatter";
import orderRequestDtoApi from "../../src/api/order/orderRequestDtoApi";
import Txt from "../../src/component/atom/Txt";
import Wrapper from "../../src/component/atom/Wrapper";
import Img from "../../src/component/atom/Img";

interface IInfoListDom {
    title: string;
    text: string;
    line?: boolean;
    copy?: boolean;
    complete?: boolean;
    color?: boolean;
    en?: boolean;
    children?: ReactElement;
}

interface IOrderDeposit {
    deposit?: boolean; // payment에서 왔을때
    state: string;
    setStateType?: any;
    setDeliveryData?: any;
    data: any;
    setPopupText?: any;
    orderId?: string;
    navigation?: any;
}

/*입금대기중, 구매취소*/
const OrderDeposit = ({deposit, state, setStateType, setDeliveryData, data, orderId, setPopupText, navigation}: IOrderDeposit) => {
    const [refreshCount, setRefreshCount] = useState(0);
    const [timeOver, setTimeOver] = useState(false);
    const [AccountState, setAccountState] = useState('입금 확인 중');
    const [userName, setUserName] = useState('');
    const [info, setInfo] = useState(data);

    useEffect(() => {
        if (state === 'cancel') {
            setTimeOver(true);
            setAccountState('미입금');
        }
        setInfo(data);
        getUserInfo();
    }, [data])

    const getUserInfo = useCallback(async () => {
        const userInfo = await getStorage('carmerceUser');
        setUserName(userInfo.name)
    }, []);

    const clickRefresh = useCallback(() => {
        /*if (refreshCount < 3) {*/
            setRefreshCount(refreshCount + 1);
            const data = {
                orderId,
                navigation
            }
            orderRequestDtoApi(data)
                .then((res) => {
                    if (res?.queryOrder?.orderDto) {
                        console.log('orderRequestDtoApi', res?.queryOrder?.orderDto)
                        setInfo(res?.queryOrder?.orderDto);
                        if (res?.queryOrder?.orderDto.orderState === 'PREPARE_DELIVERY') {
                            setAccountState('입금완료');
                            if (!deposit) {
                                setStateType('ready');
                                setDeliveryData({
                                    deliveryDesiredTime: res?.queryOrder?.orderDto?.deliveryDesiredTime,
                                    deliveryAddressEnd: res?.queryOrder?.orderDto?.deliveryAddressEnd,
                                    deliveryDetailAddress: res?.queryOrder?.orderDto?.deliveryDetailAddress
                                });
                            }
                        }
                    }
                })
        /*} else {
            // 4번째 클릭
            setPopupText('잠시후 다시 시도해주세요.');
        }*/
    }, [refreshCount]);

    //타이머
    const Timer = useCallback(() => {
        //(new Date(info?.vaccountExpTime)).getTime() > (new Date().getTime()))
        //console.log('Timer', info)
        const timer = useTimer(getExpTime(info?.vaccountExpTime));
        const timerText = timer.minutes || timer.seconds ? `${timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes} : ${timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}` : '';

        useEffect(() => {
            if (timerText === '') {
                setTimeOver(true);
                setAccountState('미입금');
            } else {
                setTimeOver(false);
                setAccountState('입금 확인 중');
            }
        }, [timerText]);

        return (
            <>
                {
                    timerText?
                        <Txt size={'md'} color={'primary'} weight={'thick'} textAlign={'center'}>
                            {
                                deposit?
                                    `입금잔여시간 : ${timer.minutes? timer.minutes + `분 ` : ''}${timer.seconds}초`
                                    :
                                    `입금대기중 ${timerText} 남음`
                            }
                        </Txt>
                        :
                        null
                }
            </>
        )

    }, [info]);

    const InfoListDom = useCallback(({title, text, line, copy, complete, color, en, children}: IInfoListDom) => {
        const clickCopy = useCallback(() => {
            Clipboard.setString(text);
            setPopupText('복사되었어요.');
        }, [text]);

        return (
            <Wrapper paddingY={20} pb={line ? 15 : 0} border={'solid'} borderColor={theme.color.textGray}
                     borderBottomWidth={line ? 0.5 : 0}>
                <Wrapper row w between>
                    <Txt size={'sm'} weight={'medium'} color={deposit && !timeOver ? 'primary' : 'text'}>•  {title}</Txt>
                    <Wrapper row w>
                        {children}
                        <Txt size={'sm'} weight={'thick'} color={(!deposit && !color) || complete ? 'primary' : color? 'red' : 'text'} en={en}>{text}</Txt>
                    </Wrapper>
                </Wrapper>
                {
                    copy && !timeOver ?
                        <Txt textAlign={'right'} size={'xs'} weight={'medium'} color={'textGray'} mt={1} onPress={clickCopy}>복사하기</Txt>
                        :
                        null
                }
            </Wrapper>
        )
    }, [timeOver, AccountState]);

    const UserInfoDom = useCallback(() => (
        <>
            <Txt size={'xs'} weight={'thick'} mb={1}>{userName} 고객님</Txt>
            <Txt size={'xs'} weight={'medium'} lineHeight={18}>
                {!timeOver?
                    `현금으로 입금하실 계좌번호를 안내해드립니다.\n확인 후 해당금액을 입금해 주시기 바랍니다.`
                    :
                    `정해진 시간 내에 입금이 완료되지 않아,\n구매 취소 처리되었습니다. `
                }
            </Txt>
        </>
    ), [userName, timeOver]);

    return (
        <>
            {
                deposit?
                    <>
                        <UserInfoDom />
                    </>
                    :
                    null
            }
            <Wrapper borderColor={!timeOver? theme.color.primary : theme.color.lineGray} borderWidth={deposit? 0 : 1} backgroundColor={deposit? timeOver? theme.color.lineGray35 : theme.color.primary1 : ''} padding={25} borderRadius={15} mt={30} mb={15}>
                 {
                    info.orderState === 'PREPARE_DELIVERY' ?
                        <Txt size={'md'} color={'primary'} weight={'thick'} textAlign={'center'}>입금이 확인되었어요.</Txt>
                        :
                        !timeOver ?
                            info?.vaccountExpTime && <Timer />
                            :
                            <Txt size={'md'} color={'red'} weight={'thick'} textAlign={'center'}>구매가 취소되었어요.</Txt>
                }
                {
                    !deposit?
                        <Wrapper mt={25}>
                            <UserInfoDom />
                        </Wrapper>
                        :
                        null
                }
                {
                    !timeOver && !deposit?
                        <Wrapper row backgroundColor={theme.color.primary1} paddingY={10} paddingX={15} borderRadius={8} mt={20}>
                            <Txt size={'xs'} weight={'medium'} color={'primary'} mr={2}>•</Txt>
                            <Txt size={'xs'} weight={'medium'} color={'primary'} lineHeight={19} pr={15}>{`대기시간내에 해당 계좌로 잔금이 입금되지 않으면\n구매가 자동취소됩니다.`}</Txt>
                        </Wrapper>
                        :
                        null
                }
                <Wrapper mt={20}>
                    <InfoListDom title={'은행명'} text={info?.vaccountBankName || '-'} line />
                    <InfoListDom title={'가상계좌번호'} text={info?.vaccountNumber || '-'} line copy en />
                    <InfoListDom title={'예금주명'} text={info?.vaccountName || '-'} line />
                    <InfoListDom title={'입금액'} text={info?.vaccountAmt? `${numberComma(info?.vaccountAmt)}원` : '-'} line en />
                    <InfoListDom title={'입금상태'} text={AccountState} color={timeOver} complete={AccountState === '입금완료'}>
                        {
                            !timeOver && AccountState !== '입금완료'?
                                <Wrapper mr={10}>
                                    <Img src={require('../../public/image/payment/deposit-loading.png')} width={20} height={20} onPress={clickRefresh} />
                                </Wrapper>
                                :
                                undefined
                        }
                    </InfoListDom>
                </Wrapper>
            </Wrapper>
            {
                deposit && info?.vaccountExpTime?
                    <Wrapper marginY={10}>
                        <Txt size={'xs'} color={'red'} weight={'medium'} textAlign={'center'} lineHeight={18}>
                            {`${setYearMonthDayTime(info?.vaccountExpTime)}까지 ${!timeOver? `입금되지 않으면\n구매가 자동취소됩니다.` : `입금이 완료되지 않아\n구매가 자동취소되었습니다.`}`}
                        </Txt>
                    </Wrapper>
                    :
                    null
            }
        </>
    )
}
export default OrderDeposit;