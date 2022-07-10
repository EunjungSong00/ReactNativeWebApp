import React from 'react';
import {TOSSubText, TOSSubTitle, TOSTableWrapper, TOSTd, TOSTh, TOSTitle} from "../../login/TosScreen";

const TOSPrivacy = () => (
        <>
            <TOSTitle>개인정보 수집 및 이용 동의</TOSTitle>
            <TOSSubTitle>[필수] 개인정보 수집 및 이용 동의약관</TOSSubTitle>
            <TOSTableWrapper>
                <TOSTh border>수집 항목</TOSTh>
                <TOSTh>수집 목적</TOSTh>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>이름, 실명확인값(DI), 생년월일, 성별, 통신사 정보, 휴대전화번호</TOSTd>
                <TOSTd>회원제 서비스에 따른 본인 확인 절차</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>이메일, 전화번호, 연락처(전화번호, 휴대전화번호)</TOSTd>
                <TOSTd>고지사항 전달 및 본인의사확인, 불만처리, 사용자구분등 원활한 의사소통 경로의 확보</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>소속 사업장 상호명, 사업자등록번호, 법인번호, 사업자 개업일시, 소속 사업장 대표자명</TOSTd>
                <TOSTd>세금계산서 발행</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>본인확인 정보(이름, 생년월일, 성별, 통신사명, 휴대전화번호, 동일인식별정보(CI), 중복가입확인정보(DI), 내/외국인정보)</TOSTd>
                <TOSTd>회원 본인 및 연령 확인, 통계학적 특성에 따른 서비스 제공</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>고객 명의 계좌 개설은행, 계좌번호</TOSTd>
                <TOSTd>판매대금 정산</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border>차량번호, 소유주명, 차종(차명), 트림명, 담당 딜러, 출고가, 차대번호, 변속기, 유종, 최대마력, 연비, 배기량, 구동방식, 색상, 차량외형, 주행거리, 주차위치, 차량사진, 성능점검 정보, 상세 옵션 정보, 보험이력 정보, 판매 금액</TOSTd>
                <TOSTd>소비자 차량 정보 제공</TOSTd>
            </TOSTableWrapper>
            <TOSSubText mt={15}>
                보유기간 : 환불목적으로 회원탈퇴 후 90일 보관 후 지체없이 파기
            </TOSSubText>
            <TOSSubText mt={2}>
                동의를 거부할 수 있으나 동의 거부 시 서비스 이용이 제한됩니다.
            </TOSSubText>
        </>
);

export default TOSPrivacy;
