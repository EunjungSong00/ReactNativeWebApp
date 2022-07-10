import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import Text from '../../src/component/atom/Text';
import Wrapper from '../../src/component/atom/Wrapper';
import {ActivityIndicator, FlatList, NativeScrollEvent, NativeSyntheticEvent, Platform, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import InstantLayout from '../../src/component/template/InstantLayout';
import Img from '../../src/component/atom/Img';
import theme from '../../public/theme';
import styled from '@emotion/native';
import theme_new from '../../public/theme_new';
import Txt from '../../src/component/atom/Txt';
import ButtonNew from '../../src/component/atom/ButtonNew';
import cartMastersApi from '../../src/api/cart/cartMastersApi';
import {observer} from 'mobx-react';
import {useStores} from '../../src/module/store';
import useDomReady from '../../src/hook/useDomReady';
import Toast from '../../src/component/atom/Toast';
import {numberComma} from '../../src/module/formatter';
import usePopup from '../../src/hook/usePopup';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import useWishEl from '../../src/hook/useWishEl';
import wishMastersApi from '../../src/api/mypage/getWishMastersApi';
import {useIsFocused} from '@react-navigation/native';
import deleteCartMasterApi from '../../src/api/cart/deleteCartMasterApi';
import getVehicleListByIdsApi from '../../src/api/cart/getVehicleByIdsApi';

export enum StatusType {
  ACTIVE,
  DELETED,
  INACTIVE
}

const CartScreen = ({navigation}: NavigationStackScreenProps) => {
  const [vehicleList, setVehicleList] = useState<any[]>([]);
  const [listRefresh, setListRefresh] = useState(1);
  const [page, setPage] = useState(1);
  const [wishPage, setWishPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const toastRef = useRef<any>(null);
  const [isCheckedId, setIsCheckedId] = useState(-1);
  const [isWishIds, setIsWishIds] = useState<any[]>([]);
  const [carData, setCarData] = useState<any>();
  const {vehicleStore} = useStores();
  const isFocused = useIsFocused();
  const [ids, setIds] = useState<number[]>([]);
  const Android = Platform.OS === 'android';

  const {Popup, setPopupText} = usePopup();

  useEffect(() => {
    isFocused && setPage(1);
    isFocused && setVehicleList([]);
    isFocused && getWishMasters();
  }, [isFocused]);

  useEffect(() => {
    isFocused && getCartMasters(0, page);
  }, [page, isFocused]);

  //getCartMasters
  const getCartMasters = useCallback(
    async (renderAmount: number, page: number) => {
      const data = {page: page};
      await cartMastersApi(data, navigation).then((res) => {
        const list: any[] = res?.cartMasters?.edges.map((el: any) => el?.node);
        const responseTotalCount = res?.cartMasters?.totalCount;
        setTotalCount(responseTotalCount);
        setTotalPage(Math.ceil(res && res.cartMasters && res.cartMasters.totalCount / 100));
        setIds(list.map((el: any) => Number(el?.vehicleId)));
        if (responseTotalCount > 0) {
          getVehicleListByIdsList(list.map((el: any) => Number(el?.vehicleId))).then((resultLength: number) => {
            const StackAmount = renderAmount + resultLength;
            if (StackAmount < 5) {
              setPage((prevStage) => prevStage + 1);
              getCartMasters(StackAmount, page + 1);
            }
          });
        }
      });
    },
    [page, totalPage, vehicleList, ids]
  );

  // getWishList API 실행
  const getVehicleListByIdsList = useCallback(
    async (vehicleIdList: any[]) => {
      let resultLength = -1;
      await getVehicleListByIdsApi(vehicleIdList, navigation).then((res) => {
        console.log('getVehicleListByIdsApi res : ', res?.getVehicleListByIds);
        setVehicleList((p) => [...p, ...res?.getVehicleListByIds]);
        resultLength = res?.getVehicleListByIds?.length || -1;
      });
      return resultLength;
    },
    [navigation]
  );

  // getWishMasters
  const getWishMasters = useCallback(async () => {
    const wishSize = 100;
    const data = {page: wishPage, size: wishSize};
    await wishMastersApi(data, navigation).then((res) => {
      // console.log('getWishMasters res: ', res && res.wishMasters);
      const list: any[] = res?.wishMasters?.edges.map((el: any) => el?.node);
      setIsWishIds(list.map((el: any) => Number(el?.targetId)));
    });
  }, []);

  // 전체삭제
  const onClickDeleteAll = useCallback(async () => {
    const idList: number[] = ids;
    await deleteCartMasterApi(idList, 'DELETE_ALL', navigation).then((response) => {
      response && response.deleteCartMaster && setVehicleList([]);
    });
  }, [vehicleList, ids, navigation]);

  // 선택삭제 클릭 시
  const onClickDelete = useCallback(
    async (id: number) => {
      if (id < 0) {
        setPopupText('삭제할 차량을 선택해주세요.');
      } else {
        const ids = Number(id);
        await deleteCartMasterApi(ids, 'DELETE_ONE', navigation).then((response) => {
          console.log('response', response);
          response.deleteCartMaster && setVehicleList(vehicleList.filter((el) => el.id !== id));
          response.deleteCartMaster && setIsCheckedId(-1);
        });
      }
    },
    [vehicleList, navigation, isCheckedId]
  );

  // TODO: 구매하기 클릭 시
  const onClickPurchase = useCallback(
    async (id: number, carData: any) => {
      vehicleStore.setVehicleInfo(carData);
      vehicleStore.setVehicleId(id);
      navigation.navigate('PurchaseScreen', {id, carData});
    },
    [vehicleList]
  );

  // DeleteSelectionBtn
  const DeleteSelectionBtn = useCallback(({title, width, onPress, mr}) => {
    return (
      <BtnWrapper width={width} mr={mr}>
        <TouchableOpacity onPress={onPress}>
          <Wrapper w h row>
            <Img src={require('../../public/image/cart/icon-X.png')} width={9} height={9} style={{marginTop: -3}} />
            <Text children={title} size={13} color={theme_new.colors.black.blackGray} ml={5} mt={-3} letterSpacing={-0.5} />
          </Wrapper>
        </TouchableOpacity>
      </BtnWrapper>
    );
  }, []);

  const onPressItem = useCallback((id: number) => {
    navigation.navigate('SearchDetailScreen', {id: id});
  }, []);

  const CartItem = useCallback(
    ({
      isCheckedId,
      setIsCheckedId,
      isWishIds,
      setIsWishIds,
      setCarData,
      id,
      manufacturer,
      modelYear,
      modelName,
      modelTrim,
      mileage,
      transmission,
      salePrice,
      price,
      status,
      imageList,
      onPressVehicleId
    }) => {
      // const titleOverflow = modelName?.length >= 30 ;
      // const newModelName = modelName?.substring(0, 29) + '..';
      const android = Platform.OS === 'android';
      const domReady = useDomReady();
      const isCheck = isCheckedId === id;
      const isWish = (isWishIds as Array<any>) && (isWishIds as Array<any>).includes(id);
      const wish = useWishEl({initialValue: isWish, id}, navigation);
      const calcPrice = Math.round(price / 10000);
      const _price = Math.round(price / 10000);
      const _carData = {id, manufacturer, modelYear, modelName, modelTrim, mileage, transmission, salePrice, price: _price, imageList};

      useEffect(() => {
        if (domReady) {
          wish.isWish ? setIsWishIds((el: any) => [...el, id]) : setIsWishIds((el: any) => el.filter((_id: any) => id !== _id));
        }
      }, [wish.isWish]);

      return (
        <ProductWrapper
          row
          marginX={20}
          mt={20}
          paddingX={isCheck ? 17 : 18}
          paddingY={isCheck ? 14 : 15}
          style={isCheck ? {borderWidth: 2, borderColor: theme_new.colors.mainColor.primary} : {borderWidth: 1, borderColor: theme_new.colors.border}}
        >
          {/* 상품 상태 start */}
          {status === 'SALE_COMPLETED_OUT_PLATFORM' && (
            <Wrapper bgColor={theme.color.thumbGray} w h style={{borderRadius: 10, zIndex: 10, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
              <Txt children={'판매가 완료된 차량입니다.'} color={'white'} size={'sm'} />
            </Wrapper>
          )}
          {status === 'PAYMENT_PROGRESS' && (
            <Wrapper bgColor={theme.color.thumbGray} w h style={{borderRadius: 10, zIndex: 10, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
              <Txt children={'주문 진행 중인 차량이에요.'} color={'white'} size={'sm'} />
            </Wrapper>
          )}
          {status === 'SALE_HOLD' && (
            <Wrapper bgColor={theme.color.thumbGray} w h style={{borderRadius: 10, zIndex: 10, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
              <Txt children={'판매자가 차량을 정비 중이에요.'} color={'white'} size={'sm'} />
            </Wrapper>
          )}
          {/* 상품 상태 end */}

          {/* 상품 체크 박스 start */}
          <TouchableOpacity
            onPress={() => {
              isCheck ? setIsCheckedId(-1) : setIsCheckedId(id);
              isCheck ? setCarData(undefined) : setCarData(_carData);
            }}
          >
            <Img src={isCheck ? require('../../public/image/component/cart-check-on.png') : require('../../public/image/component/cart-check-off.png')} width={20} height={20} />
          </TouchableOpacity>
          {/* 상품 체크 박스 end */}

          {/* 상품 이미지 start */}
          <Wrapper bgColor={'#e9e9e9'} ml={android ? 12 : 15} height={80}>
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
          {/* 상품 이미지 end */}

          {/* 상품 텍스트 start */}
          <TouchableOpacity onPress={onPressVehicleId} activeOpacity={1}>
            <Wrapper ml={android ? 12 : 20} width={170}>
              {/*Title*/}
              {/* <TitleTxt children={titleOverflow ? `${modelYear} ${newTitle}` : `${modelYear} ${modelName}`} size={'sm'} weight={'bold'}/> */}
              <TitleTxt children={`${modelYear} ${manufacturer} ${modelName}`} size={'sm'} weight={'bold'} />
              {/*trimTitle*/}
              <TrimTxt children={modelTrim} size={'xs'} style={{marginTop: 8}} color={theme_new.colors.black.blackGray} />
              <Wrapper row w>
                {/*mileage*/}
                <Txt children={numberComma(Number(mileage)) + 'km'} size={'xs'} color={theme_new.colors.black.black} weight={'medium'} />
                {/*transmission*/}
                <Txt children={transmission} size={'xs'} color={theme_new.colors.black.black} style={{marginLeft: 5}} weight={'medium'} />
              </Wrapper>
              <Wrapper row w mt={10}>
                <PriceTitleTxt children={'신차가'} size={'xs'} color={'gray'} weight={'medium'} />
                {/*newCarPrice*/}
                <PriceTxt children={price === null ? 0 : `${numberComma(_price)}` + ' 만원'} />
              </Wrapper>
              <Wrapper row w mt={2}>
                {/*discountRate*/}
                <DiscountTxt children={`${Math.floor((salePrice / calcPrice) * 100)}` + '%'} />
                <Wrapper row w ml={2}>
                  {/*salePrice*/}
                  <SalePriceTxt children={numberComma(Number(salePrice))} />
                  <WonTxt children={' 만원'} />
                </Wrapper>
              </Wrapper>
            </Wrapper>
          </TouchableOpacity>
          {/* 상품 텍스트 end */}
        </ProductWrapper>
      );
    },
    [navigation]
  );

  const CartHeader = memo(() => (
    <BtnCheckWrapper flexDirection={'row-reverse'}>
      <Wrapper row>
        <DeleteSelectionBtn title={'전체 삭제'} width={80} onPress={onClickDeleteAll} mr={3} />
        <DeleteSelectionBtn title={'선택 삭제'} width={84} onPress={() => onClickDelete(isCheckedId)} />
      </Wrapper>
    </BtnCheckWrapper>
  ));

  const onEndReached = useCallback(() => {
    if (listRefresh < totalPage) {
      setPage((prevState) => prevState + 1);
      setListRefresh((prevState) => prevState + 1);
      toastRef.current.show('불러오는 중입니다.');
    }
  }, [listRefresh, totalPage, toastRef]);

  const FlatListDom = ({vehicleList}: any) => {
    return vehicleList.map((item: any, key: number) => {
      return (
        <CartItem
          key={key}
          id={item?.id}
          manufacturer={item?.manufacturer}
          status={item?.status}
          imageList={item?.imageList[0]?.name}
          isCheckedId={isCheckedId}
          setIsCheckedId={setIsCheckedId}
          isWishIds={isWishIds}
          setIsWishIds={setIsWishIds}
          setCarData={setCarData}
          modelYear={item?.modelYear}
          modelName={item?.modelName}
          modelTrim={item?.modelTrim}
          mileage={item?.mileage}
          transmission={item?.transmission}
          salePrice={item?.salePrice === null ? '0' : item?.salePrice}
          onPressVehicleId={() => onPressItem(item?.id)}
          price={item?.price === null ? '0' : item.price}
        />
      );
    });
  };
  return (
    <Wrapper flexNum={1} bgColor={theme.color.white}>
      <InstantLayout title={'장바구니'}>
        <Wrapper flexNum={1}>
          {vehicleList ? (
            vehicleList.length > 0 ? (
              <>
                <Wrapper>
                  <CartHeader />
                  <ScrollView
                    // bounces={false}
                    style={{marginBottom: Android ? 133 : 117}}
                    onScrollEndDrag={({nativeEvent}) => {
                      const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
                      if (isCloseToBottom(nativeEvent)) {
                        console.log('end');
                        onEndReached();
                      }
                    }}
                  >
                    <FlatListDom vehicleList={vehicleList} />
                  </ScrollView>
                </Wrapper>
                <ButtonWrapper style={{bottom: Android ? 0 : -16}}>
                  <ButtonNew height={'50px'} title={`구매하기`} onPress={() => onClickPurchase(isCheckedId, carData)} disabled={isCheckedId < 0} />
                </ButtonWrapper>
              </>
            ) : (
              <>
                <Wrapper flexNum={1} bgColor={theme.color.white} d pt={20} w h>
                  <Wrapper w h>
                    <Img src={require('../../public/image/component/icon-exclamation.png')} width={65} height={65} />
                    <Txt children={'아직 등록하신 차량이 없어요.'} color={theme.color.textGray} size={'sm'} weight={'medium'} mt={20} style={{opacity: 0.48}} />
                  </Wrapper>
                </Wrapper>
              </>
            )
          ) : null}
        </Wrapper>
      </InstantLayout>
      <Toast ref={toastRef} />
      <Popup />
    </Wrapper>
  );
};

export default observer(CartScreen);

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
  font-size: ${theme.size.xs};
  color: ${theme_new.colors.black.gray};
`;

const PriceTxt = styled(Txt)`
  font-size: ${theme.size.xs};
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
  padding: 13px 15px 0;
  background-color: ${theme_new.colors.black.white};
  position: absolute;
  width: 100%;
  height: 80px;
  bottom: -35px;
  z-index: 1;
  //border: 1px solid;
  //box-shadow: 0 -3px 5px 0 rgba(0, 0, 0, 0.05);
`;

const TrimTxt = styled(Txt)`
  //width: 200px;
  //border: 1px solid;
`;
