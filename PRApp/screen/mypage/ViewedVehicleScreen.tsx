import React, {memo, useCallback, useEffect, useState, useRef} from 'react';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Text from "../../src/component/atom/Text";
import IRootStackParamList from "../../src/interface/IRootStackParamList";
import Wrapper from "../../src/component/atom/Wrapper";
import {ActivityIndicator, FlatList, Platform, SafeAreaView, TouchableOpacity, View, ScrollView} from "react-native";
import InstantLayout from "../../src/component/template/InstantLayout";
import Img from "../../src/component/atom/Img";
import theme from "../../public/theme";
import styled from "@emotion/native";
import theme_new from "../../public/theme_new";
import Txt from "../../src/component/atom/Txt";
import {getStorage} from "../../src/module/manageAsyncStorage";
import {observer} from "mobx-react";
import wishMastersApi from "../../src/api/mypage/getWishMastersApi";
import {numberComma} from "../../src/module/formatter";
import useDomReady from '../../src/hook/useDomReady';
import usePopup from "../../src/hook/usePopup";
import Toast from '../../src/component/atom/Toast';
import viewMastersApi1 from '../../src/api/mypage/viewMastersApi1';
import useLineWishEl from '../../src/hook/useWishEl/lineWish';
import deleteViewApi from '../../src/api/mypage/deleteViewMasterApi';
import { useIsFocused } from '@react-navigation/native';
import { formattedDate } from '../../src/module/formatter';
import getVehicleListByIdsApi from "../../src/api/cart/getVehicleByIdsApi";

type CartScreenProps = NativeStackScreenProps<IRootStackParamList, 'Cart'>;

interface IProWrapperStyle {
    value?: boolean
};

export enum StatusType {
    ACTIVE,
    DELETED,
    INACTIVE
}

const ViewedVehicleScreen = ({navigation} : any) => {
    const [vehicleList, setVehicleList] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [listRefresh, setListRefresh] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0); // 전체 대수
    const [isWishIds, setIsWishIds] = useState<any[]>([]);
    const toastRef = useRef<any>(null);
    const [viewDateArr, setViewDateArr] = useState<any[]>([]);
    const [historyDate, setHistoryDate] = useState(); // 날짜
    const {Popup, setPopupText} = usePopup();
    const isFocused = useIsFocused();

    useEffect(() => {
        isFocused && setPage(1);
        isFocused && setVehicleList([]);
    }, [isFocused]);

    // getViewMasters 실행
    useEffect(() => {
        isFocused &&  void getViewMasters(0, page);
    }, [isFocused, page]);

    useEffect(() => {
        isFocused && getWishMasters();
    }, [isFocused])

    useEffect(() => {
        console.log('updatedAtz', viewDateArr)
    },[viewDateArr]);

    // TODO: 날짜 필터링
    // useEffect(() => {
    //     // const DateValue = vehicleList.filter((value) => value.updatedAt)
    //     const DateValue = vehicleList.reduce((prev, current) => {
    //         console.log('---------')
    //         console.log('prev', prev)
    //         console.log('current', current)
    //         console.log('current====prv', prev === current);
    //         const newViewDate = vehicleList.filter((curr:any) => curr.updatedAt === prev.updatedAt)[0];
    //         console.log('filttttter ------------', newViewDate?.updatedAt);
    //
    //         return current;
    //     }, 0)
    //     console.log('날짜 필터', DateValue);
    // },[vehicleList])

    // TODO: API CarMasters (DONE)
    const getViewMasters = useCallback(async (renderedAmount: number, page: number) => {
        const userId = await getStorage('carmerceUser');
        const data = {page}
        console.log('data', data);
        await viewMastersApi1(data, navigation)
            .then((res) => {
                console.log('viewMastersApi1 res : ', res);
                const list:any[] = res?.viewMasters?.edges.map((el: any) => el?.node);
                // console.log(list)
                const newTotalCount = res?.viewMasters?.totalCount;
                setTotalCount(newTotalCount); // 총 갯수
                console.log('list', list);
                console.log('totalCount is ', totalCount);
                setTotalPage(Math.ceil(res?.viewMasters?.totalCount / 100))

                const viewList = list.map((el: any)=> ({updatedAt : el?.updatedAt, targetId: el?.targetId}));

                if (newTotalCount > 0) {
                    const wishListIds = viewList.map((el: any) => Number(el?.targetId))
                    getVehicleList(wishListIds, viewList).then((resultLength:number) => {
                        if (resultLength !== -1) {
                            const stackedRenderedAmount = renderedAmount + resultLength;
                            if(stackedRenderedAmount < 5 ) {
                                setPage((prevState) => prevState + 1);
                                getViewMasters( stackedRenderedAmount , page + 1)
                            }
                        }
                    });
                }
            })
    }, [page, totalPage, vehicleList, viewDateArr]);

    useEffect(() => {console.log('totalCount', totalCount)}, [totalCount])

    // getVehicleListByIds API 실행
    const getVehicleList = async (vehicleIdList: number[], viewList: any[]): Promise<number> => {
        let resultLength = -1;
        await getVehicleListByIdsApi(vehicleIdList, navigation)
            .then((res) => {
                const resArr = res?.getVehicleListByIds
                console.log('getVehicleListByIdsApi res : ', resArr);
                // add updatedDate and resArr
                console.log('viewListttttttt', viewList);
                const parsedWishList =  resArr&&resArr.map((wish:any) => ({
                    ...wish, updatedAt: viewList?.filter((view) => (view.targetId == wish.id))?.[0]?.updatedAt
                }))
                console.log('parsedWishList', parsedWishList);

                setVehicleList((p) => [...p, ...parsedWishList]); // 리프레쉬할때마다 겹겹히 쌓이게
                resultLength = (res?.getVehicleListByIds as any[]).length || -1; // 컨텐츠가 있는 챠량 길이
            })
        return resultLength;
    };

    // wishIds 구하기
    const getWishMasters = useCallback(async() => {
        const wishSize = 100;
        const data = {page: 1, size: wishSize}
        await wishMastersApi(data, navigation)
            .then((res) => {
                console.log('getWishMasters res: ', res && res.wishMasters);
                const list:any[] = res?.wishMasters?.edges.map((el:any) => el?.node);
                setIsWishIds(list.map((el: any) => Number(el?.targetId)));
            })
    }, []);

    // 전체 삭제 클릭 시
    const onClickDelete = useCallback( async (ids:number[]) => {
        const userId = await getStorage('carmerceUser');
        const id = userId && userId.id;
        setTotalCount(totalCount - ids.length);
        await deleteViewApi(id, navigation)
            .then((response) => {
                console.log('deleteViewApi res is ', response);
                response && response.deleteView && setVehicleList([])
                response && response.deleteView && setPage(1);
                response && response.deleteView && setTotalCount(0);
            })
    },[navigation, totalCount, vehicleList, page])

    // DeleteSelectionBtn
    const DeleteSelectionBtn = useCallback(({onPress}) => {
        return (
            <TouchableOpacity onPress={onPress}>
                <Wrapper w row>
                    <Txt children={'전체 삭제'} size={'sm'} color={'textGray'} />
                </Wrapper>
            </TouchableOpacity>
        )
    }, []);

    const onPressItem = useCallback((id: number) => {
        console.log('isCheckedId', id);
        navigation.navigate('SearchDetailScreen', {id: id})
    },[])

    const CartItem = useCallback((
        { isWishIds, setIsWishIds, manufacturer, id, modelYear, modelName, salePrice, price, onPressVehicleId, imageList}
    ) => {
        const android = Platform.OS === 'android';
        const domReady = useDomReady();
        const isWish = (isWishIds as Array<any>) && (isWishIds as Array<any>).includes(id);
        const wish = useLineWishEl({initialValue: isWish, id, type:'medium'}, navigation);
        const calcPrice = Math.round(price / 10000);

        useEffect( () => {
            if(domReady) {
                wish.isWish? setIsWishIds((el:any) => [...el, id]) : setIsWishIds((el:any) => (el.filter((_id: any) => (id !==_id))));
            }
        }, [wish.isWish]);

        return (

                <ProductWrapper row between mb={20}>
                    <TouchableOpacity onPress={onPressVehicleId} activeOpacity={1}>
                    <Wrapper row>
                        {/* 상품 이미지 */}
                        {
                            imageList ? (
                                <Wrapper bgColor={'#e9e9e9'} height={90}>
                                    <Img src={{uri: `https://dev-api.carmerce.co.kr/dev/cloud/storage?name=${imageList}`}} width={90} height={90} />
                                </Wrapper>
                            ) : (
                                <Wrapper width={90} height={90} backgroundColor={'#eee'} />
                            )
                        }
                        {/*상품 텍스트*/}
                        <Wrapper ml={android ? 12 : 20} width={170}>
                            {/*Title*/}
                            {/* <TitleTxt children={titleOverflow ? `${modelYear} ${newTitle}` : `${modelYear} ${modelName}`} size={'sm'} weight={'bold'}/> */}
                            <TitleTxt children={`${modelYear} ${manufacturer} ${modelName}`} size={'sm'} weight={'regular'} style={{marginTop: 10}}/>
                            <Wrapper row w mt={10}>
                                <PriceTitleTxt children={'신차가'} size={'xs'} color={'gray'} weight={'medium'} />
                                {/*newCarPrice*/}
                                <PriceTxt children={price === null ? 0 : `${numberComma(Math.round(price / 10000))}` + ' 만원'} />
                            </Wrapper>
                            <Wrapper row w mt={2}>
                                {/*discountRate*/}
                                <DiscountTxt children={`${Math.floor( ( salePrice / calcPrice)* 100)}` + '%'}/>
                                <Wrapper row w ml={2}>
                                    {/*salePrice*/}
                                    <SalePriceTxt children={numberComma(Number(salePrice))} />
                                    <WonTxt children={' 만원'} />
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>
                    </TouchableOpacity>
                    <Wrapper mt={10}>
                        <wish.Element />
                    </Wrapper>
                </ProductWrapper>
        )
    } , [navigation]);


    const CartHeader = memo(() => (
        <BtnCheckWrapper flexDirection={'row-reverse'} mt={7}>
            <DeleteSelectionBtn onPress={onClickDelete} />
        </BtnCheckWrapper>
    ));

    const onEndReached = useCallback(() => {
        console.log('onEndReached')
        if (listRefresh < totalPage) {
            setPage((prevState) => prevState + 1);
            setListRefresh((prevState) => prevState + 1);
            toastRef.current.show('불러오는 중입니다.')
        }
    }, [listRefresh, totalPage, toastRef]);

    const FlatListDom = ({vehicleList}: any) => {
        return(
            vehicleList.map((item:any,key:number) => {
                return <CartItem
                    key={key}
                    id={item?.id}
                    imageList={item?.imageList[0]?.name}
                    isWishIds={isWishIds}
                    setIsWishIds={setIsWishIds}
                    manufacturer={item?.manufacturer}
                    modelYear={item?.modelYear}
                    modelName={item?.modelName}
                    modelTrim={item?.modelTrim}
                    salePrice={item?.salePrice === null ? '0' : item?.salePrice}
                    price={item?.price === null ? '0' : item?.price}
                    onPressVehicleId={() => onPressItem(item?.id)}
                />
            })
        )
    }

    return (
        <>
            <InstantLayout title={'최근 본 차량'}>
                <Wrapper flexNum={1}>
                    <Wrapper flexNum={1} d
                             bgColor={theme.color.white}>
                        {page === 1 && totalCount === 0 || vehicleList.length === 0 ? (
                            <>
                                <Wrapper flexNum={1} bgColor={theme.color.white} pt={20} w h>
                                    <Wrapper w h>
                                        <Img src={require('../../public/image/component/icon-exclamation.png')} width={65}
                                             height={65}/>
                                        <Txt children={'최근 본 차량이 없어요.'} color={theme.color.textGray} size={'sm'}
                                             weight={'medium'} mt={20} style={{opacity: 0.48}}/>
                                    </Wrapper>
                                </Wrapper>
                            </>
                        ) : (
                            <>
                                <CartHeader/>
                                <ScrollView
                                    // bounces={false}
                                    onScrollEndDrag={({nativeEvent}) => {
                                        const isCloseToBottom = ({
                                             layoutMeasurement,
                                             contentOffset,
                                             contentSize
                                         }: any) => layoutMeasurement.height + contentOffset.y >=
                                            contentSize.height - 1;
                                        if (isCloseToBottom(nativeEvent)) {
                                            console.log('end');
                                            onEndReached()
                                        }
                                    }}>
                                    <FlatListDom vehicleList={vehicleList}/>
                                </ScrollView>
                            </>
                        )}
                    </Wrapper>
                </Wrapper>
            </InstantLayout>
            <Toast ref={toastRef} />
            <Popup />
        </>
    )
};

export default observer(ViewedVehicleScreen);

const BtnWrapper = styled(Wrapper)`
  border: 1px solid ${theme_new.colors.border};
  border-radius: 5px;
  height: 30px;
  padding: 8px 8px;
`;

const BtnCheckWrapper = styled(Wrapper)`
  padding: 11px 0;
  background-color: ${theme_new.colors.black.white};
`;

const ProductWrapper = styled(Wrapper)`
  background-color: ${theme_new.colors.black.white};
`;

const TitleTxt = styled(Txt)`
  font-family: ${theme.font.bold};
  color: ${theme_new.colors.black.blackGray};
  font-size: ${theme.size.sm};
  max-height: 38px;
  overflow: hidden;
`;

const PriceTitleTxt = styled(Txt)`
  font-size:${theme.size.xs};
  color: ${theme_new.colors.black.gray};
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

const ButtonWrapper = styled(Wrapper)`
  padding: 13px 15px;
  background-color: ${theme_new.colors.black.white};
  //box-shadow: 0 -3px 5px 0 rgba(0, 0, 0, 0.05);
`;

const Line = styled(Wrapper)`
  width: 1px;
  height: 12px;
  background-color: #d8d8d8;
`;
