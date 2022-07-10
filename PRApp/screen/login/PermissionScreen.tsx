import React, {useCallback, useEffect} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {useStores} from "../../src/module/store";
import {primary} from '../../public/theme';
import usePopup from "../../src/hook/usePopup";
import useCheckBoxEl from '../../src/hook/useCheckBoxEl';
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import InstantLayout from '../../src/component/template/InstantLayout';
import Wrapper from '../../src/component/atom/Wrapper';
import Text from '../../src/component/atom/Text';
import Button from '../../src/component/atom/Button';

const PermissionScreen = ({navigation}: any) => {
    const agreeAll = useCheckBoxEl();
    const privacy = useCheckBoxEl();
    const third = useCheckBoxEl();
    const customer = useCheckBoxEl();
    const {Popup, setPopupContents} = usePopup();
    const {niceStore} = useStores();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (niceStore.email) {
            setPopupContents({
                text: `이미 카머스에 가입하셨네요!\n\n고객님의 계정은\n${niceStore.email} 입니다.`,
                clickConfirm: () => niceStore.setNiceEmail('')
            });
        } else if (niceStore.fail) {
            setPopupContents({
                text: `본인인증에 실패했어요.`,
                clickConfirm: () => niceStore.setNiceFail(false)
            });
        }
    }, [isFocused]);

    useEffect(() => {
        privacy.value && third.value && customer.value ? agreeAll.setValue(true) : agreeAll.setValue(false);
    }, [privacy.value, third.value, customer.value]);

    useEffect(() => {
        if (agreeAll.value) {
            privacy.setValue(true);
            third.setValue(true);
            customer.setValue(true);
        } else if (privacy.value && third.value && customer.value) {
            privacy.setValue(false);
            third.setValue(false);
            customer.setValue(false);
        }
    }, [agreeAll.value]);

    const DetailArrow = useCallback(
        ({type}: {type: string}) => (
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('TosScreen', {type})} style={{padding: 10}}>
                <Image source={require('../../public/image/icon/ic-path.png')} />
            </TouchableOpacity>
        ),
        []
    );

    const goNicePass = useCallback(() => {
        navigation.navigate('Nice', {title: 'SignUp'});
    }, []);

    return (
        <Wrapper flex={1}>
            <InstantLayout title="서비스 이용약관">
                <ScrollViewBetween>
                    <Wrapper padding={20} flexNum={1}>
                        <Wrapper borderWidth={1} borderRadius={6} borderColor={'#e2e2e2'} bgColor={'#fff'} padding={15}>
                            <agreeAll.Element label={'모든 내용, 동의 합니다.'} />
                        </Wrapper>
                        <Wrapper flexNum={1} borderWidth={1} borderRadius={6} borderColor={'#e2e2e2'} mt={15} padding={15} bgColor={'#fff'}>
                            <Wrapper row w between mb={5}>
                                <privacy.Element label={'[필수] 개인정보 수집 및 이용 동의'} />
                                <DetailArrow type="privacy" />
                            </Wrapper>
                            <Wrapper row w between mb={5}>
                                <third.Element label={'[필수] 개인정보 제3자 제공 동의'} />
                                <DetailArrow type="third" />
                            </Wrapper>
                            <Wrapper row w between>
                                <customer.Element label={'[필수] 소비자 이용약관'} />
                                <DetailArrow type="customer" />
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>
                    <Wrapper d>
                        <Button mb={20} whcbr={['100%', 56, primary]} disabled={!agreeAll.value} fontSize={20} fontWeight="bold" onPress={goNicePass}>
                            동의 후 본인인증
                        </Button>
                    </Wrapper>
                </ScrollViewBetween>
            </InstantLayout>
            <Popup />
        </Wrapper>
    );
};
export default PermissionScreen;
