import React, {useCallback, useEffect, useState} from 'react';
import styled from "@emotion/native";
import theme from "../../public/theme";
import useInput from "../../src/hook/useInput";
import usePopup from "../../src/hook/usePopup";
import {useStores} from "../../src/module/store";
import {getStorage, setStorage} from '../../src/module/manageAsyncStorage';
import InstantLayout from "../../src/component/template/InstantLayout";
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import sendCaremerceUserRefundAccountOtpApi from "../../src/api/payment/sendCaremerceUserRefundAccountOtpApi";
import verifyCaremerceUserRefundAccountOtpApi from "../../src/api/payment/verifyCaremerceUserRefundAccountOtpApi";
import {INavigationRoute} from "../order/OrderStateScreen";
import Wrapper from "../../src/component/atom/Wrapper";
import InputLine from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";
import Txt from "../../src/component/atom/Txt";
import Select from "../../src/component/atom/Select";
import Img from "../../src/component/atom/Img";
import {IRefundAccount} from "../../src/module/store/paymentStore";

export const SubTitle = ({text}: {text: string}) => (
    <Txt textAlign={'center'} size={'lg'} weight={'thick'} lineHeight={30} mt={20} mb={40}>
        {text}
    </Txt>
)

/*환불계좌 확인*/
const PaymentRefundScreen = ({navigation}: INavigationRoute) => {
    const accountNumber = useInput('');
    const accountText = useInput('');
    const [bank, setBank] = useState<string | undefined>('');
    const [bankIdx, setBankIdx] = useState<number>(1);
    const [bankArr, setBankArr] = useState<any[]>([]);
    const [accountConfirm, setAccountConfirm] = useState<boolean>(false);
    const [accountToken, setAccountToken] = useState<string>('');
    const {setPopupText, Popup} = usePopup();
    const {paymentStore} = useStores();

    useEffect(() => {
        getBankList();
    }, []);

    useEffect(() => {
        // 저장된 정보 있을때
        const refundAccount: IRefundAccount = paymentStore?.refundAccount;
        if (refundAccount && refundAccount.accountNumber) {
            accountNumber.setValue(refundAccount.accountNumber);
            setBank(refundAccount.bankCode);
        }
    }, []);

    // 은행 리스트 가져오기
    const getBankList = useCallback(() => {
        fetch('https://storage.googleapis.com/handle-common-code/banks.json')
            .then((res) => res.json())
            .then((res) => {
                let bankList = res?.banks;
                if (bankList) {
                    bankList.map((item: any, index: number) => {
                        bankList[index].label = item.name;
                        bankList[index].value = item.code;
                        if (paymentStore?.refundAccount?.bankCode) {
                            if (item.code === paymentStore?.refundAccount?.bankCode) {
                                setBankIdx(index+1);
                            }
                        }
                    });
                    setBankArr(bankList);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    // 은행 선택시
    const onChangeBank = useCallback((value: string, index: number) => {
        setBank(value);
        setBankIdx(index);
    }, []);

    // 다음 선택시
    const clickSubmit = useCallback(() => {
        console.log('bank', bank)
        if (!accountConfirm) {
            // 은행, 계좌번호 입력 화면
            if (!bank) {
                setPopupText('은행을 선택해주세요.');
            } else if (!accountNumber.value) {
                setPopupText('계좌번호를 입력해주세요.');
            } else {
                const data = {
                    bankCode: bank,
                    accountNumber: accountNumber.value,
                    navigation
                }
                console.log(data)
                sendCaremerceUserRefundAccountOtpApi(data)
                    .then((res) => {
                        console.log(res)
                        if (res.sendCaremerceUserRefundAccountOtp) {
                            setAccountConfirm(true);
                            setAccountToken(res.sendCaremerceUserRefundAccountOtp.token);
                        }
                    })
            }
            // 계좌 미확인
            // PopUpMessage(`계좌 확인이 되지 않아요.\n입력하신 정보를 확인해주세요.`);
        } else {
            // 인증번호 입력 화면
            if (!accountText.value || accountText.value.length < 5) {
                setPopupText('인증번호를 입력해주세요.');
            } else if (accountToken && bank && accountNumber.value) {
                const data = {
                    otpNumber: accountText.value,
                    token: accountToken,
                    bankCode: bank,
                    accountNumber: accountNumber.value
                }
                verifyCaremerceUserRefundAccountOtpApi({...data, ...{navigation: navigation}})
                    .then((res) => {
                        console.log(res)
                        if (res.verifyCaremerceUserRefundAccountOtp) {
                            paymentStore.setRefundAccount(data);
                            const paymentSelect = paymentStore.select;
                            if (paymentSelect === '현금') {
                                navigation.navigate('PaymentDepositScreen');
                            } else {
                                navigation.navigate('PaymentAdditionalFirstScreen');
                            }
                        }
                    })
            }
        }
    }, [bank, accountNumber, accountConfirm, paymentStore]);

    // 환불계좌 변경하기 선택시
    const onChangeAccount = useCallback(async () => {
        const today = new Date().toDateString();
        const refundDate = await getStorage('refundDate');

        // 변경 이력이 있고, 변경날이 오늘이 아닐때
        if (refundDate && today !== refundDate) {
            setAccountConfirm(false);
            setStorage('refundCount', 1);
            setStorage('refundDate', today);
        } else {
            // 변경이력이 없거나 변경날이 오늘이면
            const refundCount = await getStorage('refundCount');
            if (!refundCount || refundCount < 3) {
                // 계좌변경 count 가 없거나 3회 이하면
                setAccountConfirm(false);
                setStorage('refundCount', refundCount? refundCount +1 : 1);
            } else {
                // 하루에 계좌 카운트가 3회이상일때
                setStorage('refundDate', today);
                setPopupText('계좌번호 변경은 하루 최대 3회까지만 가능해요.');
            }
        }
    }, []);

    return (
        <>
            <InstantLayout title={'환불계좌 확인'} keyboardView>
                <Wrapper d paddingY={20} between flexNum={1} backgroundColor={'white'}>
                    <ScrollViewBetween>
                        <Wrapper>
                            <SubTitle text={!accountConfirm?
                                `${paymentStore.driverLicense.name || '-'} 님의 본인명의로 개설된\n계좌번호를 입력해주세요.`
                                :
                                `입력하신 계좌로 1원을 보내드렸습니다.\n입금자에 표시된 숫자를 입력해주세요.`} />
                            {
                                !accountConfirm?
                                    <>
                                        <Wrapper>
                                            {
                                                bankArr.length > 0 ?
                                                    <Select title={'은행선택'} value={bank} items={bankArr} placeholder={'은행명'} onValueChange={onChangeBank} />
                                                    :
                                                    null
                                            }
                                            <InputLine hook={accountNumber} title={'계좌번호'} maxLength={20} keyboardType={'number-pad'} />
                                        </Wrapper>
                                        <Wrapper backgroundColor={theme.color.primary1} borderRadius={8} paddingY={10} paddingX={15}>
                                            <Txt size={'xs'} color={'primary'} weight={'medium'}>
                                                •   평생 계좌번호, 가상 계좌번호는 사용할 수 없습니다.
                                            </Txt>
                                        </Wrapper>
                                    </>
                                :
                                    <>
                                        <Img src={require('../../public/image/payment/payment-refund-account.png')} width={335} height={143} />
                                        <Wrapper mt={40}>
                                            <InputLine hook={accountText} title={'인증번호 입력'} numberString placeholder={'숫자 6자리'} keyboardType={'number-pad'} maxLength={6} fontFamily={theme.font.thick} />
                                        </Wrapper>
                                        <Wrapper row between backgroundColor={theme.color.primary1} paddingY={20} paddingX={15} borderRadius={8}>
                                            <Txt size={'xs'} color={'primary'} weight={'medium'}>{bankArr[bankIdx-1].label}   {accountNumber.value}</Txt>
                                            <AccountChangeButton>
                                                <Txt size={'xs'} color={'red'} weight={'medium'} onPress={onChangeAccount}>변경하기</Txt>
                                            </AccountChangeButton>
                                        </Wrapper>
                                        <Wrapper mt={15}>
                                            <Txt size={'xs'} color={'primary'} weight={'medium'}>
                                                •   입금내역이 없다면 등록하신 계좌 정보를 다시 확인해주세요.
                                            </Txt>
                                        </Wrapper>
                                    </>
                                }
                        </Wrapper>
                        <Wrapper pb={20} mt={20}>
                            <ButtonNew title={'다음'} type={'primary'} onPress={clickSubmit} />
                        </Wrapper>
                    </ScrollViewBetween>
                </Wrapper>
            </InstantLayout>
            <Popup />
        </>
    )
}
export default PaymentRefundScreen;

const AccountChangeButton = styled(Wrapper)`
    border: solid ${theme.color.red};
    border-width: 0 0 1px 0;
`;