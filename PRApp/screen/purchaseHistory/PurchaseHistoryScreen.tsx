import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList} from "react-native";
import theme from "../../public/theme";
import {getStorage} from "../../src/module/manageAsyncStorage";
import InstantLayout from "../../src/component/template/InstantLayout";
import PurchaseHistoryThumb from "PurchaseHistoryThumb";
import {INavigationRoute} from "../order/OrderStateScreen";
import purchaseHistoryApi from "../../src/api/purchaseHistory/purchaseHistoryApi";
import checkReviewApi from "../../src/api/mypage/checkReviewApi";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import Img from "../../src/component/atom/Img";

/*구매이력 리스트*/
const PurchaseHistoryScreen = ({navigation}: INavigationRoute) => {
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [historyList, setHistoryList] = useState<[]>();
    const scrollRef = useRef<any>();

    useEffect(() => {
        void getPurchaseHistoryList();
    }, [page]);

    // 구매이력 가져오기
    const getPurchaseHistoryList = useCallback(async () => {
        const userInfo = await getStorage('carmerceUser');
        if (userInfo.id) {
            const data = {
                userId: userInfo.id,
                page: page,
                navigation
            }
            purchaseHistoryApi(data)
                .then((res) => {
                    if (res.purchaseHistory) {
                        console.log('purchaseHistoryApi', res.purchaseHistory)
                        if (page === 0 || page <= totalPages - 1) {
                            const orderList = res.purchaseHistory.orders;
                            let orderArr: number[] = [];
                            // orderArr 에 vehicleId 만 넣은 배열 만듬
                            orderList.map((item: any) => {
                                orderArr.push(JSON.parse(item?.vehicleDetailJson)?.vehicle?.id);
                            })
                            orderArr.length > 0 ?
                                getReviewList(orderArr, orderList)
                                :
                                !historyList && setHistoryList([]);
                            setTotalPages(res.purchaseHistory.pageTotal);
                        }
                    }
                })
        }
    }, [page, historyList]);

    // 리뷰 여부 체크
    const getReviewList = useCallback((value: number[], list: any) => {
        if (value) {
            const data = {
                vehicleIds: value,
                navigation
            }
            checkReviewApi(data)
                .then((res) => {
                    const listTmp = [...list];
                    if (res.checkReview) {
                        console.log(res.checkReview)
                        res.checkReview.map((item: boolean, index: number) => {
                            listTmp[index].review = item;
                        })
                    }
                    setHistoryList((prevState: any) => (page === 0 ? listTmp : prevState.concat(listTmp)));
                })
        }
    }, []);

    // 리스트 선택시
    const onPressList = useCallback((value) => {
        navigation.navigate('PurchaseHistoryViewScreen', {item: value});
    }, []);

    // 리뷰버튼 선택시
    const onPressReview = useCallback(() => {
        navigation.navigate('ReviewWriteEditScreen');
    }, []);

    // 스크롤 아래 닿았을때
    const onEndReached = useCallback(() => {
        setPage((prevState) => prevState + 1);
    }, []);

    // 썸네일 공통 사용
    const memoizedValue = useCallback(
        ({item}) => {
            return <PurchaseHistoryThumb {...item}
                                         type={'purchase'}
                                         onPressList={() => onPressList(item)}
                                         onPressReview={onPressReview}
                                         navigation />;
        },
        [historyList]
    );

    return (
        <InstantLayout title={'구매이력'}>
            <Wrapper flexNum={1} backgroundColor={theme.color.backgroundGray}>
                {
                    historyList?
                        historyList.length > 0 ?
                            <FlatList
                                ref={scrollRef}
                                keyExtractor={(item, index) => index.toString()}
                                data={historyList}
                                windowSize={10}
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
                                <Txt size={'sm'} color={'textGray'} weight={'medium'} mt={20}>아직 구매하신 차량이 없어요.</Txt>
                            </Wrapper>
                        :
                        null
                }
            </Wrapper>
        </InstantLayout>
    )
}
export default PurchaseHistoryScreen;