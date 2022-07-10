import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from "react-native";
import styled from "@emotion/native";
import theme from "../../public/theme";
import {useStores} from "../../src/module/store";
import useInput from "../../src/hook/useInput";
import usePopup from "../../src/hook/usePopup";
import InstantLayout from "../../src/component/template/InstantLayout";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import requestRefundApi from "../../src/api/order/requestRefundApi";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import {PaymentTitle} from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Input from "../../src/component/atom/Input";

/*주문상태 환불접수 - 차량반납 정보 입력*/
const OrderRefundPlaceScreen = ({navigation, route}: any) => {
    const vehicleReturnZip = useInput(); // 우편번호
    const zipCodeError = useState(false);  // 우편번호 오류 처리
    const vehicleReturnAddress = useInput(); // 주소
    const addressError = useState(false);   // 주소 오류 처리
    const vehicleReturnAddressDetail = useInput();   // 상세주소
    const detailAddressError = useState(false); // 상세 주소 오류 처리
    const returnTransferName = useInput();   // 상세주소
    const returnTransferPhoneNumber = useInput();   // 상세주소
    const {Popup, setPopupContents, setPopupText} = usePopup();
    const {refundStore} = useStores();
    const {zipcode, address, detailAddress} = refundStore.address;

    useEffect(() => {
        zipcode && vehicleReturnZip.setValue(zipcode);
        address && vehicleReturnAddress.setValue(address);
        detailAddress && vehicleReturnAddressDetail.setValue(detailAddress);
    }, []);

    useEffect(() => {
        if (route.params) {
            vehicleReturnZip.setValue(route.params.zipcode);
            vehicleReturnAddress.setValue(route.params.fullAddress);
        }
    }, [route.params]);

    // 우편번호 찾기
    const onPressFindPostNumber = useCallback(() => {
        navigation.navigate('SearchPostCodeScreen', {routeName: 'OrderRefundPlaceScreen'});
    }, [navigation]);

    // 우편번호 입력 유무 유효체크
    const checkZipCode = useCallback(() => {
        if (!vehicleReturnZip.value) {
            setPopupText('우편번호를 입력해주세요');
            zipCodeError[1](true);
        }
    }, [vehicleReturnZip.value]);

    // 주소값 입력 유무 유효체크
    const checkAddress = useCallback(() => {
        if (!vehicleReturnAddress.value) {
            setPopupText('주소를 입력해주세요');
            addressError[1](true);
        }
    }, [vehicleReturnAddress.value]);

    // 상세 주소 입력 유무 유효체크
    const checkDetailAddress = useCallback(() => {
        if (!vehicleReturnZip.value || !vehicleReturnAddress.value) {
            setPopupText('우편번호와 주소를 입력해주세요');
            zipCodeError[1](true);
            addressError[1](true);
        } else if (!vehicleReturnAddressDetail.value || vehicleReturnAddressDetail.value.length < 2) {
            setPopupText('상세 주소를 입력해주세요');
            detailAddressError[1](true);
        }
    }, [vehicleReturnAddressDetail.value, vehicleReturnAddress.value, vehicleReturnZip.value]);

    const clickSubmit = useCallback(() => {
        if (vehicleReturnZip.value && vehicleReturnAddress.value && vehicleReturnAddressDetail.value) {
            if (returnTransferName.value && returnTransferPhoneNumber.value) {
                const data = {
                    orderId: refundStore.orderId,
                    refundReasonFirst: refundStore.reason.first,
                    refundReasonSecond: refundStore.reason.second,
                    refundReasonDetail: refundStore.reason.detail,
                    refundImagePathList: refundStore.reason.imageList,
                    vehicleReturnAddress: vehicleReturnAddress.value,
                    vehicleReturnAddressDetail: vehicleReturnAddressDetail.value,
                    vehicleReturnZip: vehicleReturnZip.value,
                    returnTransferName: returnTransferName.value,
                    returnTransferPhoneNumber: returnTransferPhoneNumber.value,
                    navigation
                }
                requestRefundApi(data)
                    .then((res) => {
                        if (res.requestRefund) {
                            console.log('requestRefundApi', res.requestRefund)
                            setPopupContents({
                                title: '환불 접수가 완료되었습니다.',
                                text: `카머스 CS 팀에서 빠른 시일 내\n환불 사유를 확인하고,\n연락드리도록 하겠습니다.\n\n환불 절차를 진행하면서\n픽업 장소 및 시간을 안내해드리겠습니다.\n\n환불 진행상황은\n마이페이지 > 주문상태에서 확인 가능합니다.`,
                                clickConfirm: () => navigation.replace('OrderStateScreen')
                            })
                        }
                    })
            } else {
                setPopupText('인계자 정보를 모두 입력해주세요.');
            }
        } else {
            setPopupText('주소를 먼저 입력해주세요.');
        }
    }, [vehicleReturnAddress.value, vehicleReturnAddressDetail.value, vehicleReturnZip.value, returnTransferName.value, returnTransferPhoneNumber.value]);

    return (
        <>
            <InstantLayout title={'차량 반납 정보 입력'}>
                <Wrapper d flexNum={1} backgroundColor={theme.color.white}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <Wrapper w paddingY={40}>
                                <Txt size={'lg'} weight={'medium'}>차량 반납을 위한 정보를 입력해주세요.</Txt>
                            </Wrapper>
                            <Wrapper>
                                <PaymentTitle title={'차량 받으실 주소'} />
                                <Wrapper row between mt={13}>
                                    <Wrapper flexNum={1} mr={10}>
                                        <TouchableOpacity activeOpacity={1}
                                                          onPress={onPressFindPostNumber}>
                                            <Input hook={vehicleReturnZip}
                                                   placeholder={'우편번호'}
                                                   pointerEvents={'none'}
                                                   maxLength={5} />
                                        </TouchableOpacity>
                                    </Wrapper>
                                        <ButtonNew title={'검색'}
                                                   onPress={onPressFindPostNumber}
                                                   size={'sm'}
                                                   height={'60px'}
                                                   type={'darkGray'}
                                                   width={'90px'} />
                                </Wrapper>
                                <TouchableOpacity activeOpacity={1}
                                                  onPress={onPressFindPostNumber}>
                                    <Input hook={vehicleReturnAddress}
                                           placeholder={'주소'}
                                           pointerEvents={'none'}
                                           maxLength={100}
                                           mt={10} />
                                </TouchableOpacity>
                                <Input hook={vehicleReturnAddressDetail}
                                       placeholder={'상세 주소'}
                                       mt={10}
                                       maxLength={30} />
                            </Wrapper>
                            <Wrapper mt={30}>
                                <PaymentTitle title={'인계자 정보'} />
                                <Input hook={returnTransferName}
                                       placeholder={'이름'}
                                       korean
                                       mt={10}
                                       maxLength={6} />
                                <Input hook={returnTransferPhoneNumber}
                                       placeholder={'휴대전화번호'}
                                       numberString
                                       keyboardType={'number-pad'}
                                       mt={10}
                                       maxLength={11} />
                                <Txt size={'xs'} mt={2} mb={40}>※ 상담 진행을 위해 정확한 정보를 입력해주세요.</Txt>
                            </Wrapper>
                        </Wrapper>
                        <Wrapper mb={15}>
                            <ButtonNew title={'다음'} type={'primary'} onPress={clickSubmit} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default OrderRefundPlaceScreen;


const ReasonSectionTop = styled(Wrapper)`
  padding: 15px 20px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border: solid ${theme.color.lineGray5};
  border-width: 1px 0;
`;