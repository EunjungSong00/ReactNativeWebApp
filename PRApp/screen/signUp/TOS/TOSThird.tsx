import React from 'react';
import {TOSSubText, TOSSubTitle, TOSTableWrapper, TOSTd, TOSTh, TOSTitle} from "../../login/TosScreen";

const TOSThird = () => (
        <>
            <TOSTitle>개인정보 제3자 제공 동의</TOSTitle>
            <TOSSubTitle>[필수] 개인정보 제 3자 제공 동의에 대한 약관</TOSSubTitle>
            <TOSTableWrapper>
                <TOSTh border>{`개인정보\n제공 받는 자`}</TOSTh>
                <TOSTh border>{`개인정보\n제공 항목`}</TOSTh>
                <TOSTh>{`개인정보\n제공 목적`}</TOSTh>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>다코스</TOSTd>
                <TOSTd border>회원의 성명(명칭), 주민(법인)등록번호, 주소, 휴대전화번호, 신분증 정보</TOSTd>
                <TOSTd>차량 소유주 확인 및 온라인이전등록 대행</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>{`카머스 파트너스\n(카머스 플랫폼을 이용하는 판매자)`}</TOSTd>
                <TOSTd border>회원의 성명(명칭), 주민(법인)등록번호, 주소</TOSTd>
                <TOSTd>차량의 판매 및 이전</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>로드윈, YW</TOSTd>
                <TOSTd border>회원의 휴대전화번호, 회원 이름, 주소</TOSTd>
                <TOSTd>판매차량 탁송</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>NICE 페이먼츠</TOSTd>
                <TOSTd border>회원 명의의 계좌 개설 은행, 계좌번호</TOSTd>
                <TOSTd>판매대금 정산</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>{`우리은행\n신한은행\n메리츠캐피탈\n웰컴저축은행\n동양저축은행`}</TOSTd>
                <TOSTd border>회원의 성명(명칭), 주민(법인)등록번호, 주소, 휴대전화번호, 신분증 정보, 회원이 구매하고자 하는 차량의 정보</TOSTd>
                <TOSTd>대출 실행</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>DB 손해보험</TOSTd>
                <TOSTd border>회원의 성명(명칭), 주민(법인)등록번호, 주소, 휴대전화번호, 신분증 정보, 회원이 구매하고자 하는 차량의 정보</TOSTd>
                <TOSTd>{`보험 가입\nEW 서비스 가입`}</TOSTd>
            </TOSTableWrapper>
            <TOSSubText mt={15}>
                개인정보 이용 기간 : 전자상거래 등에서의 소비자보호에 관한 법류에 의해 5년간 보관 후 파기
            </TOSSubText>
            <TOSSubText mt={2}>
                제공에 동의하지 않을 수 있으나, 동의하지 않으면 회원가입에 제한이 됩니다.
            </TOSSubText>
        </>
);

export default TOSThird;
