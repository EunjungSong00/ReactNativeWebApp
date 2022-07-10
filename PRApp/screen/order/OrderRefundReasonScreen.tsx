import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from "react-native";
import {launchImageLibrary} from "react-native-image-picker";
import Config from "react-native-config";
import styled from "@emotion/native";
import theme from "../../public/theme";
import {useStores} from "../../src/module/store";
import usePopup from "../../src/hook/usePopup";
import {getStorage} from "../../src/module/manageAsyncStorage";
import InstantLayout from "../../src/component/template/InstantLayout";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import {ReasonButton, ReasonTitle} from "OrderRefundComponent";
import {reasonFirstArr} from "OrderRefundScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import {PaymentTitle} from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";
import TextArea from "../../src/component/atom/TextArea";
import Img from "../../src/component/atom/Img";

const reasonSecondArr = {
    '마음이 변했어요. (단순 변심)': {
        title: '환불 사유를 선택해 주세요.',
        list: [
            {title: '차량이 기대했던 것보다 별로에요.', value: 1},
            {title: '더 좋은 차를 찾았어요.', value: 2},
            {title: '신차를 사는 게 나을 것 같아요.', value: 3},
            {title: '기타', value: 'etc'}
        ]
    },
    '차량 정보가 달라요. (정보 불일치)': {
        title: '설명과 다른 부분을 선택해 주세요.',
        list: [
            {title: '차량 제원정보가 달라요.', value: 1},
            {title: '옵션 정보가 달라요.', value: 2},
            {title: '성능점검 및 사고, 보험이력 정보가 달라요.', value: 3},
            {title: '기타', value: 'etc'}
        ]
    },
    '차량에 결함이 있어요. (불량)': {
        title: '결함 내용을 선택해 주세요.',
        list: [
            {title: '차량 내/외관에 문제가 있어요.', value: 1},
            {title: '옵션 작동에 문제가 있어요.', value: 2},
            {title: '주행 관련 문제가 있어요.', value: 3},
            {title: '기타', value: 'etc'}
        ]
    }
}

/*주문상태 환불접수 - 사유 선택 후*/
const OrderRefundReasonScreen = ({navigation, route}: any) => {
    const [title, setTitle] = useState('');
    const [list, setList] = useState([]);
    const [reasonSecond, setReasonSecond] = useState();
    const [detail, setDetail] = useState('');
    const [file, setFile] = useState<(string | undefined)[]>([]);
    const {Popup, setPopupText} = usePopup();
    const [accessToken, setAccessToken] = useState('');
    const {refundStore} = useStores();
    const {type} = route.params;

    useEffect(() => {
        setTitle(reasonSecondArr[type].title);
        setList(reasonSecondArr[type].list);
        getAccessToken();
    }, []);

    const getAccessToken = useCallback(async () => {
        const token = await getStorage('token');
        setAccessToken(token.accessToken);
    }, []);

    const clickReasonSecond = useCallback((value) => {
        console.log('clickReason')
        setReasonSecond(value)
    }, []);

    const onChangeText = useCallback((value) => {
        setDetail(value)
    }, []);

    const clickSubmit = useCallback(() => {
        if (!reasonSecond) {
            setPopupText('환불사유를 선택해주세요.');
        } else if (type !== reasonFirstArr[0]?.value && !detail.trim()) {
            setPopupText('상세 사유를 입력해주세요.');
        } else {
            refundStore.setReason({first: type, second: reasonSecond, detail: detail, imageList: JSON.stringify(file)});
            navigation.navigate('OrderRefundPlaceScreen');
        }
    }, [type, reasonSecond, detail, file]);

    const ImageListDom = useCallback(({value, index}: {value: string, index: number}) => (
        <Wrapper backgroundColor={theme.color.black} borderRadius={6} mr={10}>
            <Img url={Config.NEXT_PUBLIC_IMAGE_URL + value} width={72} height={72} />
            <Wrapper width={72} height={72} position={'absolute'} backgroundColor={theme.color.black} borderRadius={6} opacity={0.2} />
            <Wrapper position={'absolute'} style={{top: 8, right: 8}}>
            <TouchableOpacity activeOpacity={1}
                              onPress={() => {setFile(file.filter((_, key) => index !== key));}}>
                    <Img src={require('../../public/image/common/icon-close-wt.png')} width={11} height={11} />
            </TouchableOpacity>
                </Wrapper>
        </Wrapper>
    ), [file]);

    const RequiredTxt = useCallback(({text}: {text: string}) => (
        <Txt size={'xs'} color={'red'} ml={2}>*{text}</Txt>
    ), []);

    const clickImagePicker = useCallback(() => {
        launchImageLibrary({}, (res) => {
            if (res?.assets) {
                console.log(res);
                // alert(res?.assets[0]?.uri);
                const formdata = new FormData();
                formdata.append('file', res?.assets[0]?.uri);
                console.log(res?.assets[0]?.uri);
                const formData = new FormData();
                formData.append('file', {name: 'result.jpg', type: 'image/jpg', uri: res?.assets[0]?.uri});
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: formData
                };
                fetch(Config.NEXT_PUBLIC_STORAGE, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        const res = JSON.parse(result);
                        if (res) {
                            setFile([...file, res[0].name])
                        }
                    })
                    .catch((err) => {
                        setPopupText('다시 시도해주세요.');
                    });
            }
        });
    }, [file, accessToken]);

    return (
        <>
            <InstantLayout title={'환불접수'}>
                <Wrapper flexNum={1} backgroundColor={theme.color.white}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <ReasonTitle title={title} />
                            <Wrapper d paddingY={30}>
                                {
                                    list.map((item) => (
                                        <ReasonButton key={item.value} title={item.title} value={item.title} reason={reasonSecond} onPress={clickReasonSecond} />
                                    ))
                                }
                            </Wrapper>
                            <Wrapper>
                                <ReasonSectionTop>
                                    <Wrapper row w>
                                        <PaymentTitle title={'상세 사유 입력'} />
                                        {
                                            type !== reasonFirstArr[0]?.value?
                                                <RequiredTxt text={'필수입력'} />
                                                :
                                                null
                                        }
                                    </Wrapper>
                                    <Wrapper row>
                                        <Txt size={'sm'} weight={'medium'}>{detail.length}</Txt>
                                        <Txt size={'sm'} weight={'medium'} color={'textGray'} en> / 100</Txt>
                                    </Wrapper>
                                </ReasonSectionTop>
                                <Wrapper>
                                    <TextArea value={detail} onChangeText={onChangeText} maxLength={100} placeholder={'선택하신 사유에 대해 구체적으로 설명해주세요. (100글자 이내)'} />
                                </Wrapper>
                            </Wrapper>
                            {
                                type !== reasonFirstArr[0]?.value ?
                                    <Wrapper>
                                        <ReasonSectionTop>
                                            <Wrapper row w>
                                                <PaymentTitle title={'사진 첨부'} />
                                                <RequiredTxt text={'최대 10장'} />
                                            </Wrapper>
                                            {
                                                file.length < 10?
                                                    <TouchableOpacity activeOpacity={1} onPress={clickImagePicker}>
                                                        <Wrapper borderColor={theme.color.text} borderBottomWidth={0.7} paddingY={1}>
                                                            <Txt size={'xs'}>+ 첨부하기</Txt>
                                                        </Wrapper>
                                                    </TouchableOpacity>
                                                    :
                                                    null
                                            }
                                        </ReasonSectionTop>
                                        <ScrollView horizontal={true}
                                                    showsHorizontalScrollIndicator={false}>
                                            <Wrapper d marginY={20} row height={72}>
                                                {
                                                    file.map((item, index) => (
                                                        <ImageListDom key={index} value={item} index={index} />
                                                    ))
                                                }
                                            </Wrapper>
                                        </ScrollView>
                                    </Wrapper>
                                    :
                                    null
                            }
                        </Wrapper>
                        <Wrapper d mb={15}>
                            <ButtonNew title={'환불접수'} type={'primary'} onPress={clickSubmit} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default OrderRefundReasonScreen;


const ReasonSectionTop = styled(Wrapper)`
  padding: 15px 20px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border: solid ${theme.color.lineGray5};
  border-width: 1px 0;
`;