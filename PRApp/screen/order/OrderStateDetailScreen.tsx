import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from "react-native";
import theme from "../../public/theme";
import usePopup from "../../src/hook/usePopup";
import useTimer from "../../src/hook/useTimer";
import InstantLayout from "../../src/component/template/InstantLayout";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import {dateRemoveTime, getExpTime, numberComma} from "../../src/module/formatter";
import {getStorage} from "../../src/module/manageAsyncStorage";
import PurchaseHistoryThumb from "../purchaseHistory/PurchaseHistoryThumb";
import OrderDeliveryTop from "OrderDeliveryTop";
import OrderDeposit from "OrderDeposit";
import OrderCompletePopup from "OrderCompletePopup";
import CarDetailInfo from "CarDetailInfo";
import {INavigationRoute} from "OrderStateScreen";
import confirmPurchaseApi from "../../src/api/order/confirmPurchaseApi";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import {PaymentTitle} from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Img from "../../src/component/atom/Img";

const topStatus: any = {
    ready: 'ready',
    delivery: 'ing',
    complete: 'complete',
    refundReception: 'ready',
    refundConfirm: 'confirm',
    refundDelivery: 'ing',
    refundComplete: 'complete'
}

interface IInfoListDom {
    title: string;
    text: string;
    line?: boolean;
    en?: boolean;
}

interface IPriceListDom {
    title: string;
    text: string;
    primary?: boolean;
    carPrice?: boolean;
}

/*주문상태 배송*/
const OrderStateDetailScreen = ({navigation, route}: INavigationRoute) => {
    const detailData = route?.params?.data;
    const [stateType, setStateType] = useState<string>(route?.params?.data.stateType);
    const [deliveryData, setDeliveryData] = useState<any>();
    const status = topStatus[stateType] || 'ready'
    const [orderCompletePopupVisible, setOrderCompletePopupVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const {Popup, setPopupText} = usePopup();

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = useCallback(async () => {
        const userInfo = await getStorage('carmerceUser');
        setUserName(userInfo?.name);
    }, []);

    const InfoListDom = useCallback(({title, text, line, en}: IInfoListDom) => (
        <Wrapper row borderBottomWidth={line? 1 : 0} borderColor={theme.color.lineGray5} paddingY={20}>
            <Wrapper width={110}>
                <Txt size={'sm'} weight={'medium'}>•  {title}</Txt>
            </Wrapper>
            <Wrapper flexNum={1}>
                <Txt size={'sm'} weight={'medium'} en={en}>{text || '-'}</Txt>
            </Wrapper>
        </Wrapper>
    ), []);

    const PriceListDom = useCallback(({title, text, primary, carPrice}: IPriceListDom) => (
        <Wrapper row between mb={10}>
            <Txt size={primary? 'md' : 'sm'} weight={primary? 'thick' : 'regular'} color={primary? 'primary': 'text'}>{title}</Txt>
            <Txt size={primary? 'md' : 'sm'} weight={primary? 'thick' : 'regular'} color={primary? 'primary': 'text'} en>{text && !['null', 'undefined'].includes(text) ? text === '0'? text : numberComma(carPrice? text + '0000' : text) : '- '}원</Txt>
        </Wrapper>
    ), []);

    //타이머 - 환불가능시간
    const Timer = useCallback(() => {
        const timer = useTimer(getExpTime(detailData?.refuseRefundableAt));
        const day = parseInt(String(timer.minutes / 60 / 24));
        const hour = parseInt(String((timer.minutes - (day * 24 * 60)) / 60));
        const minutes = timer.minutes - (day * 24 * 60) - (hour * 60);
        const timerText = timer.minutes || timer.seconds ? `${timer.minutes > (60 * 24) ? `${day}일 ${hour}시간 ${minutes}분` : timer.minutes > 60 ? `${hour}시간 ${minutes}분` : `${timer.minutes > 0 ? `${timer.minutes}분` : '' }`}` : '';

        return (
            <>
                <TouchableOpacity activeOpacity={1} onPress={() => clickRefund(timerText)}>
                    <Wrapper row between paddingX={23} paddingY={17} borderWidth={1} borderColor={timerText? theme.color.text : theme.color.lineGray} borderRadius={8}>
                        {
                            timerText?
                                <>
                                    <Txt size={'md'} weight={'thick'}>환불가능시간</Txt>
                                    <Wrapper row>
                                        <Txt size={'md'} weight={'thick'}>{`${timerText} 남음`}</Txt>
                                        <Img src={require('../../public/image/common/icon-arrow-right-bk.png')} width={19} height={24} />
                                    </Wrapper>
                                </>
                            :
                                <Wrapper flexNum={1} w>
                                    <Txt size={'md'} weight={'thick'} color={theme.color.lineGray}>환불가능시간이 초과되었습니다.</Txt>
                                </Wrapper>
                        }
                    </Wrapper>
                </TouchableOpacity>
            </>
        )
    }, []);

    const clickMyCar = useCallback(() => {
        const data = {
            orderId: detailData.orderId,
            navigation
        }
        confirmPurchaseApi(data)
            .then((res) => {
                console.log(res)
                if (res.confirmPurchase) {
                    setOrderCompletePopupVisible(true);
                }
            })
    }, []);

    const clickOrderCompletePopupClose = useCallback(() => {
        setOrderCompletePopupVisible(false);
        navigation.goBack();
    }, []);

    const clickRefund = useCallback((value: string) => {
        value && navigation.navigate('OrderRefundScreen', {data: detailData});
    }, []);

    return (
        <>
            <InstantLayout title={'주문상태'}>
                <Wrapper flexNum={1} backgroundColor={theme.color.white}>
                    <ScrollViewBetween>
                        <Wrapper>
                            {
                                !['waiting', 'cancel'].includes(stateType)?
                                    <OrderDeliveryTop data={detailData} type={['refundReception', 'refundConfirm', 'refundDelivery', 'refundComplete'].includes(stateType) ? 'refund' : 'delivery'} status={status} navigation />
                                    :
                                    <PurchaseHistoryThumb {...detailData} navigation />
                            }
                            {
                                ['ready', 'delivery'].includes(stateType)?
                                <Wrapper d mb={15} marginX={2} row>
                                    <Txt size={'sm'} weight={'thick'}>
                                        {userName}
                                        <Txt size={'sm'} weight={'medium'}> 고객님의 차량을 안전하게 {stateType === 'ready'? '배송하기위해 준비중' : '배송중'}입니다.</Txt>
                                    </Txt>
                                </Wrapper>
                                    :
                                    null
                            }
                            {
                                ['complete'].includes(stateType)?
                                    <Wrapper d mb={15}>
                                        <ButtonNew title={'내차로 만들기'} type={'line'} onPress={clickMyCar} />
                                    </Wrapper>
                                    :
                                    null
                            }
                            {
                                !['waiting', 'cancel'].includes(stateType)?
                                    <Wrapper backgroundColor={theme.color.backgroundGray} height={10} />
                                    :
                                    null
                            }
                            {
                                ['complete'].includes(stateType) ?
                                    <>
                                        <CarDetailInfo id={detailData?.vehicleId} navigation={navigation} />
                                        <Wrapper height={10} backgroundColor={theme.color.backgroundGray} />
                                        <Wrapper d pt={40}>
                                            <Timer />
                                            <Wrapper marginY={40} w>
                                                <PaymentTitle title={'환불시 주의사항'} />
                                                <Txt size={'xs'} weight={'medium'} mt={16}>
                                                    {`차량을 인수한 날로부터 7일의 환불기간 내(인수일 1일포함)\n차량을 반환하여야 환불이 가능합니다.\n환불처리는 환불기간 내에 당사에게 환불접수 를 하는 고객에 한해 처리됩니다.`}
                                                </Txt>
                                            </Wrapper>
                                        </Wrapper>
                                    </>
                                    :
                                    null
                            }
                            <Wrapper d marginX={2}>
                                {
                                    ['delivery'].includes(stateType)?
                                        <InfoListDom title={'배송기사'} text={`${detailData?.deliveryDriverName || '-' }\n${detailData?.deliveryDriverPhoneNumber || '-' }`} line />
                                        :
                                        null
                                }
                                {
                                    ['ready', 'delivery'].includes(stateType)?
                                        <>
                                            <InfoListDom title={'배송요청일'} text={deliveryData? dateRemoveTime(deliveryData?.deliveryDesiredTime) : detailData?.deliveryDesiredTime && dateRemoveTime(detailData?.deliveryDesiredTime)} line en />
                                            <InfoListDom title={'배송지'} text={deliveryData ? deliveryData?.deliveryAddressEnd + ' ' + (deliveryData?.deliveryDetailAddress || '') : detailData?.deliveryAddressEnd + ' ' + (detailData?.deliveryDetailAddress || '')} />
                                        </>
                                    :
                                    null
                                }
                                {
                                    ['refundReception', 'refundConfirm', 'refundDelivery', 'refundComplete'].includes(stateType)?
                                        <>
                                            <InfoListDom title={'환불접수일'} text={detailData?.refundOrderTime && dateRemoveTime(detailData?.refundOrderTime)} line />
                                            <InfoListDom title={'환불사유'} text={detailData?.refundReasonFirst === '마음이 변했어요. (단순 변심)' ? '구매의사 파기' : '차량 결함'} line />
                                            <InfoListDom title={'상세사유'} text={detailData?.refundReasonDetail} line={['refundDelivery', 'refundComplete'].includes(stateType)} />
                                            {
                                                stateType === 'refundConfirm' &&
                                                <>
                                                    <Wrapper padding={18} backgroundColor={detailData?.isReviewRefundSuccess? theme.color.primary1 : theme.color.red1} borderRadius={5} mt={20}>
                                                        <PaymentTitle title={'검토결과'} />
                                                        <Wrapper row mt={7}>
                                                            <Txt size={'sm'} weight={'bold'} color={detailData?.isReviewRefundSuccess? 'primary' : 'red'} mr={10}>[{detailData?.isReviewRefundSuccess? '가능' : '불가'}]</Txt>
                                                            <Wrapper flexNum={1}>
                                                                <Txt size={'sm'} weight={'medium'} color={detailData?.isReviewRefundSuccess? 'primary' : 'red'}>{detailData?.refuseRefundableMessage || '-'}</Txt>
                                                            </Wrapper>
                                                        </Wrapper>
                                                    </Wrapper>
                                                    {
                                                        !detailData?.isReviewRefundSuccess ?
                                                            <Wrapper mt={20}>
                                                                <ButtonNew title={'구매 확정'} type={'line'} onPress={clickMyCar}/>
                                                            </Wrapper>
                                                            :
                                                            null
                                                    }
                                                </>
                                            }
                                            {
                                                stateType === 'refundDelivery' &&
                                                    <Wrapper mb={40}>
                                                        <InfoListDom title={'반납장소'} text={detailData?.vehicleReturnAddress + ' ' + detailData?.vehicleReturnAddressDetail} line />
                                                        <InfoListDom title={'반납일시'} text={detailData?.deliveryDesiredTime} line />
                                                        <InfoListDom title={'기사정보'} text={detailData?.deliveryDriverName + detailData?.deliveryDriverPhoneNumber} line />
                                                        <InfoListDom title={'이용료'} text={detailData?.deliveryPrice} />
                                                    </Wrapper>
                                            }
                                            {
                                                stateType === 'refundComplete' &&
                                                <Wrapper mb={40}>
                                                    <InfoListDom title={'이용료'} text={detailData?.deliveryPrice} line />
                                                    <InfoListDom title={'환불완료일'} text={detailData?.reviewRefund2CompletedAt} />
                                                </Wrapper>
                                            }
                                        </>
                                        :
                                        null
                                }
                            </Wrapper>
                            {
                                ['waiting', 'cancel'].includes(stateType)?
                                    <Wrapper d paddingY={20} borderTopWidth={1} borderColor={theme.color.lineGray5}>
                                        <PaymentTitle title={'결제금액'} />
                                        <Wrapper mt={15}>
                                            <PriceListDom title={'차량가격'} carPrice text={JSON.parse(detailData?.vehicleDetailJson)?.vehicle?.salePrice} />
                                            <PriceListDom title={'취득세'} text={`${detailData?.vehicleAcquisitionTax}`} />
                                            <PriceListDom title={'공채할인비'} text={detailData?.vehicleBondSellingPrice && detailData?.vehicleBondLinkedCommission ? `${(Number(detailData.vehicleBondSellingPrice) + Number(detailData.vehicleBondLinkedCommission))}` : '-'} />
                                            <PriceListDom title={'차량관리비'} text={`${detailData?.vehicleManagementCost}`} />
                                            <PriceListDom title={'단기운전자 보험료'} text={`${detailData?.vehicleDriverInsurance}`} />
                                            <PriceListDom title={'이전등록대행수수료'} text={`${detailData?.vehicleAgencyPrice}`} />
                                            <PriceListDom title={'카머스 서비스 이용료'} text={`${detailData?.vehicleServiceCommission}`} />
                                            <PriceListDom title={'배송비'} text={`${detailData?.deliveryPrice}`} />
                                        </Wrapper>
                                        <Wrapper mt={10} pt={15} borderTopWidth={1} borderColor={theme.color.lineGray5}>
                                            <PriceListDom title={'총 구매 비용'} text={detailData?.vaccountAmt? `${numberComma(detailData?.vaccountAmt)}원` : '-'} primary />
                                        </Wrapper>
                                        <OrderDeposit state={stateType} setStateType={setStateType} setDeliveryData={setDeliveryData} data={detailData} setPopupText={setPopupText} orderId={detailData?.orderId} navigation />
                                    </Wrapper>
                                    :
                                    null
                            }
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
            {
                orderCompletePopupVisible?
                    <OrderCompletePopup clickClose={clickOrderCompletePopupClose} navigation={navigation} />
                    :
                    null
            }
        </>
    )
}
export default OrderStateDetailScreen;