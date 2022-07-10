import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import IRootStackParamList from "../../src/interface/IRootStackParamList";
import InstantLayout from "../../src/component/template/InstantLayout";
import Wrapper from "../../src/component/atom/Wrapper";
import Img from "../../src/component/atom/Img";
import theme_new from "../../public/theme_new";``
import Txt from "../../src/component/atom/Txt";
import {Platform, ScrollView, TouchableOpacity} from "react-native";
import styled from "@emotion/native";
import theme from "../../public/theme";
import ButtonNew from "../../src/component/atom/ButtonNew";
import {useStores} from "../../src/module/store";
import {numberComma, phoneNumberHypen} from "../../src/module/formatter";
import {observer} from "mobx-react";
import usePopup from "../../src/hook/usePopup";
import shippingAddressesApi from "../../src/api/cart/shipping/shippingAddressesApi";
import {getStorage, setStorage} from "../../src/module/manageAsyncStorage";
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';
import { NavigationRoute } from 'react-navigation';
import { useIsFocused } from '@react-navigation/native';
import useWishEl from '../../src/hook/useWishEl';
import prepareCashOrderApi from '../../src/api/cart/prepareCashOrderApi';
import calculateDeliveryPriceApi from "../../src/api/payment/calculateDeliveryPriceApi";
import incidentalExpenseApi from "../../src/api/cart/incidentalExponseApi";
import cancelOrderApi from "../../src/api/payment/cancelOrderApi";
import checkWishApi from "../../src/api/cart/checkWishApi";

const PurchaseScreen = ({navigation, route}: {navigation: StackNavigationProp; route: NavigationRoute}) => {
    const [displayAdditionalFee, setDisplayAdditionalFee] = useState(false); // 부가세 보이기 유무
    const [isWish, setIsWish] = useState();
    const {paymentStore} = useStores();
    const {vehicleStore} = useStores();
    const {shippingStore} = useStores();
    const android = Platform.OS === 'android';
    const vehicleId = vehicleStore?.vehicleId;
    const shippingId = shippingStore?.shippingId;
    const newShippingData = shippingStore?.fullAddress;
    const vehicleData = vehicleStore?.vehicleInfo;
    const vehiclePrice =  vehicleData?.salePrice;
    const [vehicleIncidentalExpense, setVehicleIncidentalExpense] = useState();
    const [shippingData, setShippingData] = useState(); // 주소
    const [shippingDate, setShippingDate] = useState(''); // 날짜
    const [shippingFee, setShippingFee] = useState();
    const isFocused = useIsFocused();
    const {Popup, setPopupText} = usePopup();

    useEffect(() => {
        isFocused && getShippingAddress();
        isFocused && getWishMasters();
    },[isFocused]);

    useEffect(() => {
        isFocused && getIncidentalExpense(Number(vehicleId));
    },[isFocused])

    useEffect(() => {
        const newShippingDate = shippingStore?.shippingDate?.desiredDate;
        isFocused && setShippingDate(newShippingDate);
    }, [isFocused]);

    useEffect(() => {
        isFocused && getOrderId();
    }, [isFocused]);

    const getOrderId = useCallback(async () => {
        const orderId = await getStorage('orderId');
        if (orderId) {
            cancelOrderId(orderId);
        }
    } ,[]);

    const cancelOrderId = useCallback((orderId: string) => {
        cancelOrderApi({orderId, navigation})
            .then((res) => {
                console.log('cancelOrderApi', res)
                if (res?.cancelOrder) {
                    setStorage('orderId', '');
                    paymentStore.setPaymentOrderId('');
                }
            })
    }, []);

    // 구매할 상품 눌렀을 때
    const onPressThumb = useCallback(() => {
        navigation.navigate('/Home');
    },[]);

    // 가격 더미 데이터
    const PriceDate = {
        vehicleShippingFee: '100000'   // TODO: 차량 탁송비 API 오면 변경 할 것
    }

    // wishIds 구하기
    // FIXME: useWish initialValue로 지정하기
    const getWishMasters = useCallback(async() => {
        const query = {targetIds: Number(vehicleId), navigation: navigation}
        await checkWishApi(query)
            .then((response) => {
                console.log('checkWishApi res:', response.checkWish[0]);
                response && setIsWish(response && response.checkWish && response.checkWish[0]);
            })
    }, []);

    // getIncidentalExpense
    const getIncidentalExpense = useCallback(async (id: number) => {
        await incidentalExpenseApi(Number(id), navigation).then((res) => {
            console.log('incidentalExpenseApi res:', res);
            const list = res?.incidentalExpense;
            setVehicleIncidentalExpense(list);
        });
    }, [])

    // default 주소 구하기
    const getShippingAddress = useCallback(async () => {
        await shippingAddressesApi(navigation)
            .then((res) => {
                const defaultShipping = res && res.shippingAddresses.filter((el:any) => el && el.isDefault)[0];
                setShippingData(defaultShipping);
                // 차량배송비
                if (defaultShipping) {
                    const deliveryData = {
                        orderId: '0',
                        endAddr: defaultShipping.address,
                        navigation
                    }
                    calculateDeliveryPriceApi(deliveryData).then((response) => {
                        const price = response && response.calculateDeliveryPrice && response.calculateDeliveryPrice.data && response.calculateDeliveryPrice.data.price;
                        const additionalPrice = response && response.calculateDeliveryPrice && response.calculateDeliveryPrice.data && response.calculateDeliveryPrice.data.additionalPrice;
                        if (additionalPrice) {
                            const totalPrice = price + additionalPrice;
                            setShippingFee(totalPrice);
                        } else {
                            setShippingFee(price);
                        }
                    })
                }
            })
    }, []);

    // 배송지 수정
    const onPressDeliveryAddressChange = useCallback(() => {
        navigation.navigate('ManageShippingListScreen');
    }, []);

    // 배송일자 수정
    const onPressDeliveryDateChange = useCallback(() => {
        navigation.navigate('PickShippingDateScreen');
    },[navigation]);

    // 배송지 등록
    const onPressRegistrationDeliveryInfo = useCallback(() => {
        navigation.navigate('EnterShippingInfoScreen');
    },[]);

    // 배송 일자 등록
    const onPressRegistrationDeliveryDate = useCallback(() => {
        navigation.navigate('PickShippingDateScreen');
    },[]);

    // 부대비용 클릭 시
    const onPressAdditionalFeeBill = useCallback(() => {
        setDisplayAdditionalFee(!displayAdditionalFee);
    },[displayAdditionalFee]);

    // 구매 클릭 시
    const onPressPayment = useCallback((value) => {
        console.log('value', value)
        if(!shippingData) {
            setPopupText('배송지 정보를 입력해주세요.')
        } else if (!shippingDate) {
            setPopupText('희망 배송일자를 입력해주세요.')
        } else {
            // paymentStore.setPaymentSelect(value);
            // navigation.navigate('PaymentTermsScreen');
            setPopupText('서비스 준비중이에요.')
        }
    }, [shippingData, shippingDate]);

    // 현금 구매
    const onPressCashOrder = useCallback( async() => {
        if (!shippingData) {
            setPopupText('배송지 정보를 입력해주세요.')
        } else if (!shippingDate) {
            setPopupText('희망 배송일자를 입력해주세요.')
        } else {
            const userId = await getStorage('carmerceUser');
            const id = userId && userId.id;
            // 주문준비 - 현금구매
            prepareCashOrderApi(id, Number(vehicleId), navigation)
                .then((response) => {
                    console.log('prepareCashOrderApi', response);
                    if (response.prepareCashOrder) {
                        const orderId = response.prepareCashOrder.orderId;
                        const deliveryData = {
                            orderId: orderId,
                            endAddr: shippingData.address,
                            navigation
                        }
                        // 배송 예상비용 조회
                        calculateDeliveryPriceApi(deliveryData)
                            .then((res) => {
                                console.log('calculateDeliveryPriceApi', res)
                                if (res?.calculateDeliveryPrice) {
                                    const data = {
                                        ...res?.calculateDeliveryPrice.data,
                                        ...{
                                            addressStart: '서울특별시 서초구 사임당로 171',
                                            addressEnd: deliveryData.endAddr,
                                            detailAddress: shippingData.detailAddress,
                                            desiredTime: shippingDate + ' ' + shippingStore?.shippingDate?.desiredTime,
                                            recipientName: shippingData?.recipientName,
                                            zipCode: shippingData?.zipCode,
                                            recipientPhoneNumber: shippingData?.recipientPhoneNumber,
                                            vAmount: 3000000, //차값
                                        }
                                    }
                                    paymentStore.setPaymentDeliveryPrice(data);
                                    paymentStore.setPaymentSelect('현금');
                                    navigation.navigate('PaymentTermsScreen', {orderId});

                                }
                            })
                    }
                })
        }
    },[shippingData, shippingDate])

    // 구매하기 상품 Component
    const onPressItem = useCallback((id: number) => {
        // console.log('isCheckedId', id);
        navigation.navigate('SearchDetailScreen', {id: id})
    },[])

    const ProductThumb = useCallback(({isWish, id, manufacturer, modelYear, modelName, modelTrim, mileage, transmission, price, salePrice, imageList, onPressVehicleId}) => {
        const titleOverflow = modelName.length >= 30 ;
        const newTitle = modelName.substring(0, 29) + '..';
        const wish = useWishEl({initialValue: isWish, id, type: 'medium'}, navigation);

        return (

            <Wrapper row>
                <Wrapper>
                    <TouchableOpacity onPress={onPressVehicleId} activeOpacity={1}>
                        {imageList ? (
                            <Wrapper width={140} height={140}>
                                <Img src={{uri: `https://dev-api.carmerce.co.kr/dev/cloud/storage?name=${imageList}`}} width={140} height={140}/>
                            </Wrapper>
                        ) : (
                            <Wrapper bgColor={theme.color.backgroundGray} width={140} height={140} />
                        )}

                    </TouchableOpacity>
                    <Wrapper style={{zIndex: 9, position: 'absolute', bottom: 5, right: 5}}>
                        <wish.Element />
                    </Wrapper>
                </Wrapper>
                <TouchableOpacity onPress={onPressVehicleId} activeOpacity={1}>
                    <Wrapper ml={25}>
                        <Txt children={`${modelYear ? modelYear : '-'}` + `${manufacturer ? manufacturer : '-'}` + `${modelName ? modelName : '-'}`} weight={'medium'} size={'sm'} mt={10}/>
                        <Wrapper width={175}>
                            <Txt children={modelTrim ? modelTrim : '-'} size={'xs'}/>
                        </Wrapper>
                        <Wrapper row>
                            <Txt children={mileage ? numberComma(Number(mileage)) + 'km' : '- km'} size={'xs'} />
                            <Txt children={transmission ? transmission : '-'} size={'xs'} />
                        </Wrapper>
                        <Wrapper row mt={10}>
                            <Txt children={'신차가'} size={'xs'}/>
                            {/*newCarPrice*/}
                            <PriceTxt children={price? numberComma(price) + ' 만원' : '- 만원'} />
                        </Wrapper>
                        <Wrapper row w mt={1}>
                            {/*discountRate*/}
                            <DiscountTxt children={ salePrice && price ? Math.floor( ( salePrice / price)* 100) + '%' : '- %'}/>
                            <Wrapper row w ml={2}>
                                {/*salePrice*/}
                                <SalePriceTxt children={salePrice ? numberComma(Number(salePrice)) : '-'} />
                                <WonTxt children={' 만원'} />
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>
                </TouchableOpacity>
            </Wrapper>
    )
    }, []);    // }

    // 정보 변경 버튼
    const InfoChangeBtn = useCallback(({onPress}) => (
        <TouchableOpacity onPress={onPress}>
            <BtnWrapper w h>
                <Txt children={'정보변경'} size={'xs'} />
            </BtnWrapper>
        </TouchableOpacity>
    ), []);

    // DeliveryDom 배송정보 있을때
    const DeliveryDom = () => {
        const containWidth = android ? 220 : 245;
        return(
            <Wrapper pt={14} pb={17} paddingX={17}>
                {shippingData ? (
                    <Wrapper row between>
                        <Wrapper width={containWidth}>
                            <Wrapper row>
                                <Txt children={'배송지'} size={'sm'} color={theme_new.colors.black.blackGray} weight={'medium'} />
                                <Line />
                                <Txt children={shippingData?.recipientName} size={'sm'} color={theme_new.colors.black.blackGray} weight={'medium'} />
                            </Wrapper>
                            <Wrapper mt={1}>
                                <Txt children={shippingData?.address + ' ' + shippingData?.detailAddress} lineHeight={20} size={'sm'} color={theme_new.colors.black.blackGray} weight={'medium'} />
                                <Txt children={phoneNumberHypen(shippingData?.recipientPhoneNumber)} size={'sm'} mt={1} color={theme_new.colors.black.blackGray} weight={'medium'} />
                            </Wrapper>
                        </Wrapper>
                        <Wrapper>
                            <InfoChangeBtn onPress={onPressDeliveryAddressChange} />
                        </Wrapper>
                    </Wrapper>
                ) : (
                    <Wrapper row w between>
                        <Txt children={'배송지를 입력해 주세요'} size={'sm'} weight={'medium'}/>
                        <Wrapper w width={20} height={20} row justifyContent={'flex-end'}>
                            <TouchableOpacity onPress={onPressRegistrationDeliveryInfo} style={{width: 20, height: 20, alignItems: "flex-end", justifyContent: "center"}}>
                                <Img src={require('../../public/image/component/icon-arrow-right.png')} width={6} height={10} />
                            </TouchableOpacity>
                        </Wrapper>
                    </Wrapper>
                ) }

                {shippingDate ? (
                    <Wrapper row mt={10} between>
                        <Wrapper width={containWidth}>
                            <Wrapper row mt={1}>
                                <Txt children={'배송 희망 일자'} size={'sm'} color={theme_new.colors.black.blackGray} weight={'medium'} />
                                <Line />
                                <Txt children={shippingDate} size={'sm'} color={theme_new.colors.black.blackGray} weight={'medium'} />
                            </Wrapper>
                        </Wrapper>
                        <Wrapper>
                            <InfoChangeBtn onPress={onPressDeliveryDateChange} />
                        </Wrapper>
                    </Wrapper>
                ) : (
                    <Wrapper row w between mt={12}>
                        <Txt children={'희망 배송날짜를 선택해 주세요'} size={'sm'} weight={'medium'} />
                        <Wrapper w width={20} height={20} row justifyContent={'flex-end'}>
                            <TouchableOpacity onPress={onPressRegistrationDeliveryDate} style={{width: 20, height: 20, alignItems: "flex-end", justifyContent: "center"}} >
                                <Img src={require('../../public/image/component/icon-arrow-right.png')} width={6} height={10} />
                            </TouchableOpacity>
                        </Wrapper>
                    </Wrapper>
                )}
            </Wrapper>
        )
    };

    // AdditionalFeeDom 부대비용 Component
    const AdditionalFeeDom = useCallback(({acquisitionTex, bondSellingPrice, bondLinkedCommission, vehicleManagementCost, driverInsurance, agencyPrice, nationStampTax, localStampTax, serviceCommission}) => {
        const [answerShow1, setAnswerShow1] = useState(false);
        const [answerShow2, setAnswerShow2] = useState(false);
        const [answerShow3, setAnswerShow3] = useState(false);
        const [answerShow4, setAnswerShow4] = useState(false);

        const onPressQuestion1 = useCallback(() => {
            setAnswerShow1(!answerShow1)
        }, [answerShow1]);

        const onPressQuestion2 = useCallback(() => {
            setAnswerShow2(!answerShow2)
        }, [answerShow2]);

        const onPressQuestion3 = useCallback(() => {
            setAnswerShow3(!answerShow3)
        }, [answerShow3]);

        const onPressQuestion4 = useCallback(() => {
            setAnswerShow4(!answerShow4)
        }, [answerShow4])

        return(
            <Wrapper pl={12} paddingY={15} mt={15} mb={1} style={{borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme_new.colors.border}}>
                <Wrapper row between>
                    <Txt children={'-  취득세'} size={'xs'} weight={'medium'}/>
                    <Txt children={acquisitionTex ? `${numberComma(Number(acquisitionTex))}` + ' 원' : '- 원'} size={'xs'} weight={'medium'}/>
                </Wrapper>
                <Wrapper row between mt={10}>
                    <Txt children={'-  공채할인비'} size={'xs'} weight={'medium'}/>
                    <Txt children={bondSellingPrice && bondLinkedCommission ? `${numberComma( Math.floor(Number(bondSellingPrice) + Number(bondLinkedCommission)))}` + ' 원' : '- 원'} size={'xs'} weight={'medium'}/>
                </Wrapper>
                <Wrapper row w between mt={10}>
                    <TouchableOpacity onPress={onPressQuestion1}>
                        <Wrapper row w>
                            <Txt children={'-  차량관리비'} size={'xs'} weight={'medium'} style={{marginRight: 5}}/>
                            <Img src={require('../../public/image/cart/icon-question.png')} width={16} height={16} />
                        </Wrapper>
                    </TouchableOpacity>
                    <Txt children={vehicleManagementCost ? `${numberComma(Number(vehicleManagementCost))}`+ ' 원' : '- 원'} size={'xs'} weight={'medium'}/>
                </Wrapper>
                {answerShow1 ? (
                    <Wrapper bgColor={theme.color.white} paddingX={15} paddingTop={15} paddingBottom={13} mt={10} mb={10}>
                        <Txt children={'자동차관리법 시행규칙 제 122조 제1항에 따라 매매상사가 받는 비용입니다.'} weight={'medium'} size={'xs'} />
                        <Wrapper>
                            <TouchableOpacity onPress={() => setAnswerShow1(false)}>
                                <CloseTxt children={'닫기'} weight={'medium'} textAlign={'right'}/>
                            </TouchableOpacity>
                        </Wrapper>
                    </Wrapper>
                ) : null}
                <Wrapper row w between mt={10}>
                    <TouchableOpacity onPress={onPressQuestion2}>
                        <Wrapper row w height={16}>
                            <Txt children={'-  단기 운전자보험료'} size={'xs'} weight={'medium'} style={{marginRight: 5}}/>
                            <Img src={require('../../public/image/cart/icon-question.png')} width={16} height={16} />
                        </Wrapper>
                    </TouchableOpacity>
                    <Txt children={driverInsurance ? `${numberComma(Number(driverInsurance))}`+ ' 원' : '- 원'} size={'xs'} weight={'medium'}/>
                </Wrapper>
                {answerShow2 ? (
                    <Wrapper bgColor={theme.color.white} paddingX={15} paddingTop={15} paddingBottom={13} mt={10} mb={10}>
                        <Txt children={'이전등록 이전에 차량 이용을 위해 반드시 가입해야 하는 운전자 보험입니다.'} weight={'medium'} size={'xs'} />
                        <Wrapper>
                            <TouchableOpacity onPress={() => setAnswerShow2(false)}>
                                <CloseTxt children={'닫기'} weight={'medium'} textAlign={'right'}/>
                            </TouchableOpacity>
                        </Wrapper>
                    </Wrapper>
                ) : null}
                <Wrapper row w between mt={10}>
                    <TouchableOpacity onPress={onPressQuestion3}>
                        <Wrapper row w>
                            <Txt children={'-  이전등록대행수수료'} size={'xs'} weight={'medium'} style={{marginRight: 5}}/>
                            <Img src={require('../../public/image/cart/icon-question.png')} width={16} height={16} />
                        </Wrapper>
                    </TouchableOpacity>
                    <Txt children={agencyPrice && nationStampTax && localStampTax ? `${numberComma(Math.floor(Number(agencyPrice) + Number(nationStampTax) + Number(localStampTax)))}` + ' 원' : '- 원'} size={'xs'} weight={'medium'}/>
                </Wrapper>
                {answerShow3 ? (
                    <Wrapper bgColor={theme.color.white} paddingX={15} paddingTop={15} paddingBottom={13} mt={10} mb={10}>
                        <Txt children={'이전대행수수료에 인지세, 증지세가 더해진 금액입니다.'} weight={'medium'} size={'xs'} />
                        <Wrapper>
                            <TouchableOpacity onPress={() => setAnswerShow3(false)}>
                                <CloseTxt children={'닫기'} weight={'medium'} textAlign={'right'}/>
                            </TouchableOpacity>
                        </Wrapper>
                    </Wrapper>
                ) : null}
                <Wrapper row w between mt={10}>
                    <TouchableOpacity onPress={onPressQuestion4}>
                        <Wrapper row w>
                            <Txt children={'-  카머스 서비스 이용료'} size={'xs'} weight={'medium'} style={{marginRight: 5}}/>
                            <Img src={require('../../public/image/cart/icon-question.png')} width={16} height={16} />
                        </Wrapper>
                    </TouchableOpacity>
                    <Txt children={serviceCommission ? `${numberComma(Number(serviceCommission))}` + ' 원' : '- 원'} size={'xs'} weight={'medium'}/>
                </Wrapper>
                {answerShow4 ? (
                    <Wrapper bgColor={theme.color.white} paddingX={15} paddingTop={15} paddingBottom={13} mt={10} mb={10}>
                        <Wrapper row>
                            <Txt weight={'medium'} size={'xs'}>중고차 특성을 고려하여  <Txt children={'30만원 이상 가치의 연장 보증 , 7일 간의 이용기간 '} weight={'medium'} size={'xs'} color={'primary'}/> 을 부여합니다.</Txt>
                        </Wrapper>

                        <Wrapper>
                            <TouchableOpacity onPress={() => setAnswerShow4(false)}>
                                <CloseTxt children={'닫기'} weight={'medium'} textAlign={'right'}/>
                            </TouchableOpacity>
                        </Wrapper>
                    </Wrapper>
                ) : null}
            </Wrapper>
        )
    }, [])

    const PaymentComponent = useCallback(() => {
        const totalPrice = Math.floor(
            Number(vehicleIncidentalExpense && vehicleIncidentalExpense.basePrice)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.acquisitionTex) // 취득세
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.bondSellingPrice) // 채권매입가액 (공채할인비 = 채권매입가액 + 채권연계수수료)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.bondLinkedCommission) // 채권연계수수료  (공채할인비 = 채권매입가액 + 채권연계수수료)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.vehicleManagementCost)  // 차량관리비
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.driverInsurance)  // 단기 운전자보험비
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.agencyPrice)  // 등록신청대행비 (이전등록대행 수수료 = 등록신청대행비 + 인지세 + 증지세)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.nationStampTax)   // 인지세 (이전등록대행 수수료 = 등록신청대행비 + 인지세 + 증지세)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.localStampTax)    // 증지세 (이전등록대행 수수료 = 등록신청대행비 + 인지세 + 증지세)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.serviceCommission))  // 이용수수료
            + Number(shippingFee); // 차량 배송비

        const additionalFee = Math.floor(
            Number(vehicleIncidentalExpense && vehicleIncidentalExpense.acquisitionTex) // 취득세
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.bondSellingPrice) // 채권매입가액 (공채할인비 = 채권매입가액 + 채권연계수수료)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.bondLinkedCommission) // 채권연계수수료  (공채할인비 = 채권매입가액 + 채권연계수수료)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.vehicleManagementCost)  // 차량관리비
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.driverInsurance)  // 단기 운전자보험비
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.agencyPrice)  // 등록신청대행비 (이전등록대행 수수료 = 등록신청대행비 + 인지세 + 증지세)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.nationStampTax)   // 인지세 (이전등록대행 수수료 = 등록신청대행비 + 인지세 + 증지세)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.localStampTax)    // 증지세 (이전등록대행 수수료 = 등록신청대행비 + 인지세 + 증지세)
            + Number(vehicleIncidentalExpense && vehicleIncidentalExpense.serviceCommission));  // 이용수수료

        const InstallmentPrice = Math.round(eval(`(${vehiclePrice * 0.7}*(7/100)/12*(1+((7/100)/12))**36)/((1+(7/100)/12)**36-1)`));
        return (
            <Wrapper d pt={25} pb={50} bgColor={theme.color.white}>
                <TitleTxt children={'결제금액'} mb={20}/>
                <Wrapper paddingY={16} paddingX={10} bgColor={theme.color.backgroundGray}>
                    <Wrapper row between>
                        <Txt children={'ㆍ 차량가격'} size={'sm'} weight={'medium'}/>
                        <Txt children={numberComma(Math.floor(Number(vehiclePrice) * 10000 )) + ' 원'} size={'sm'} weight={'medium'}/>
                    </Wrapper>
                    <Wrapper row between mt={10}>
                        <TouchableOpacity onPress={onPressAdditionalFeeBill}>
                            <Wrapper row w>
                                <Txt children={'ㆍ 부대비용'} size={'sm'} weight={'medium'} mr={2} />
                                { displayAdditionalFee
                                    ? (
                                        <Img src={require('../../public/image/component/icon-arrow-up.png')} width={10} height={6} />
                                    ) : (
                                        <Img src={require('../../public/image/component/icon-arrow-down.png')} width={10} height={6} />
                                    )
                                }
                            </Wrapper>
                        </TouchableOpacity>
                        <Txt children={ additionalFee ? `${numberComma(additionalFee)}` + ' 원' : '- 원'} size={'sm'} weight={'medium'}/>
                    </Wrapper>

                    {/* 부대비용 상세 start */}
                    { displayAdditionalFee ? (
                        <AdditionalFeeDom
                            acquisitionTex={vehicleIncidentalExpense?.acquisitionTex}
                            bondSellingPrice={vehicleIncidentalExpense?.bondSellingPrice}
                            bondLinkedCommission={vehicleIncidentalExpense?.bondLinkedCommission}
                            vehicleManagementCost={vehicleIncidentalExpense?.vehicleManagementCost}
                            driverInsurance={vehicleIncidentalExpense?.driverInsurance}
                            agencyPrice={vehicleIncidentalExpense?.agencyPrice}
                            nationStampTax={vehicleIncidentalExpense?.nationStampTax}
                            localStampTax={vehicleIncidentalExpense?.localStampTax}
                            serviceCommission={vehicleIncidentalExpense?.serviceCommission} />
                    ) : null }
                    {/* 부대비용 상세 end */}
                    {/* 차량 배송비 start */}
                    <Wrapper row between mt={10}>
                        <Txt children={'ㆍ 차량 배송비'} size={'sm'} weight={'medium'}/>
                        {shippingData ? (
                            <Txt children={shippingFee ? `${numberComma(Number(shippingFee))}` + ' 원' : '- 원'} size={'sm'} weight={'medium'}/>
                        ) : (
                            <Txt children={'배송지를 먼저 입력해주세요.'} size={'sm'} weight={'medium'} color={'primary'}/>
                        )}

                    </Wrapper>
                    {/* 차량 배송비 end */}
                </Wrapper>
                {/* 월 할부 예상 비용 start */}
                <Wrapper row between pt={25}>
                    <Txt children={'월 할부 예상 비용'} size={'sm'} />
                    <Wrapper>
                        <Txt children={InstallmentPrice ? `${numberComma(InstallmentPrice * 10000)}` + ' 원' : '- 원'} size={'sm'} weight={'thick'} textAlign={'right'} />
                        <Txt children={'선수금' + ' 30%' + ' 금리' + ' 7%' + ' 할부' + ' 36' + '개월'} size={'xs'} style={{marginTop: 5}}/>
                    </Wrapper>
                </Wrapper>
                {/*월 할부 예상 비용 end */}

                {/*총 구매 비용 */}
                <Wrapper row between w pt={25}>
                    <Txt children={'총 구매 비용'} size={'sm'} weight={'thick'} />
                    <Txt children={totalPrice ? `${numberComma(totalPrice)}` + ' 원' : '- 원'} size={'xl'} weight={'thick'} color={'primary'}/>
                </Wrapper>
            </Wrapper>
        )
    },[vehicleIncidentalExpense, PriceDate]);

    return (
        <>
            <InstantLayout title={'구매하기'}>
                <Wrapper flexNum={1}>
                    <ScrollView>
                        {/* 상품 & 배송정보 start */}
                        <Wrapper backgroundColor={'#fff'} d pt={20}>
                            {/* 상품정보 */}
                            <ProductThumb
                                onPress={onPressThumb}
                                id={vehicleData?.id}
                                isWish={isWish}
                                setIsWish={setIsWish}
                                manufacturer={vehicleData?.manufacturer}
                                modelName={vehicleData?.modelName}
                                modelTrim={vehicleData?.modelTrim}
                                modelYear={vehicleData?.modelYear}
                                mileage={vehicleData?.mileage}
                                transmission={vehicleData?.transmission}
                                price={vehicleData?.price}
                                salePrice={vehicleData?.salePrice}
                                imageList={vehicleData?.imageList}
                                onPressVehicleId={() => onPressItem(vehicleData?.id)}
                            />
                            {/* 배송정보 */}
                            <Wrapper mt={20} mb={20}>
                                <DeliveryWrapper>
                                    <Wrapper pt={14} pb={10} paddingX={17} style={{borderBottomWidth: 1, borderColor: theme_new.colors.border}}>
                                        <Txt children={'배송정보'} size={'sm'} weight={'bold'} />
                                    </Wrapper>
                                    <DeliveryDom />
                                </DeliveryWrapper>
                            </Wrapper>
                        </Wrapper>
                        {/* 상품 & 배송정보 end */}

                        {/* 결제금액 start */}
                        <PaymentComponent />

                        {/* 결제금액 end */}
                    </ScrollView>

                    {/* BtnWrapper start */}
                    <Wrapper row between paddingX={15} paddingY={12} bgColor={theme.color.white}>
                        <ButtonNew
                            width={'49%'}
                            type={'gray'}
                            title={'할부 구매'}
                            smallTitle={'(할부 / 현금+할부)'}
                            onPress={() => onPressPayment('현대')}/>
                        <ButtonNew width={'49%'} title={'현금구매'} onPress={onPressCashOrder} />
                    </Wrapper>
                    {/* BtnWrapper end */}
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    );
};

export default observer(PurchaseScreen);

const Line = styled(Wrapper)`
  width: 1px;
  height: 12px;
  background-color: ${theme_new.colors.border};
  margin: 2px 8px;
`;
const PriceTxt = styled(Txt)`
  font-size:${theme.size.xs};
  color: ${theme_new.colors.black.gray};
  margin-left: 3px;
  text-decoration: line-through ${theme_new.colors.black.gray};
`;

const DiscountTxt = styled(Txt)`
  font-size: ${theme.size.sm};
  color: ${theme_new.colors.red};
  font-family: ${theme.font.medium};
`;

const SalePriceTxt = styled(Txt)`
  font-size: ${theme.size.sm};
  color: ${theme_new.colors.black.black};
  font-family: ${theme.font.bold};
`;

const WonTxt = styled(Txt)`
  font-size: ${theme.size.sm};
  color: ${theme_new.colors.black.black};
  font-family: ${theme.font.medium};
`;

const DeliveryWrapper = styled(Wrapper)`
  border: 1px solid ${theme_new.colors.border};
  border-radius: 15px;
`;

const BtnWrapper = styled(Wrapper)`
  border: 1px solid ${theme_new.colors.border};
  width: 62px;
  height: 25px;
  border-radius: 15px;
`;

const Dot = styled(Wrapper)`
  width: 3px;
  height: 3px;
  background-color: ${theme.color.text};
  margin-top: 8px;
  margin-right: 8px;
`;

const TitleTxt = styled(Txt)`
  font-size: ${theme.size.sm};
  font-family: ${theme.font.bold};
`;

const CloseTxt = styled(Txt)`
  text-decoration: underline;
  font-size: 12px;
`;
