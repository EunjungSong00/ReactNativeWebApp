import React from 'react';
import theme from '../../public/theme';
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import InstantLayout from '../../src/component/template/InstantLayout';
import Wrapper from '../../src/component/atom/Wrapper';
import Txt from '../../src/component/atom/Txt';

const Title = ({children, mt}: {children: string, mt?: number}) => (
    <Txt size={'sm'} weight={'bold'} mt={mt}>{children}</Txt>
)

const Text = ({children, mt, lineHeight}: {children: string, mt?: number, lineHeight?: number}) => (
    <Txt size={'sm'} mt={mt} lineHeight={lineHeight}>{children}</Txt>
)

const RefundInformationScreen = () => {
  return (
    <InstantLayout title={'환불 및 배송안내'}>
      <ScrollViewBetween>
          <Wrapper p={20} backgroundColor={theme.color.white}>
            <Title>배송 관련 안내</Title>
            <Title mt={15}>[배송 방법]</Title>
            <Text mt={9}>배송 기사를 통한 차량 직접 전달 (캐리어 탁송 서비스 준비 중)</Text>
            <Title mt={20}>[배송비]</Title>
            <Text mt={9}>배송지까지의 거리(Km)에 따라 비례하여 부과</Text>
            <Title mt={20}>[배송불가지역]</Title>
            <Text mt={9}>도서 산간 등 배송 기사를 통한 차량 전달이 어려운 지역 (ex. 제주도)</Text>

            <Title mt={50}>환불 관련 안내</Title>
            <Title mt={15}>[ 환불 방법 ]</Title>
            <Text mt={9}>{`마이페이지 > 구매이력 > 구매이력 상세 >  페이지 하단의 [환불 접수] 버튼 누른 후 진행`}</Text>
            <Title mt={20}>[ 상품 인도 방법 ]</Title>
            <Text mt={9}>배송 기사를 통한 차량 직접 전달</Text>
            <Title mt={20}>[ 환불배송비 ]</Title>
            <Text mt={9}>배송지까지의 거리(Km)에 따라 비례하여 부과</Text>
            <Title mt={20}>[ 환불불가비용 ]</Title>
            <Text lineHeight={22} mt={9}>환불 절차에 따라 불가피하게 발생하는 탁송 비용</Text>
            <Text lineHeight={22}>차량 인수 후 임의로 추가한 장착품 및 차량에 투입된 비용</Text>
            <Text lineHeight={22} >대출 계약 및 자동차보험계약을 해지 함에 따라 발생하는 비용</Text>

            <Title mt={50}>환불 사유에 따른 가능 여부</Title>
            <Title mt={15}>[ 환불 불가 사유 ]</Title>
            <Text mt={9}>중고차 상품의 특성 상, 새로운 사용자가 차량을 이용하게 될 시 해당 중고차의 시장 가치가 현저히 감소하게 되므로 단순 변심에 따른 환불이 불가</Text>
            <Text mt={9}>고객이 차량을 이용한 후, 차량의 가치를 감소시키는 파손, 멸실, 훼손이 확인된 경우</Text>
            <Title mt={15}>[ 환불 가능 사유 ]</Title>
            <Text mt={9}>당사(주식회사 핸들)가 운영하는 사이트 내에서 제공된 정보 중, 상품의 가치를 현저히 떨어트릴 수 있는 요소에 대한 정보가 누락된 경우</Text>
            <Text mt={9}>그 외 당사에서 제공하는 보증 상품을 포함하여 차량 구매를 진행한 경우 (단, 차량의 가치를 현저하게 감소시키는 파손, 멸실, 훼손에 대해서는 실비를 청구할 수 있음)</Text>
          </Wrapper>
      </ScrollViewBetween>
    </InstantLayout>
  );
};

export default RefundInformationScreen;
