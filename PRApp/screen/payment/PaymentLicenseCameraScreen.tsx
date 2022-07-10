import React, {useEffect, useState} from 'react';
import {Dimensions, Image} from "react-native";
import {RNCamera} from "react-native-camera";
import ImageEditor from "@react-native-community/image-editor";
import styled from "@emotion/native";
import theme from "../../public/theme";
import {getStorage} from "../../src/module/manageAsyncStorage";
import InstantLayout from "../../src/component/template/InstantLayout";
import Wrapper from "../../src/component/atom/Wrapper";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Txt from "../../src/component/atom/Txt";
import axios from "axios";

const CAM_VIEW_WIDTH = Dimensions.get('screen').width;
const CAM_VIEW_HEIGHT = Dimensions.get('screen').height;

const leftMargin = 20;
const topMargin = 160;
const frameWidth = Dimensions.get('screen').width - 40;
const frameHeight = (frameWidth /3) *2;


const scanAreaX = leftMargin / CAM_VIEW_HEIGHT;
const scanAreaY = topMargin / CAM_VIEW_WIDTH;
const scanAreaWidth = frameWidth / CAM_VIEW_HEIGHT;
const scanAreaHeight = frameHeight / CAM_VIEW_WIDTH;

interface ITextDom {
    text: string;
    dot?: boolean;
    color?: string;
    mb?: number;
}

/*운전면허증 등록*/
const PaymentLicenseCameraScreen = ({navigation}: any) => {
    const [accessToken, setAccessToken] = useState('')
    const [imageFile, setImageFile] = useState('')
    const cameraRef = React.useRef(null);

    useEffect(() => {
        getToken();
    }, []);

    const getToken = async () => {
        const token = await getStorage('token');
        console.log(token.accessToken)
        setAccessToken(token.accessToken);
    }

    const TextDom = ({text, dot, color, mb}: ITextDom) => (
        <Wrapper row mb={mb}>
            <Txt size={'xs'} color={'white'} weight={'medium'} mr={2}>{dot? `•` : ` `}</Txt>
            <Txt size={'xs'} color={color || 'white'} weight={'medium'}>{text}</Txt>
        </Wrapper>
    )

    const clickCamera = async () => {
        if (cameraRef) {
            const data = await cameraRef.current.takePictureAsync({
                quality: 1,
                exif: true,
                orientation: "portrait",
                fixOrientation: true
            });
            console.log('😻 data', data);
            console.log('data.uri', data.uri)
            const cropData = {
                offset: {
                    x: (data.width /CAM_VIEW_WIDTH *leftMargin),
                    y: (data.height /CAM_VIEW_HEIGHT *(topMargin + 30)),
                },
                size: {
                    width: (data.width /CAM_VIEW_WIDTH *frameWidth),
                    height: (data.width /CAM_VIEW_WIDTH *frameHeight),
                }
            };
            ImageEditor.cropImage(data.uri, cropData).then(url => {
                console.log("Cropped image uri", url);
                setImageFile(url);
                const formData = new FormData();
                const name  =url.split('/').slice(-1)[0];
                formData.append("file", { name: 'result.jpg', type: "image/jpeg", uri: url });
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: formData
                };
                fetch('https://dev-api.carmerce.co.kr/dev/cloud/storage/upload', requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        console.log('result', result)
                        const res = JSON.parse(result);
                        /*const resultName = res[0].name;
                        const resultOriginName = res[0].originFilename;*/
/*
                    console.log('resultName', resultName)
                    console.log('resultOriginName', resultOriginName)*/
                        axios(
                           {
                             url: 'https://dev-delivery.carmerce.co.kr/ocr/api/v1/document/url',
                             method: 'post',
                             headers: {
                               "Content-Type": `multipart/form-data`,
                                "Accept": 'application/json',
                                 Authorization: `Bearer ${accessToken}`
                             },
                             data: {url: `https://dev-api.carmerce.co.kr/dev/cloud/storage?name=carmerce-user/files/${res[0].name}`}
                             //withCredentials: true,
                           })
                            .then((response) => {
                              console.log('response', response)
                                navigation.navigate('PaymentLicenseScreen');
                             })
                            .catch((err) => {
                                console.log('err', err)
                                navigation.navigate('PaymentLicenseScreen');
                            })
                        ;
                    })
                    .catch((error) => {
                        console.error('error');
                        console.error(error);
                    });


            })
        }
    }

    return (
        <>
            <InstantLayout title={'운전면허증 등록'} keyboardView>
                <Wrapper between flexNum={1}>
                    <RNCamera
                        ref={cameraRef}
                        style={{width: '100%', height: '100%'}}
                        type={RNCamera.Constants.Type.back}
                        captureAudio={false}
                        /*rectOfInterest={{
                            x: scanAreaX,
                            y: scanAreaY,
                            width: scanAreaWidth,
                            height: scanAreaHeight,
                        }}
                        cameraViewDimensions={{
                            width: CAM_VIEW_WIDTH,
                            height: CAM_VIEW_HEIGHT,
                        }}*/>
                        <Wrapper position={'absolute'} flexNum={1} width={'100%'} height={'100%'}>
                            <BackgroundWrapper top={0} width={'100%'} height={topMargin} />
                            <BackgroundWrapper top={topMargin + frameHeight} width={'100%'} height={CAM_VIEW_HEIGHT} />
                            <BackgroundWrapper top={topMargin} width={20} height={frameHeight} />
                            <BackgroundWrapper top={topMargin} right={0} width={20} height={frameHeight} />
                            <Wrapper position={'absolute'} top={topMargin} left={leftMargin}>
                                <Wrapper borderWidth={1} borderColor={theme.color.primary} width={frameWidth} height={frameHeight} />
                            </Wrapper>
                            <Wrapper position={'absolute'} top={topMargin -55} d w width={'100%'}>
                                <Txt size={'md'} color={'white'}>운전면허증을 사각형 모양 안에 맞춰주세요</Txt>
                            </Wrapper>
                            <Wrapper position={'absolute'} top={topMargin + frameHeight + 25} d>
                                <TextDom text={'복사본이나 사진은 사용할 수 없습니다.'} dot mb={1} />
                                <TextDom text={'신분증 원본으로 촬영하세요.'} color={'primary'} mb={3} />
                                <TextDom text={'정보 확인이 어렵거나 훼손된 신분증은 거래가 거절 될 수 있습니다.'} dot />
                            </Wrapper>
                            {/*{
                                imageFile? <Image source={{uri: imageFile}} style={{width: 300, height: 200}} /> : null
                            }*/}
                            <Wrapper position={'absolute'} d width={'100%'} style={{bottom: 50}}>
                                <ButtonNew title={'실행'} type={'primary'} onPress={clickCamera} />
                            </Wrapper>
                        </Wrapper>
                    </RNCamera>
                </Wrapper>
            </InstantLayout>
        </>
    )
}
export default PaymentLicenseCameraScreen;

const BackgroundWrapper = styled(Wrapper)`
  position: absolute;
  background: ${theme.color.black};
  opacity: 0.8;
`;