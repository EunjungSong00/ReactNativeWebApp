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
import deleteWishApi from '../../src/api/mypage/deleteWishApi';
import useWishEl from '../../src/hook/useWishEl';
import useDomReady from '../../src/hook/useDomReady';
import usePopup from "../../src/hook/usePopup";
import Toast from '../../src/component/atom/Toast';
import getVehicleListByIdsApi from "../../src/api/cart/getVehicleByIdsApi";
import {useIsFocused} from "@react-navigation/native";

export enum StatusType {
    ACTIVE,
    DELETED,
    INACTIVE
}

const WishVehicleListScreen = ({navigation} : any) => {
    const [checkAll, setCheckAll] = useState(false);
    const [loading, setLoading] = useState(false); // 로딩
    // TODO: 2. 데이터
    const [vehicleList, setVehicleList] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [listRefresh, setListRefresh] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0); // 전체 대수
    const [count, setCount] = useState(0);
    const [isCheckedIds, setIsCheckedIds] = useState<any[]>([]);
    const [isWishIds, setIsWishIds] = useState<any[]>([]);
    const [vehicleIdsList, setVehicleIdsList] = useState<any[]>([]);
    const toastRef = useRef<any>(null);
    const {Popup, setPopupText} = usePopup();
    const isFocused = useIsFocused();

    useEffect(() => {
        isFocused && setPage(1);
        isFocused && setVehicleList([]);
    }, [isFocused]);

    // cartMasters 실행
    useEffect(() => {
        isFocused && getWishMasters(0, page);
    }, [isFocused, page]);

    useEffect(() => {
        isFocused && totalWishMaster();
        isFocused && getWishIdsMasters();
    }, [isFocused]);

    useEffect(() => {
        isFocused && setCount(isCheckedIds.length);
    },[isFocused, count, isCheckedIds]);

    // getWishMasters
    const getWishMasters = useCallback(async (renderAmount:number, page: number) => {
        const data = {page: page}
        await wishMastersApi(data, navigation)
            .then((res) => {
                console.log('wishMastersApi res : ', res);
                const list:any[] = res?.wishMasters?.edges.map((el: any) => el?.node);
                const newTotalCount = res?.wishMasters?.totalCount
                // setTotalCount(newTotalCount); // 총 갯수
                setTotalPage(Math.ceil(res?.wishMasters?.totalCount / 100))
                if (newTotalCount > 0) {
                    getVehicleList(list.map((el: any) => Number(el?.targetId))).then((resultLength: number) => {
                        const StackAmount = renderAmount + resultLength
                        if (StackAmount < 5 ) {
                            setPage((prevStage) => prevStage + 1);
                            getWishMasters(StackAmount, page + 1);
                        }

                    });
                }
            })

    }, [page, totalPage, vehicleList, vehicleIdsList]);

    // getVehicleList API 실행
    const getVehicleList = async (vehicleIdList: any[]) => {
        let resultLength = -1;
        await getVehicleListByIdsApi(vehicleIdList, navigation)
            .then((res) => {
                setVehicleList((p) => [...p, ...res?.getVehicleListByIds]);
                resultLength = res?.getVehicleListByIds?.length || -1;
            })
        return resultLength;
    };

    const totalWishMaster = useCallback(async () => {
        const carmerceUser = await getStorage('carmerceUser');
        const userId = carmerceUser && carmerceUser.id;
        const data = {userId: Number(userId), page: page}
        await wishMastersApi(data, navigation)
            .then((res) => {
                const newTotal = res?.wishMasters?.totalCount
                setTotalCount(newTotal); // 총 갯수
            })
    } ,[]);

    // wishIds 100개로!
    const getWishIdsMasters = useCallback( async() => {
        const carmerceUser = await getStorage('carmerceUser');
        const userId = carmerceUser && carmerceUser.id;
        const data = {userId: Number(userId), size: 100, page: 1}
        await wishMastersApi(data, navigation)
            .then((res) => {
                const list:any[] = res?.wishMasters?.edges.map((el: any) => el?.node);
                setIsWishIds(list.map((el: any) => Number(el?.targetId)));
                if(res?.wishMasters?.totalCount > 0) {
                    setVehicleIdsList(list.map((el: any) => Number(el?.targetId)))
                }
            })
    }, [vehicleIdsList]);

    // 일괄 선택
    const onClickCheckAll = useCallback((vehicleIdsList: any[]) => {
        setCheckAll(!checkAll);
        if (!checkAll) {
            const checkArr: any[] = [];
            vehicleIdsList.forEach((list) => checkArr.push(list))
            // FIXME : response 후에 삭제된 아이디 배열이 전체 선택시에 다시 나타남\
            setIsCheckedIds(checkArr);
            console.log('일괄 선택시 isCheckedIds', isCheckedIds)
        } else if (checkAll) {
            setIsCheckedIds([]);
        }
    },[checkAll, isCheckedIds, vehicleIdsList]);

    const onClickDelete = useCallback( async (ids:number[]) => {
        setTotalCount(totalCount - ids.length);
        await deleteWishApi(ids, navigation)
            .then((response) => {
                console.log('deleteWishApi res is ', response)
                response.deleteWish && setVehicleList((_vehicleList:any[])=> _vehicleList.filter((vehicle:any) => !ids.includes(vehicle.id)))
                response.deleteWish && setIsCheckedIds([]);
                response.deleteWish && setTotalCount(totalCount - ids.length);
                console.log('total', totalCount);
                console.log('삭제된 후에 isCheckedIds', isCheckedIds)
                // console.log('vehicleList', vehicleList);
            })

        console.log('삭제된 후에 isCheckedIds', isCheckedIds)
    },[navigation, totalCount, vehicleList, isCheckedIds, count])

    // CheckAllBtn
    const CheckAllBtn = useCallback(({value, onPress}) => {
        return (
            <TouchableOpacity onPress={onPress}>
                <Wrapper w row mr={10}>
                    <Text children={'일괄선택'} size={theme.size.sm} color={theme_new.colors.black.blackGray} ml={1} mt={-4} letterSpacing={-0.5}/>
                </Wrapper>
            </TouchableOpacity>
        )
    }, []);

    // DeleteSelectionBtn
    const DeleteSelectionBtn = useCallback(({onPress}) => {
        return (
            <TouchableOpacity onPress={onPress}>
                <Wrapper w row ml={10}>
                    <Text children={'삭제'} size={theme.size.sm} color={theme_new.colors.black.blackGray} ml={1} mt={-4} letterSpacing={-0.5}/>
                </Wrapper>
            </TouchableOpacity>
        )
    }, []);

    const CartItem = useCallback((
        { isCheckedIds, setIsCheckedIds, isWishIds, setIsWishIds, id, manufacturer, modelYear, modelName, modelTrim, mileage, transmission, salePrice, price, onPressVehicleId, imageList}
    ) => {

        const android = Platform.OS === 'android';
        const domReady = useDomReady();
        const isCheck = (isCheckedIds as Array<any>) && (isCheckedIds as Array<any>).includes(id);
        const wish = useWishEl({initialValue: isWishIds, id}, navigation);
        const calcPrice = Math.round(price / 10000);

        useEffect( () => {
            if(domReady) {
                wish.isWish? setIsWishIds((el:any) => [...el, id]) : setIsWishIds((el:any) => (el.filter((_id: any) => (id !==_id))));
            }
        }, [wish.isWish]);

        return (
                <ProductWrapper
                    row
                    marginX={20}
                    mt={20}
                    paddingX={18}
                    paddingY={15}
                    style={
                        isCheck
                            ? {borderWidth: 1, borderColor: "#98a5b1"}
                            : {borderWidth: 1, borderColor: theme_new.colors.border}}>
                    {/* 상품 체크 박스 */}
                    <TouchableOpacity onPress={()=>{
                        !isCheck
                            ? setIsCheckedIds((el: any)=> [...el, id]) : setIsCheckedIds((el: any) => (el.filter((_id: any)=> (id !==_id))));
                    }}>
                        <Img src={isCheck
                            ? require('../../public/image/component/icon-check-grey-on.png')
                            : require('../../public/image/component/icon-check-grey-off.png')}
                             width={20} height={20} />
                    </TouchableOpacity>
                    {/* 상품 이미지 */}
                    <Wrapper bgColor={'#e9e9e9'} ml={android ? 12: 15} height={80}>
                        <Wrapper style={{zIndex: 9, position: 'absolute', bottom: 5, right: 5}}>
                            <wish.Element />
                        </Wrapper>
                        <TouchableOpacity onPress={onPressVehicleId} activeOpacity={1}>
                            {
                                imageList ? (
                                    <Wrapper bgColor={'#e9e9e9'} height={80}>
                                        <Img src={{uri: `https://dev-api.carmerce.co.kr/dev/cloud/storage?name=${imageList}`}} width={80} height={80} />
                                    </Wrapper>
                                ) : (
                                    <Wrapper width={80} height={80} backgroundColor={'#eee'} />
                                )
                            }
                        </TouchableOpacity>
                    </Wrapper>
                    {/*상품 텍스트*/}
                    <TouchableOpacity activeOpacity={1} onPress={onPressVehicleId}>
                        <Wrapper ml={android ? 12 : 20} width={170}>
                            {/*Title*/}
                            {/* <TitleTxt children={titleOverflow ? `${modelYear} ${newTitle}` : `${modelYear} ${modelName}`} size={'sm'} weight={'bold'}/> */}
                            <TitleTxt children={`${modelYear} ${manufacturer} ${modelName}`} size={'sm'} weight={'bold'}/>
                            {/*trimTitle*/}
                            <Txt children={modelTrim} size={'xs'} style={{marginTop: 8}} color={theme_new.colors.black.blackGray}/>
                            <Wrapper row w>
                                {/*mileage*/}
                                <Txt children={numberComma(Number(mileage)) + 'km'} size={'xs'} color={theme_new.colors.black.black} weight={'medium'} />
                                {/*transmission*/}
                                <Txt children={transmission} size={'xs'} color={theme_new.colors.black.black} style={{marginLeft: 5}} weight={'medium'} />
                            </Wrapper>
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
                    </TouchableOpacity>
                </ProductWrapper>
        )
    } , [navigation]);

    const onPressItem = useCallback((id: number) => {
        console.log('isCheckedId', id);
        navigation.navigate('SearchDetailScreen', {id: id})
    },[])


    const CartHeader = memo(() => (
        <BtnCheckWrapper w row between>
            <Wrapper row>
                <Txt children={ `${count}`} weight={'bold'} size={'sm'} />
                <Txt children={ ` / ` + `${totalCount}` + '대'} weight={'regular'} size={'sm'} color={theme.color.lineGray5} />
            </Wrapper>
            <Wrapper row>
                <CheckAllBtn value={checkAll} onPress={() => onClickCheckAll(vehicleIdsList)} />
                <Line />
                <DeleteSelectionBtn onPress={() => onClickDelete(isCheckedIds)} />
            </Wrapper>
        </BtnCheckWrapper>
    ));

    const onEndReached = useCallback(() => {
        console.log('onEndReached')
        if (listRefresh < totalPage) {
            setListRefresh((prevState) => prevState + 1);
            setPage((prevState) => prevState + 1);
            toastRef.current.show('불러오는 중입니다.')
        }
    }, [listRefresh, totalPage, toastRef]);

    const FlatListDom = ({vehicleList}: any) => {
        return(
            vehicleList.map((item:any,key:number) => {
                return <CartItem
                    key={key}
                    id={item?.id}
                    manufacturer={item?.manufacturer}
                    imageList={item?.imageList[0]?.name}
                    isCheckedIds={isCheckedIds}
                    setIsCheckedIds={setIsCheckedIds}
                    isWishIds={isWishIds}
                    setIsWishIds={setIsWishIds}
                    modelYear={item?.modelYear}
                    modelName={item?.modelName}
                    modelTrim={item?.modelTrim}
                    mileage={item?.mileage}
                    transmission={item?.transmission}
                    salePrice={item?.salePrice === null ? '0' : item?.salePrice}
                    onPressVehicleId={() => onPressItem(item?.id)}
                    price={item?.price === null ? '0' : item?.price}/>
            })
        )
    }

    return (
        <>
            <InstantLayout title={'관심차량'}>
                <Wrapper flexNum={1}>
                    <Wrapper flexNum={1}>
                        {page === 1 && totalCount === 0 || vehicleList.length === 0 ? (
                            <>
                                <Wrapper flexNum={1} bgColor={theme.color.white} d pt={20} w h>
                                    <Wrapper w h>
                                        <Img src={require('../../public/image/component/icon-exclamation.png')} width={65}
                                             height={65}/>
                                        <Txt children={'아직 관심등록하신 차량이 없어요.'} color={theme.color.textGray} size={'sm'}
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
                        )
                        }
                        {/*)}*/}
                    </Wrapper>
                </Wrapper>
            </InstantLayout>
            <Toast ref={toastRef} />
            {/*</SafeAreaView>*/}
            <Popup />

        </>
    )
};

export default observer(WishVehicleListScreen);

const BtnWrapper = styled(Wrapper)`
  border: 1px solid ${theme_new.colors.border};
  border-radius: 5px;
  height: 30px;
  padding: 8px 8px;
`;

const BtnCheckWrapper = styled(Wrapper)`
  padding: 11px 20px;
  background-color: ${theme_new.colors.black.white};
`;

const ProductWrapper = styled(Wrapper)`
  background-color: ${theme_new.colors.black.white};
  border-radius: 10px;
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
