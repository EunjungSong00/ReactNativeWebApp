import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList} from "react-native";
import {useIsFocused} from "@react-navigation/native";
import {StackNavigationProp} from "react-navigation-stack/src/vendor/types";
import {NavigationRoute} from "react-navigation";
import theme from "../../public/theme";
import InstantLayout from "../../src/component/template/InstantLayout";
import {getStorage} from "../../src/module/manageAsyncStorage";
import queryOrdersForCustomerApi from "../../src/api/order/queryOrdersForCustomerApi";
import PurchaseHistoryThumb from "../purchaseHistory/PurchaseHistoryThumb";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import Img from "../../src/component/atom/Img";

export const stateList: any = {
    waiting: {
        title: '입금확인중',
        color: 'primary',
        image: require('../../public/image/cart/icon-order-waiting-deposit.png')
    },
    ready: {
        title: '배송 준비중',
        color: 'lightPrimary',
        image: require('../../public/image/cart/icon-order-shipping.png')
    },
    delivery: {
        title: '배송중',
        color: 'lightPrimary',
        image: require('../../public/image/cart/icon-order-shipping.png')
    },
    complete: {
        title: '배송완료',
        color: 'darkPrimary',
        image: require('../../public/image/cart/icon-order-shipping-complete.png')
    },
    refundReception: {
        title: '환불요청',
        color: 'red',
        image: require('../../public/image/cart/icon-order-cancel.png')
    },
    refundConfirm: {
        title: '환불요청',
        color: 'red',
        image: require('../../public/image/cart/icon-order-cancel.png')
    },
    refundDelivery: {
        title: '환불요청',
        color: 'red',
        image: require('../../public/image/cart/icon-order-cancel.png')
    },
    refundComplete: {
        title: '환불요청',
        color: 'red',
        image: require('../../public/image/cart/icon-order-cancel.png')
    },
    cancel: {
        title: '구매취소',
        color: 'red',
        image: require('../../public/image/cart/icon-order-cancel.png')
    }
}

export interface INavigationRoute {
    navigation: StackNavigationProp,
    route?: NavigationRoute
}

/*주문상태 리스트*/
const OrderStateScreen = ({navigation}: INavigationRoute) => {
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [historyList, setHistoryList] = useState<[]>();
    const scrollRef = useRef<any>();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            void getPurchaseHistoryList();
        }
    }, [isFocused, page]);

    const getPurchaseHistoryList = useCallback(async () => {
        const userInfo = await getStorage('carmerceUser');
        if (userInfo.id) {
            if (page === 0 || page <= totalPages - 1) {
                const data = {
                    userId: userInfo.id,
                    page: page,
                    navigation
                }
                queryOrdersForCustomerApi(data)
                    .then((res) => {
                        console.log('queryOrdersForCustomer', res.queryOrdersForCustomer.orders)
                        if (res.queryOrdersForCustomer) {
                            // console.log(res.queryOrdersForCustomer.orders)
                                setHistoryList((prevState: any) => (page === 0 ? res.queryOrdersForCustomer.orders : prevState.concat(res.queryOrdersForCustomer.orders)));
                                setTotalPages(res.queryOrdersForCustomer.pageTotal);
                            }
                    })
            }
        }
    }, [page, totalPages]);

    const onPressState = useCallback((value) => {
        navigation.navigate('OrderStateDetailScreen', {data: value})
    }, []);

    const onEndReached = useCallback(() => {
        setPage((prevState) => prevState + 1);
    }, []);

    const memoizedValue = useCallback(
        ({item}) => {
            return <PurchaseHistoryThumb {...item} type={'order'} onPressState={onPressState} navigation />;
        },
        [historyList]
    );

    return (
        <InstantLayout title={'주문상태'}>
            <Wrapper flexNum={1} backgroundColor={theme.color.backgroundGray}>
                {
                    historyList?
                        historyList.length > 0 ?
                            <FlatList
                                ref={scrollRef}
                                keyExtractor={(item, index) => index.toString()}
                                data={historyList}
                                windowSize={5}
                                onEndReached={onEndReached}
                                onEndReachedThreshold={0.5}
                                // numToRender={10}
                                renderItem={memoizedValue}
                                removeClippedSubviews={true}
                                initialNumToRender={3}
                            />
                            :
                            <Wrapper w h flexNum={1} backgroundColor={theme.color.white}>
                                <Img src={require('../../public/image/component/icon-exclamation.png')} width={65} height={65}/>
                                <Txt size={'sm'} color={'textGray'} weight={'medium'} mt={20}>아직 주문하신 차량이 없어요.</Txt>
                            </Wrapper>
                        :
                        null
                }
            </Wrapper>
        </InstantLayout>
    )
}
export default OrderStateScreen;

