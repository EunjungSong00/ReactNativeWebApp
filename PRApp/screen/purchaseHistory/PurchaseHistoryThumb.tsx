import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from "react-native";
import { useIsFocused } from '@react-navigation/native';
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";
import Config from "react-native-config";
import useTimer from "../../src/hook/useTimer";
import theme from "../../public/theme";
import {dateRemoveTime, getExpTime, numberComma, setPricePercent} from "../../src/module/formatter";
import {stateList} from "../order/OrderStateScreen";
import actionWishApi from "../../src/api/mypage/actionWishApi";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import Img from "../../src/component/atom/Img";
import ButtonNew from "../../src/component/atom/ButtonNew";

interface ICarListThumb {
    type?: 'purchase' | 'order' | 'purchaseView';
    like?: boolean;
    review?: boolean;
    onPressList?: () => void;
    onPressReview?: () => void;
    onPressState?: (props: any) => void;
    vaccountExpTime?: string;
    vehicleDetailJson?: string;
    orderState?: string;
    orderTime?: string;
    navigation: StackNavigationProp;
}

/*차량 공통 thumb*/
const PurchaseHistoryThumb = ({type, like, review, onPressList, onPressReview, onPressState, ...props}: ICarListThumb) => {
    const [likeState, setLikeState] = useState<boolean | undefined>(like);
    const [stateType, setStateType] = useState<string>('');
    const vaccountExpTime: string = props?.vaccountExpTime;
    const vehicleData: any = props?.vehicleDetailJson && JSON.parse(props?.vehicleDetailJson).vehicle;
    const isFocused = useIsFocused();
   // console.log('thumb', props)

    useEffect(() => {
        const orderState: string = props?.orderState;
        if (orderState) {
            if (['WAITING_FOR_DEPOSIT'].includes(orderState)) {
                setStateType('waiting'); // 입금확인중
            } else if (['PREPARE_DELIVERY', 'DELIVERY_REQUEST_COMPLETED'].includes(orderState)) {
                setStateType('ready'); // 배송준비중
            } else if (['DELIVERY_IN_PROGRESS'].includes(orderState)) {
                setStateType('delivery'); // 배송중
            } else if (['DELIVERY_COMPLETE'].includes(orderState)) {
                setStateType('complete'); // 배송완료
            } else if ([
                'REFUND_RECEPTION', // 환불접수
            ].includes(orderState)) {
                setStateType('refundReception'); // 환불접수
            } else if ([
                'REFUND_PAYMENT_COMPLETE_1', // 환불검토완료1차
                'REFUND_PAYMENT_COMPLETE_2', // 환불검토완료2차
                'CALCULATING_REFUND_AMOUNT', // 환불금액계산중
            ].includes(orderState)) {
                setStateType('refundConfirm'); // 사유검토
            } else if ([
                'REFUND_PREPARE_DELIVERY', // 환불-탁송준비
                'REFUND_DELIVERY_IN_PROGRESS', //환불-배송중
            ].includes(orderState)) {
                setStateType('refundDelivery'); // 반납중
            } else if ([
                'REFUND_RETURN_COMPLETED', //환불-반납완료
                'REFUND_PAYMENT_COMPLETED', //환불-지급완료
                ].includes(orderState)) {
                setStateType('refundComplete'); // 반납완료
            } else if ([
                'CANCEL_ORDER', //주문취소
                'REFUND_CANCEL_DELIVERY', //환불-배송취소
                'CANCEL_DELIVERY' //배송취소
            ].includes(orderState)) {
                setStateType('cancel'); // 구매취소
            } else {
                setStateType('purchaseHistory');
            }
        }
    }, []);

    // 타이머
    const Timer = useCallback(() => {
        const timer = useTimer(getExpTime(vaccountExpTime));
        const timerText = timer.minutes || timer.seconds ? `${timer.minutes} : ${timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}` : '';

        useEffect(() => {
            if (timerText === '' && stateType !== 'cancel') {
                setStateType('cancel');
            }
        }, [timerText, stateType]);

        return (
            <>
                {
                    timerText?
                        <Txt children={timerText + ' 남음'} size={'xs'} weight={'bold'} color={'primary'} ml={1} />
                        :
                        null
                }
            </>
        )
    }, []);

    // 찜하기 클릭
    /*const clickLike = useCallback(() => {
        setLikeState(!likeState);
        actionWishApi(props.vehicleId, 'CAR', props.navigation)
            .then((res) => {
                console.log('actionWishApi', res)
            })
    }, [likeState]);*/

    return (
        <>
            <Wrapper d pt={20} pb={25} mb={10} backgroundColor={theme.color.white}>
                <TouchableOpacity activeOpacity={1} onPress={onPressList || undefined}>
                    <>
                        {
                            type === 'purchase' && props.orderTime ? //구매이력
                                <Wrapper row between mb={10}>
                                    <Txt size={'sm'} color={stateType === 'purchaseHistory' ? 'primary' : 'text'}
                                         weight={'thick'}>{stateType === 'purchaseHistory' ? '내차' : '환불완료'}</Txt>
                                    <Txt size={'xs'} color={'textGray'} weight={'medium'}>구매일 {dateRemoveTime(props.orderTime)}</Txt>
                                </Wrapper>
                                :
                                null
                        }
                        <Wrapper row>
                            <Wrapper>
                                {
                                    vehicleData?.imageList[0]?.name?
                                        <Img url={Config.NEXT_PUBLIC_IMAGE_URL + vehicleData?.imageList[0]?.name} width={140} height={140}/>
                                        :
                                        <Wrapper width={140} height={140} backgroundColor={'#eee'} />
                                }
                                {/*{
                                    like?
                                        <Wrapper position={'absolute'} style={{bottom: 8, right: 8}}>
                                            <Img src={
                                                likeState ?
                                                    require('@public/image/component/icon-liked-on.png')
                                                    :
                                                    require('@public/image/component/icon-liked-off.png')}
                                                 width={22} height={22} onPress={clickLike} />
                                        </Wrapper>
                                        :
                                        null
                                }*/}
                            </Wrapper>
                            <Wrapper ml={25} flexNum={1}>
                                <Txt children={`${vehicleData?.modelYear || ''} ${vehicleData?.manufacturer || ''} ${vehicleData?.modelName || ''}` || '-'} weight={'bold'} size={'sm'} mt={10} mb={1}/>
                                <Txt children={vehicleData?.modelTrim || '-'} size={'xs'} weight={'medium'}/>
                                <Wrapper row>
                                    <Txt children={`${(vehicleData?.mileage && numberComma(vehicleData?.mileage)) || '- '}km`} size={'xs'} weight={'medium'} mr={1}/>
                                    <Txt children={vehicleData?.fuel || '-'} size={'xs'} weight={'medium'}/>
                                </Wrapper>
                                <Wrapper row mt={10} opacity={0.5}>
                                    <Txt children={'신차가'} size={'xs'} weight={'medium'} mr={1}/>
                                    <Txt children={`${(vehicleData?.factoryPrice && numberComma(vehicleData?.factoryPrice?.toString().slice(0, -4))) || '- '}만원`} size={'xs'} weight={'medium'}
                                         lineThrough/>
                                </Wrapper>
                                <Wrapper row w mt={1}>
                                    <Txt size={'sm'} color={'red'} weight={'medium'}>
                                        {vehicleData?.factoryPrice && vehicleData?.salePrice && setPricePercent(vehicleData?.factoryPrice?.toString().slice(0, -4), vehicleData?.salePrice) ||
                                            '- '}%
                                    </Txt>
                                    <Wrapper row w ml={2}>
                                        <Txt size={'sm'} weight={'thick'} children={` ${(vehicleData?.salePrice && numberComma(vehicleData?.salePrice)) || ' - '}`}/>
                                        <Txt size={'sm'} weight={'medium'} children={'만원'}/>
                                    </Wrapper>
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                    </>
                </TouchableOpacity>
                {
                    (type === 'purchase' || type === 'purchaseView') ? //구매이력
                        <Wrapper mt={25}>
                            <ButtonNew title={!review ? '리뷰 작성' : '리뷰 작성 완료'} type={!review ? 'line' : 'line'}
                                       onPress={onPressReview} disabled={review}/>
                        </Wrapper>
                        :
                        null
                }
                {
                    type === 'order' && stateList[stateType] ? // 주문상태
                        <TouchableOpacity activeOpacity={1} onPress={() => onPressState ? onPressState({...props, ...{stateType}}) : undefined}>
                            <Wrapper row w height={40} paddingX={10} mt={15} between
                                     style={{borderWidth: 1, borderRadius: 4, borderColor: theme.color[stateList[stateType]?.color]}}>
                                <Wrapper row>
                                    <Txt size={'xs'} color={stateList[stateType]?.color} weight={'medium'}>
                                        {`구매일  ${dateRemoveTime(props.orderTime)}`}
                                    </Txt>
                                </Wrapper>
                                <Wrapper row w>
                                    <Txt children={stateList[stateType]?.title} size={'xs'} weight={'bold'} color={stateList[stateType]?.color}/>
                                    {
                                        props.vaccountExpTime && stateType === 'waiting' && isFocused  ? <Timer /> : null
                                    }
                                    <Img src={stateList[stateType].image} width={19} height={24}/>
                                </Wrapper>
                            </Wrapper>
                        </TouchableOpacity>
                        :
                        null
                }
            </Wrapper>
        </>
    )
}

export default PurchaseHistoryThumb;