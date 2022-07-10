import React, {useCallback, useEffect, useRef, useState} from 'react';
import InstantLayout from "../../../src/component/template/InstantLayout";
import Wrapper from "../../../src/component/atom/Wrapper";
import {TouchableOpacity} from "react-native";
import theme from "../../../public/theme";
import theme_new from "../../../public/theme_new";
import Img from "../../../src/component/atom/Img";
import Txt from "../../../src/component/atom/Txt";
import styled from "@emotion/native";
import ScrollViewBetween from "../../../src/component/template/ScrollViewBetween";
import ButtonNew from "../../../src/component/atom/ButtonNew";
import {phoneNumberHypen} from "../../../src/module/formatter";
import shippingAddressesApi from "../../../src/api/cart/shipping/shippingAddressesApi";
import changeDefaultShippingAddressApi from "../../../src/api/cart/shipping/changeDefaultShippingAddressApi";
import deleteShippingAddressApi from "../../../src/api/cart/shipping/deleteShippingAddressApi";
import Toast from "../../../src/component/atom/Toast";
import {inject, observer} from "mobx-react";
import {useStores} from "../../../src/module/store";
import usePopup from "../../../src/hook/usePopup";
import { useIsFocused } from '@react-navigation/native';
import useDomReady from '../../../src/hook/useDomReady';
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';
import { NavigationRoute } from 'react-navigation';

const ManageShippingListScreen = ({navigation, route}: {navigation: StackNavigationProp; route: NavigationRoute}) => {
    const [shippingList, setShippingList] = useState<any[]>( []);
    const shippingListNone = shippingList?.length === 0;
    const [id, setId] = useState<any[]>([]);
    const noneDefaultShipping = shippingList?.filter((el) => el?.isDefault).length === 0;
    const toastRef = useRef<any>(null);
    const [isCheckedId, setIsCheckedId] = useState(-1);
    const {shippingStore} = useStores();
    const {Popup, setPopupText} = usePopup();
    const isFocused = useIsFocused();
    const domReady = useDomReady();
    const [isDefault, setIsDefault] = useState(false);
    const shippingDate = shippingStore?.shippingDate;

    useEffect(() => {
        isFocused && getShippingList();
    },[isFocused]);

    useEffect(() => {
        const newIsCheck = shippingList.filter((el: any) => el?.isDefault)[0]?.isDefault;
        setIsDefault(newIsCheck);
    },[isDefault, shippingList])


    const getShippingList = useCallback( async () => {
        await shippingAddressesApi(navigation)
            .then((res) => {
                console.log('shippingAddressesApi res : ', res);
                const list: any[] = res?.shippingAddresses?.map((el:any) => ({...el, isCheck: false, isDelete: false, isEdit: false}));
                setShippingList(list);
                setIsCheckedId(list.filter((el:any) => el.isDefault)[0].id);
            })
    }, []);

    // 배송지 추가 눌렀을 때
    const onPressAddShippingAddress = useCallback(() => {
        navigation.navigate('EnterShippingInfoScreen');
    }, []);

    // 수정 버튼 눌렀을 때
    const onPressEditDelivery = useCallback((id:number) => {
        setId((shippingList) => shippingList.map((shipping)=>(
            shipping.id === id ? {...shipping, isEdit: !shipping.isEdit} : {...shipping, isEdit: false}
        )));
        shippingStore.setShippingId(id)
        navigation.navigate('EditEnterShippingInfoScreen', {'editID': id});
    }, [id, shippingList]);

    // 삭제 버튼 눌렀을 때
    const onPressDeleteAddress = useCallback(async (id: number) => {
        setId((shippingList) => shippingList.map((shipping)=>(
            shipping.id === id ? {...shipping, isDelete: !shipping.isDelete} : {...shipping}
        )));
        await deleteShippingAddressApi(Number(id), navigation)
            .then((res) => {
                console.log('deleteShippingAddressApi res', res);
                res.deleteShippingAddress && setShippingList(shippingList.filter((el) => el.id !== id));
            })
    },[id, shippingList, navigation]);

    // 기본 배송지 지정 버튼을 눌렀을 때
    const onPressAppointShipping = useCallback(async (id: number) => {
        if (isCheckedId === -1) {
            setPopupText('배송지를 선택해주세요.')
        } else if (isCheckedId !== -1) {
            await changeDefaultShippingAddressApi(Number(isCheckedId), navigation)
            .then((res) => {
                if (shippingDate) {
                    res && res.changeDefaultShippingAddress && navigation.navigate('PurchaseScreen');
                    res && res.changeDefaultShippingAddress && shippingStore.setFullAddress(res?.changeDefaultShippingAddress);
                } else if (!shippingDate) {
                    res && res.changeDefaultShippingAddress && navigation.navigate('PickShippingDateScreen');
                    res && res.changeDefaultShippingAddress && shippingStore.setFullAddress(res?.changeDefaultShippingAddress);
                }
            })
        }
    },[isCheckedId, shippingList, navigation]);


    // DeliveryListDom Component
    const DeliveryListDom = useCallback((
        {isCheckedId, setIsCheckedId, id, onPressDelete, onPressEdit, recipientName, zipCode, address, detailAddress, recipientPhoneNumber, isDefault}) => {
        const isCheck = isCheckedId === id;

        return (
            <TouchableOpacity
                onPress={() => isCheck ? setIsCheckedId(-1) : setIsCheckedId(id)}>
                <Wrapper paddingX={16} paddingY={21} mb={15}
                    borderColor={isCheck ? theme.color.primary : theme_new.colors.border}
                    style={{borderRadius: 10, borderWidth: 1 }}>
                    <Wrapper row between>
                        <Wrapper row w>
                            {/* 라디오 버튼 */}
                                <Wrapper width={20} height={20} mr={10}>
                                    <Wrapper w h>
                                        <Img src={isCheck ? require('../../../public/image/component/btn-radio-on.png') : require('../../../public/image/component/btn-radio-off.png')} width={20} height={20} />
                                    </Wrapper>
                                </Wrapper>
                            <Txt children={recipientName} weight={'bold'} size={'sm'} />
                            { isDefault &&
                                <Wrapper w h bgColor={theme.color.primary2} width={64} height={16} ml={2} style={{borderRadius: 8}}>
                                    <Txt children={'기본배송지'} size={'xxs'} />
                                </Wrapper>
                            }
                        </Wrapper>
                        <TouchableOpacity onPress={onPressEdit}>
                            <EditBtnWrapper w h>
                                <Txt children={'수정'} size={'xm'} />
                            </EditBtnWrapper>
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper width={268} ml={30} mt={1}>
                        <Txt children={'[' + zipCode + ']' + address + ' ' + detailAddress} size={'xm'} lineHeight={20} />
                    </Wrapper>
                    <Wrapper row between ml={30} mt={10}>
                        <Txt children={phoneNumberHypen(recipientPhoneNumber)} size={'xm'}/>
                        <TouchableOpacity onPress={onPressDelete}>
                            <DeleteTxt children={'삭제'} size={'xm'} />
                        </TouchableOpacity>
                    </Wrapper>
                </Wrapper>
            </TouchableOpacity>
        )
    },[]);

    // 배송지 추가 버튼
    const AddShoppingAddress = ({disabled}:{disabled?:boolean}) => (
        <AddButtonWrapper onPress={onPressAddShippingAddress} disabled={disabled}>
            <Wrapper row w h height={50} mt={3} mb={30} bgColor={theme.color.backgroundGray} style={{borderRadius: 6}}>
                <Img src={require('../../../public/image/cart/shipping-icon-add.png')} width={13} height={13}/>
                <Txt children={'새 배송지 등록'} size={'sm'} weight={'medium'} ml={1}/>
            </Wrapper>
        </AddButtonWrapper>
    );

    return (
        <>
            <InstantLayout title={'배송지 관리'} back close>
                <ScrollViewBetween>
                        { shippingListNone ? (
                            <>
                                <Wrapper flexNum={1} bgColor={theme.color.white} d pt={20} w h>
                                    <Wrapper w h>
                                        <Img src={require('../../../public/image/component/icon-exclamation.png')} width={65} height={65}/>
                                        <Txt children={'배송지를 등록해 주세요.'} color={theme.color.textGray} size={'sm'} weight={'medium'} mt={20} style={{opacity: 0.48}}/>
                                    </Wrapper>
                                </Wrapper>
                                <Wrapper d bgColor={theme.color.white} pt={10} pb={20} >
                                    <ButtonNew title={'새 배송지 등록'} onPress={onPressAddShippingAddress}/>
                                </Wrapper>
                            </>
                        ): (
                            <>
                                <Wrapper flexNum={1} bgColor={theme.color.white} d pt={20}>
                                    {noneDefaultShipping && <AddShoppingAddress disabled={shippingList?.length === 3}/>}
                                    {shippingList?.map((item: any, key) =>
                                        (
                                            <>
                                                <DeliveryListDom
                                                    key={item.idhandleEndLoading}
                                                    id={item.id}
                                                    isCheckedId={isCheckedId}
                                                    setIsCheckedId={setIsCheckedId}
                                                    isCheck={item.isCheck}
                                                    recipientName={item.recipientName}
                                                    recipientPhoneNumber={item.recipientPhoneNumber}
                                                    address={item.address}
                                                    detailAddress={item.detailAddress}
                                                    zipCode={item.zipCode}
                                                    isDefault={item.isDefault}
                                                    onPressEdit={() => onPressEditDelivery(item.id)}
                                                    onPressDelete={() => onPressDeleteAddress(item.id)}
                                                />
                                                {item.isDefault && <AddShoppingAddress  disabled={shippingList.length === 3}/>}
                                            </>
                                        )
                                    )}
                                </Wrapper>
                                <Wrapper d bgColor={theme.color.white} pt={10} pb={20} >
                                    <ButtonNew title={'기본 배송지로 지정'} onPress={() => onPressAppointShipping(isCheckedId)} />
                                </Wrapper>
                            </>
                        )}
                </ScrollViewBetween>
            </InstantLayout>
            <Toast ref={toastRef} />
            <Popup />
        </>
    );

};

export default observer(ManageShippingListScreen);


const EditBtnWrapper = styled(Wrapper)`
  border: 1px solid ${theme_new.colors.border};
  width: 40px;
  height: 22px;
  border-radius: 11px;
`;

const DeleteTxt = styled(Txt)`
    text-decoration: underline;
`;

const AddButtonWrapper = styled(TouchableOpacity)<any>`
  ${({disabled}) => disabled && 'opacity: 0.3' };
`;
