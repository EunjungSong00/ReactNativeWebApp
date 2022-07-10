import React, {useCallback} from 'react';
import {TouchableOpacity} from "react-native";
import theme from "../../public/theme";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import Img from "../../src/component/atom/Img";

/*구매완료 팝업*/
const OrderCompletePopup = ({clickClose}: any) => {
    const clickReview = useCallback(() => {
        console.log('clickReview')
    }, []);
    return (
        <>
            <Wrapper width={'100%'} height={'100%'} position={'absolute'} w h>
                <Wrapper width={'100%'} height={'200%'} position={'absolute'} backgroundColor={theme.color.black} opacity={0.5} style={{top: '-100%'}} />
                <Wrapper position={'absolute'} width={'80%'}>
                    <Wrapper backgroundColor={theme.color.white} width={'100%'} borderRadius={16} style={{overflow: 'hidden'}}>
                        <Wrapper w pt={20}>
                            <Txt size={'sm'} weight={'thick'} color={'textGray'} underline>구매완료</Txt>
                            <Txt size={'md'} weight={'medium'} textAlign={'center'} mt={15} lineHeight={24}>
                                {`차량구매를 축하드립니다!\n서비스에 품질을 리뷰해주시면\n타이어 교체 쿠폰을 드립니다.`}
                            </Txt>
                            <Wrapper mt={20} mb={25}>
                                <Img src={require('../../public/image/payment/payment-complete.png')} width={75} height={62} />
                            </Wrapper>
                        </Wrapper>
                        <TouchableOpacity activeOpacity={1} onPress={clickReview} style={{width: '100%', backgroundColor: theme.color.primary, paddingVertical: 20}}>
                            <Txt size={'md'} weight={'medium'} color={'white'} textAlign={'center'}>리뷰 작성하기 {' >'}</Txt>
                        </TouchableOpacity>
                    </Wrapper>
                    <TouchableOpacity activeOpacity={1} onPress={clickClose} style={{position: 'absolute', bottom: -68, left: '50%', marginLeft: -24}}>
                        <Wrapper w h width={48} height={48} backgroundColor={theme.color.lineGray17} borderRadius={48}>
                                <Img src={require('../../public/image/common/icon-close-wt.png')} width={18} height={18} />
                        </Wrapper>
                    </TouchableOpacity>
                </Wrapper>
            </Wrapper>
        </>
    )
}
export default OrderCompletePopup;