import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import VersionCheck from 'react-native-version-check';
import theme from '../../public/theme';
import {useStores} from '../../src/module/store';
import {clearStorage, getStorage} from '../../src/module/manageAsyncStorage';
import wishCountApi from '../../src/api/mypage/wishCountApi';
import OrderStateCountApi from '../../src/api/mypage/OrderStateCountApi';
import purchaseHistoryCountApi from '../../src/api/mypage/purchaseHistoryCountApi';
import checkReviewApi from '../../src/api/mypage/checkReviewApi';
import Wrapper from '../../src/component/atom/Wrapper';
import Txt from '../../src/component/atom/Txt';
import Img from '../../src/component/atom/Img';

interface IStateDom {
  title: string;
  value?: string;
  line?: boolean;
  routeName?: string;
}

interface IMenuDom {
  title: string;
  line?: boolean;
  routeName?: string;
  type?: string;
  text?: string;
  onPress?: () => void;
}

const currentVersion = VersionCheck.getCurrentVersion().trim() + '';

/*마이페이지 메인*/
const MyPageScreen = ({navigation}: NavigationStackScreenProps) => {
  const [userName, setUserName] = useState<string>();
  const [wishVehicleList, setWishVehicleList] = useState<string>();
  const [orderState, setOrderState] = useState<string>();
  const [purchaseHistory, setPurchaseHistory] = useState<string>();
  const [reviewWrite, setReviewWrite] = useState<string>();
  const {userInfoStore} = useStores();
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && getWishVehicleListCount();
  }, [isFocused]);

  const getWishVehicleListCount = useCallback(async () => {
    const carmerceUser: any = await getStorage('carmerceUser');
    setUserName(carmerceUser?.name);
    const userId = carmerceUser?.id;
    if (carmerceUser?.name && userId) {
      const data = {
        userId,
        navigation
      };
      wishCountApi(data).then((res) => {
        if (res?.wishCount || res?.wishCount === 0) {
          setWishVehicleList(`${res.wishCount}`);
        }
        getOrderPurchaseCount(userId);
      });
    }
  }, []);

  const getOrderPurchaseCount = useCallback((value: string) => {
    const data = {
      userId: value,
      navigation
    };
    OrderStateCountApi(data).then((res) => {
      if (res.queryOrdersForCustomer) {
        setOrderState(`${res.queryOrdersForCustomer.orders?.length}`);
      }
    });
    purchaseHistoryCountApi(data).then((res) => {
      if (res.purchaseHistory) {
        const orderList = res.purchaseHistory.orders;
        setPurchaseHistory(`${orderList?.length}`);
        // console.log('purchaseHistoryApi', orderList)
        let orderArr: number[] = [];
        orderList.map((item: any) => {
          JSON.parse(item?.vehicleDetailJson)?.vehicle?.id && orderArr.push(JSON.parse(item?.vehicleDetailJson)?.vehicle?.id);
        });
        orderArr.length > 0 ? getReviewList(orderArr) : setReviewWrite('0');
      }
    });
  }, []);

  const getReviewList = useCallback((value: number[]) => {
    const data = {
      vehicleIds: value,
      navigation
    };
    checkReviewApi(data).then((res) => {
      const listTmp = [];
      if (res.checkReview) {
        res.checkReview.map((item: boolean, index: number) => {
          item && listTmp.push(item);
        });
        setReviewWrite(`${listTmp.length}`);
      }
    });
  }, []);

  const StateDom = useCallback(
    ({title, value = '-', line, routeName}: IStateDom) => (
      <>
        <Wrapper flexNum={1} borderRightWidth={line ? 1 : 0} borderColor={theme.color['lineGray35']}>
          <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate(routeName!)}>
            <Txt size={'lg'} weight={'thick'} color={'white'} textAlign={'center'}>
              {value}
            </Txt>
            <Txt size={'xs'} weight={'thick'} color={'white'} textAlign={'center'}>
              {title}
            </Txt>
          </TouchableOpacity>
        </Wrapper>
      </>
    ),
    []
  );

  const MenuDom = useCallback(
    ({title, line, routeName, type, text, onPress}: IMenuDom) => (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => (routeName ? (type ? navigation.navigate(routeName, {type, title}) : navigation.navigate(routeName)) : onPress ? onPress() : null)}
      >
        <Wrapper row h between d paddingY={15} borderBottomWidth={line ? 1 : 0} borderColor={theme.color.lineGray35}>
          <Txt size={'sm'} weight={'medium'} lineHeight={24}>
            {title}
          </Txt>
          {routeName ? <Img src={require('../../public/image/common/icon-arrow-right.png')} width={24} height={24} /> : null}
          {text ? (
            <Txt size={'sm'} weight={'medium'} en>
              {text}
            </Txt>
          ) : null}
        </Wrapper>
      </TouchableOpacity>
    ),
    []
  );

  const logout = useCallback(() => {
    clearStorage();
    userInfoStore.setUserToken({accessToken: '', refreshToken: ''});
    const LogoutAction: any = CommonActions.reset({
      index: 1,
      routes: [{name: 'Gnb'}, {name: 'LoginScreen'}]
    });
    navigation.dispatch(LogoutAction);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <Wrapper>
          <Wrapper d>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('NotificationScreen')}>
              <Wrapper mt={16} width={18}>
                <Img src={require('../../public/image/common/icon-notification.png')} width={21} height={21} />
                {/*<Wrapper w h width={18} height={18} position={'absolute'} backgroundColor={theme.color.red} borderRadius={18} style={{right: -10, top: -6}}>
                  <Txt size={'xxs'} color={'white'} weight={'thick'}>1</Txt>
                </Wrapper>*/}
              </Wrapper>
            </TouchableOpacity>
            <Wrapper marginY={15}>
              <Txt size={'lg'} weight={'thick'} color={'primary'}>
                안녕하세요 {userName || '-'}님
              </Txt>
              <Txt size={'lg'} weight={'medium'} color={'primary'}>
                차사기 좋은 날이에요!
              </Txt>
            </Wrapper>
            <Wrapper row between backgroundColor={theme.color.primary} borderRadius={8} paddingY={20}>
              <StateDom title={'관심차량'} routeName={'WishVehicleListScreen'} value={wishVehicleList} line />
              <StateDom title={'주문상태'} routeName={'OrderStateScreen'} value={orderState} line />
              <StateDom title={'구매이력'} routeName={'PurchaseHistoryScreen'} value={purchaseHistory} line />
              <StateDom title={'리뷰작성'} routeName={'ReviewWriteScreen'} value={reviewWrite} />
            </Wrapper>
          </Wrapper>
          <Wrapper>
            <MenuDom title={'최근 본 차량'} routeName={'ViewedVehicleScreen'} line />
            <MenuDom title={'내 정보 관리'} routeName={'EditProfileAuthScreen'} />
          </Wrapper>
        </Wrapper>
        <Wrapper backgroundColor={theme.color.backgroundGray}>
          <Wrapper mt={12} backgroundColor={'white'}>
            <MenuDom title={'환불 및 배송안내'} routeName={'RefundInformationScreen'} line />
            <MenuDom title={'고객센터'} routeName={'ServiceCenterScreen'} line />
            <MenuDom title={'공지사항'} routeName={'NotificationScreen'} />
          </Wrapper>
          <Wrapper mt={12} backgroundColor={'white'}>
            <MenuDom title={'서비스이용안내'} routeName={'TosScreen'} type={'customer'} line />
            <MenuDom title={'개인정보처리방침'} routeName={'TosScreen'} type={'personalInformation'} line />
            <MenuDom title={'버전정보'} line text={`v ${currentVersion}`} />
            <MenuDom title={'로그아웃'} onPress={logout} />
          </Wrapper>
        </Wrapper>
      </ScrollView>
    </SafeAreaView>
  );
};
export default MyPageScreen;
