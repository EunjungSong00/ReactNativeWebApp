import React, {Dispatch, SetStateAction, Fragment, useEffect, useState} from 'react';
import Wrapper from '../../src/component/atom/Wrapper';
import Text from '../../src/component/atom/Text';
import InstantLayout from '../../src/component/template/InstantLayout';
import usePopup from '../../src/hook/usePopup';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import theme, {topNavStyle} from '../../public/theme';
import {Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, useWindowDimensions} from 'react-native';
import {activateErrorPopup, getPriceForm, numberComma} from '../../src/module/formatter';
import TextArea from '../../src/component/atom/TextArea';
import useInput from '../../src/hook/useInput';
import Button from '../../src/component/atom/Button';
import ScrollViewBetween from '../../src/component/template/ScrollViewBetween';
import faqCategoriesApi from '../../src/api/mypage/faqCategoriesApi';
import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';
import insertQnaMasterApi, {InsertQnaMasterQueryType} from '../../src/api/mypage/insertQnaMasterApi';
import viewMastersApi from '../../src/api/mypage/viewMastersApi';
import Img from '../../src/component/atom/Img';
import {getStorage} from '../../src/module/manageAsyncStorage';
import qnaMastersApi from '../../src/api/mypage/qnaMastersApi';
import getVehicleListByIdsApi from '../../src/api/mypage/getVehicleListByIdsApi';
import Txt from '../../src/component/atom/Txt';
import {SafeAreaView as NavigationSafeAreaView} from 'react-navigation';
import {useSafeAreaFrame, useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();
/*회원정보 수정 진입*/
const ServiceCenterScreen = ({navigation}: {navigation: StackNavigationProp}) => {
  const [nowTab, setnowTab] = useState<'FAQ' | '내 문의내역' | '문의하기'>('FAQ');
  const [faqData, setFaqData] = useState<any>();
  const [myQuestionData, setMyQuestionData] = useState<any>();
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  useEffect(() => {
    faqCategoriesApi(navigation).then((faqResponse) => {
      const _faqData = faqResponse?.faqCategories?.edges;
      setFaqData(_faqData);
      qnaMastersApi(navigation).then((qnaResponse) => {
        const _qnaData = qnaResponse?.qnaMasters;
        setMyQuestionData(_qnaData);
      });
    });
  }, []);

  return (
    <Wrapper flexNum={1} bgColor={theme.color.white}>
      <NavigationSafeAreaView style={{top: insets.top, height: frame.height - insets.top}} forceInset={{top: 'never'}}>
        <Wrapper row w h bgColor="#fff" width={'100%'} height={50} borderBottomWidth={0} borderColor={'#cccccc'}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{position: 'absolute', left: 20}}>
            <Image source={require('../../public/image/component/icon-back.png')} />
          </TouchableOpacity>
          <Txt size={'md'} weight={'bold'}>
            고객센터
          </Txt>
        </Wrapper>
        <Wrapper flex={1} bgColor="#f1f2f4" width={'100%'}>
          <Tab.Navigator screenOptions={{...topNavStyle}}>
            <Tab.Screen
              name="FAQ"
              listeners={{
                swipeEnd: () => setnowTab('FAQ')
              }}
            >
              {(props) => <FAQ {...props} data={faqData} />}
            </Tab.Screen>
            <Tab.Screen
              name="내 문의내역"
              listeners={{
                swipeEnd: () => setnowTab('내 문의내역')
              }}
            >
              {(props) => <MyQuestion {...props} data={myQuestionData} nowTab={nowTab} />}
            </Tab.Screen>
            <Tab.Screen
              name="문의하기"
              listeners={{
                swipeEnd: () => setnowTab('문의하기')
              }}
            >
              {(props) => <Inquire {...props} navigation={navigation} />}
            </Tab.Screen>
          </Tab.Navigator>
        </Wrapper>
        <Wrapper width={Dimensions.get('screen').width} height={insets.bottom} backgroundColor={'white'} />
      </NavigationSafeAreaView>
    </Wrapper>
  );
};
export default ServiceCenterScreen;

function FAQ({data}: {data: any}) {
  return (
    <Wrapper flex={1} backgroundColor={'white'}>
      <ScrollViewBetween>
        <Wrapper flex={1} backgroundColor={'white'} padding={25}>
          {data &&
            data.map((faqIndex: any, key: number) => (
              <Fragment key={key}>
                <FAQIndex indexText={faqIndex?.node?.title} mt={key ? undefined : -9} />
                {faqIndex &&
                  faqIndex.node &&
                  faqIndex.node.masters &&
                  faqIndex.node.masters.map((faqContent: any, key: number) => <FAQBox title={faqContent?.title} content={faqContent?.contents} key={key} />)}
              </Fragment>
            ))}
        </Wrapper>
      </ScrollViewBetween>
    </Wrapper>
  );
}

function MyQuestion({nowTab, data}: {nowTab?: 'FAQ' | '내 문의내역' | '문의하기'; data: any}) {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [qna, setQna] = useState<any>();

  // const [isFirstActive, setIsFirstActive] = useState<boolean>(true);

  // useEffect(() => {
  //   nowTab === '내 문의내역' && isFirstActive && qnaMasters();
  //   nowTab === '내 문의내역' && setIsFirstActive(false);
  // }, [nowTab]);

  useEffect(() => {
    data && data.edges && setQna(data.edges);
    data && data.totalCount && setTotalCount(data.totalCount);
  }, [data]);

  return (
    <Wrapper flex={1} backgroundColor={'white'}>
      <ScrollViewBetween>
        <Wrapper h paddingX={25} paddingBottom={25} style={{paddingTop: 5}}>
          {qna && totalCount !== 0
            ? qna.map((qna: any, key: number) => <MyQuestionBox title={qna?.node?.contents} content={qna?.node?.comments?.[0]?.comment} key={key} />)
            : totalCount === 0 && (
                <Wrapper height={400} w h paddingY={30}>
                  <Img src={require('../../public/image/component/icon-exclamation.png')} width={65} height={65} />
                  <Text mt={20} size={16} color="#888">
                    아직 문의하신 내용이 없어요.
                  </Text>
                </Wrapper>
              )}
        </Wrapper>
      </ScrollViewBetween>
    </Wrapper>
  );
}

function FAQIndex({indexText, mt}: {indexText: string; mt?: number}) {
  return (
    <Wrapper
      mt={mt ?? 40}
      height={54}
      h
      borderBottomWidth={0.5}
      borderBottomColor={`${theme.color.lineGray}aa`}
      children={<Text children={indexText} color="#111111" weight="bold" size={'14px'} />}
    />
  );
}

function FAQBox({title, content}: {title: string; content: string}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dimensions = useWindowDimensions();

  return (
    <TouchableOpacity onPress={() => setIsOpen((val) => !val)} activeOpacity={0.5}>
      <Wrapper
        minHeight={54}
        h
        paddingY={20}
        borderBottomWidth={0.8}
        borderBottomColor={`${theme.color.lineGray}aa`}
        children={
          <Wrapper row>
            <Wrapper h width={dimensions.width - 70}>
              <Text children={title} color="#111111" size={'14px'} />
            </Wrapper>
            <Arrow isOpen={isOpen} color="#aaa" />
          </Wrapper>
        }
      />
      {isOpen && <AnswerContent content={content} />}
    </TouchableOpacity>
  );
}

function MyQuestionBox({title, content}: {title: string; content?: string}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity onPress={() => setIsOpen((val) => !val)}>
        <Wrapper
          minHeight={54}
          h
          borderBottomWidth={0.8}
          borderBottomColor={`${theme.color.lineGray}aa`}
          activeOpacity={0.5}
          paddingY={20}
          children={
            <Wrapper row w>
              <Text children={title} color="#111111" size={'14px'} />
              {content ? (
                <Wrapper marginRight={0} marginLeft="auto" row size={[77, 26]} w borderColor="#007aff" borderRadius={2} borderWidth={0.5} paddingLeft={12} paddingRight={9}>
                  <Text children={'완료'} color="#007aff" size={'13px'} />
                  <Arrow isOpen={isOpen} color="#007aff" />
                </Wrapper>
              ) : (
                <Wrapper marginRight={0} marginLeft="auto" row size={[77, 26]} w borderColor="#aaa" borderRadius={2} borderWidth={0.5} paddingLeft={12} paddingRight={9}>
                  <Text children={'답변 예정'} color="#aaa" size={'13px'} />
                </Wrapper>
              )}
            </Wrapper>
          }
        />
      </TouchableOpacity>
      {content && isOpen && <AnswerContent content={content} />}
    </>
  );
}

function AnswerContent({content}: {content?: string}) {
  return (
    <Wrapper bgColor={'#f1f2f488'} padding={15} borderBottomWidth={0.5} borderBottomColor={`${theme.color.lineGray}aa`}>
      <Text children={content} color="#111111" size={'14px'} />
    </Wrapper>
  );
}

function Arrow({isOpen, color}: {isOpen: boolean; color: string}) {
  return (
    <Wrapper ml={'auto'} mr={5} h>
      <Wrapper height={isOpen ? 4 : 0} />
      <Wrapper
        width={9}
        height={9}
        style={{transform: [{rotateZ: isOpen ? '135deg' : '-45deg'}]}}
        borderBottomColor={color}
        borderLeftColor={color}
        borderBottomWidth={1}
        borderLeftWidth={1}
      />
      <Wrapper height={isOpen ? 0 : 4} />
    </Wrapper>
  );
}

function Inquire({navigation}: {navigation: StackNavigationProp}) {
  const [inquireSort, setInquireSort] = useState<'menu' | 'oneToOne' | 'kakao'>('menu');

  useEffect(() => {
    inquireSort === 'kakao' && activateErrorPopup(navigation, '서비스 준비중입니다.', () => setInquireSort('menu'));
  }, [inquireSort]);

  // return inquireSort === 'menu' ? <InquireMenu setInquireSort={setInquireSort} /> : inquireSort === 'oneToOne' ? <InquireOneToOne navigation={navigation} /> : <></>;
  return inquireSort === 'menu' || inquireSort === 'kakao' ? <InquireMenu setInquireSort={setInquireSort} /> : <InquireOneToOne navigation={navigation} />;
}

function InquireMenu({setInquireSort}: {setInquireSort: Dispatch<SetStateAction<'menu' | 'oneToOne' | 'kakao'>>}) {
  return (
    <Wrapper flex={1} backgroundColor={'white'} size={'100%'} padding={25}>
      <InquireButton text="1:1 문의 작성" onPress={() => setInquireSort('oneToOne')} />
      <Text weight="bold" color="#333" mt={30}>
        카카오톡 문의
      </Text>
      <Text weight="regular" color="#333" mt={10}>
        상담가능시간 : 09:00 ~ 18:00 (월~금)
      </Text>
      <Wrapper mt={20} />
      <InquireButton text="카카오톡 문의" onPress={() => setInquireSort('kakao')} />
    </Wrapper>
  );
}

function InquireOneToOne({navigation}: {navigation: StackNavigationProp}) {
  const [inquireType, setInquireType] = useState<string>('환불');
  const inquireTypes = ['환불', '주문결제', '상품', '배송', '회원', '기타'];
  const [selectedPurchasedKey, setSelectedPurchasedKey] = useState<number>(0);
  const [selectedViewedKey, setSelectedViewedKey] = useState<number>(0);
  const inquireTitle = useInput('');
  const inquireContent = useInput('');
  // const successPopup = usePopup();
  const [purchasedCar, setPurchasedCar] = useState<any>();
  const [recentViewCar, setRecentViewCar] = useState<any>();

  useEffect(() => {
    console.log('selectedPurchasedKey', selectedPurchasedKey);
  }, [selectedPurchasedKey]);
  useEffect(() => {
    console.log('selectedViewedKey', selectedViewedKey);
  }, [selectedViewedKey]);

  // const data: any[] = [
  //   {
  //     img: '',
  //     price: 1234,
  //     title: '2020 현대 더 올뉴하이브리드',
  //     trim: '하이브리드 2.4 익스클루브',
  //     mileage: 12345,
  //     fuel: '가솔린'
  //   },

  //   {
  //     img: '',
  //     price: 1234,
  //     title: '2020 현대 더 올뉴하이브리드',
  //     trim: '하이브리드 2.4 익스클루브',
  //     mileage: 12345,
  //     fuel: '가솔린'
  //   },

  //   {
  //     img: '',
  //     price: 1234,
  //     title: '2020 현대 더 올뉴하이브리드',
  //     trim: '하이브리드 2.4 익스클루브',
  //     mileage: 12345,
  //     fuel: '가솔린'
  //   },
  //   {
  //     img: '',
  //     price: 1234,
  //     title: '2020 현대 더 올뉴하이브리드',
  //     trim: '하이브리드 2.4 익스클루브',
  //     mileage: 12345,
  //     fuel: '가솔린'
  //   }
  // ];

  const query: InsertQnaMasterQueryType = {
    questionFlag: inquireTypes.findIndex((el) => el === inquireType) + 1,
    vehicleId: inquireType === '환불' || inquireType === '배송' ? selectedPurchasedKey : inquireType === '주문결제' || inquireType === '상품' ? selectedViewedKey : undefined,
    title: inquireTitle.value,
    contents: inquireContent.value,
    anonymityFlag: 1
  };

  const submit = (query: InsertQnaMasterQueryType) => {
    insertQnaMasterApi(query, navigation)
      .then((res) => {
        res.insertQnaMaster && activateErrorPopup(navigation, '문의가 접수되었습니다.', () => navigation.navigate('MyPageScreen'));
      })
      .catch((error) => console.log('error', error));
  };

  // 최근 본 차량
  useEffect(() => {
    getStorage('carmerceUser').then((user) => {
      console.log('user?.id', user?.id);
      viewMastersApi(navigation, user?.id)
        .then((response) => {
          let carId: number[] = [];
          // console.log('response?.viewMasters?.edges', response?.viewMasters?.edges);
          response?.viewMasters?.edges?.forEach((edge: any) => {
            if (edge.node) carId = carId.concat(Number(edge?.node?.targetId));
          });
          console.log('carId', carId);
          // console.log('carId', carId);
          carId.length && getVehicleListByIdsApi({ids: carId?.toString()}, navigation).then((response) => setRecentViewCar(response?.getVehicleListByIds));
        })
        .catch((error) => console.log('error', error));
    });
  }, []);

  // 구매 차량
  useEffect(() => {
    // 구매차량Api(navigation)
    //   .then((response) => {
    //     let carId: number[] = [];
    //     // console.log('response?.viewMasters?.edges', response?.viewMasters?.edges);
    //     response?.viewMasters?.edges?.forEach((edge: any) => {
    //       if (edge.node) carId = carId.concat(Number(edge?.node?.id));
    //     });
    //     // console.log('carId', carId);
    //     carId.length && getWishListApi({ids: carId?.toString()}, navigation).then((response) => setPurchasedCar(response?.getWishList));
    //   })
    //   .catch((error) => console.log('error', error));
  }, []);

  return (
    <ScrollViewBetween bounces={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : undefined} keyboardVerticalOffset={0}>
        <Wrapper flex={1} backgroundColor={'white'} size={'100%'} paddingTop={25}>
          <Wrapper>
            <Text weight="bold" ml={25} size={'14px'} color="#333">
              문의유형
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Wrapper mt={15} pr={25} row>
                {inquireTypes.map((el: string, key: number) => (
                  <InquireType text={el} key={key} ml={key ? 7 : 25} inquireType={inquireType} setInquireType={setInquireType} />
                ))}
              </Wrapper>
            </ScrollView>
          </Wrapper>
          {/* seperator */}
          <Wrapper height={12} bgColor="#eee" mt={20} />
          {/*  */}
          {inquireType !== '회원' && inquireType !== '기타' && (
            <>
              <Wrapper>
                <Text weight="bold" ml={25} mt={30} size={'14px'} color="#333">
                  {(inquireType === '환불' || inquireType === '배송') && '구매 차량'}
                  {(inquireType === '주문결제' || inquireType === '상품') && '최근 본 상품'}
                </Text>
                {(inquireType === '환불' || inquireType === '배송') && purchasedCar && purchasedCar.length ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Wrapper mt={15} pr={25} row>
                      <CarBox data={purchasedCar} selectedKey={selectedPurchasedKey} setSelectedKey={setSelectedPurchasedKey} />
                    </Wrapper>
                  </ScrollView>
                ) : (inquireType === '주문결제' || inquireType === '상품') && recentViewCar && recentViewCar.length ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Wrapper mt={15} pr={25} row>
                      <CarBox data={recentViewCar} selectedKey={selectedViewedKey} setSelectedKey={setSelectedViewedKey} />
                    </Wrapper>
                  </ScrollView>
                ) : (
                  <Wrapper w paddingY={30}>
                    <Img src={require('../../public/image/component/icon-exclamation.png')} width={65} height={65} />
                    <Text mt={20} size={16} color="#888">
                      {(inquireType === '환불' || inquireType === '배송') && '아직 구매하신 차량이 없어요.'}
                      {(inquireType === '주문결제' || inquireType === '상품') && '아직 최근 본 차량이 없어요.'}
                    </Text>
                  </Wrapper>
                )}
              </Wrapper>
            </>
          )}
          <Wrapper paddingX={25} mt={30}>
            <Text weight="bold" size={'14px'} color="#333">
              문의제목
            </Text>
            <Wrapper mt={15}>
              <TextArea
                placeholder="제목을 입력해주세요(20자 이내)."
                height={'60px'}
                border
                value={inquireTitle.value}
                onChangeText={(e: string) => inquireTitle.setValue(e)}
                maxLength={20}
                fontSize={'14px'}
                fontFamily={theme.font.regular}
              />
            </Wrapper>
            <Text weight="bold" size={'14px'} mt={20} color="#333">
              문의내용
            </Text>
            <Wrapper mt={15}>
              <TextArea
                placeholder="문의하실 내용을 간략하게 작성해주세요(100자 이내)."
                height={'150px'}
                border
                value={inquireContent.value}
                onChangeText={(e: string) => inquireContent.setValue(e)}
                maxLength={30}
                fontSize={'13px'}
                fontFamily={theme.font.regular}
              />
            </Wrapper>
          </Wrapper>
        </Wrapper>

        <Wrapper backgroundColor={'white'} paddingX={25} pt={27} paddingBottom={15}>
          <Button
            children={'확인'}
            disabled={
              ((inquireType === '환불' || inquireType === '배송') && !selectedPurchasedKey) ||
              ((inquireType === '주문결제' || inquireType === '상품') && !selectedViewedKey) ||
              !inquireTitle.value ||
              !inquireContent.value
            }
            onPress={() => submit(query)}
            whcbr={['100%', 56, '#06f', 'none', 6]}
            fontSize={19}
            fontWeight="bold"
            mt="auto"
          />
        </Wrapper>
      </KeyboardAvoidingView>
    </ScrollViewBetween>
  );
}

function InquireButton({text, onPress}: {text: string; onPress: () => void}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Wrapper size={['100%', 55]} w h borderColor={'#ccc'} borderWidth={1} borderRadius={28}>
        <Text size={'16px'}>{text}</Text>
      </Wrapper>
    </TouchableOpacity>
  );
}

function InquireType({text, inquireType, setInquireType, ml}: {text: string; inquireType: string; setInquireType: Dispatch<SetStateAction<string>>; ml: number}) {
  const isSelected = text === inquireType;

  return (
    <TouchableOpacity onPress={() => setInquireType(text)}>
      <Wrapper
        ml={ml}
        paddingY={9}
        paddingX={15}
        height={34}
        bgColor={isSelected ? '#007aff' : '#fff'}
        borderColor={isSelected ? '#007aff' : '#ccc'}
        borderWidth={0.5}
        borderRadius={5}
      >
        <Text size={'14px'} color={isSelected ? '#fff' : '#2b2b2b'}>
          {text}
        </Text>
      </Wrapper>
    </TouchableOpacity>
  );
}

function CarBox({data, selectedKey, setSelectedKey}: {data: any[]; selectedKey: number; setSelectedKey: Dispatch<SetStateAction<number>>}) {
  useEffect(() => {
    const firstCarId = data[0].id;
    firstCarId && setSelectedKey(firstCarId);
  }, []);

  return (
    <>
      {data &&
        data.map((car: any, key: number) => {
          const imgUri = `https://dev-api.carmerce.co.kr/dev/cloud/storage?name=${car.imageList[0].name}`;
          const id = car.id;
          const parsedPrice = getPriceForm(car.price);
          const title = `${car.modelYear} ${car.manufacturer} ${car.modelName}`;

          return (
            <TouchableOpacity onPress={() => setSelectedKey(id)}>
              <Wrapper
                ml={key ? 20 : 25}
                borderRadius={10}
                borderWidth={0.5}
                borderColor={selectedKey === id ? '#007aff' : '#ccc'}
                size={[184, 262]}
                paddingTop={18}
                paddingX={22}
                key={key}
              >
                <Img style={{width: 140, height: 140, borderRadius: 10}} src={{uri: imgUri}} />
                <Wrapper row mt={10} between w>
                  <Wrapper row>
                    <Text children={`${numberComma(car?.salePrice)}`} size={15} color="#ff5050" weight="bold" />
                    <Text children={'만원'} ml={2} size={15} color="#ff5050" weight="bold" />
                  </Wrapper>
                  <Text children={parsedPrice} size={13} color="#cdcdcd" lineThrough />
                </Wrapper>
                <Text children={title} size={13} mt={4} color="#333" weight="bold" numberOfLines={1} />
                <Text children={car?.modelTrim} size={12} mt={4} color="#aaa" numberOfLines={1} />
                <Wrapper row mt={4}>
                  <Text children={`${numberComma(car?.mileage)} km`} size={12} color="#aaa" />
                  <Text children={car?.fuel} size={12} ml={9} color="#aaa" />
                </Wrapper>
              </Wrapper>
            </TouchableOpacity>
          );
        })}
    </>
  );
}
