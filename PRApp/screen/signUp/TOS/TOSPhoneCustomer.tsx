import React from 'react';
import {TOSSubText, TOSSubTitle, TOSTitle} from "../../login/TosScreen";

const TOSPhoneCustomer = () => (
        <>
            <TOSTitle>개인정보 이용 및 활용 동의</TOSTitle>
            <TOSSubTitle>[SK텔레콤㈜, ㈜케이티, LGU플러스㈜ 귀중]</TOSSubTitle>
            <TOSSubText>본인은 SK텔레콤㈜ 또는 ㈜케이티 또는 LGU플러스㈜(이하 '회사'라 합니다)가 제공하는 본인확인서비스(이하 '서비스'라 합니다)를 이용하기 위해, 다음과 같이 '회사'가 본인의 개인정보를 수집/이용하고, 개인정보의 취급을 위탁하는 것에 동의합니다.</TOSSubText>
            <TOSSubText mt={2}>1. 수집항목</TOSSubText>
            <TOSSubText>이용자의 생년월일, 성명, 성별, 내/외국인 구분, 이동전화번호</TOSSubText>
            <TOSSubText>연계정보(CI), 중복가입확인정보(DI)</TOSSubText>
            <TOSSubText>이용자가 이용하는 웹사이트 또는 Application 정보, 이용일시</TOSSubText>
            <TOSSubText>2. 이용목적</TOSSubText>
            <TOSSubText>이용자가 웹사이트 또는 Application에 입력한 본인확인정보의 정확성 여부 확인</TOSSubText>
            <TOSSubText>해당 웹사이트 또는 Application에 연계정보(CI)와 중복가입확인정보(DI) 전송</TOSSubText>
            <TOSSubText>서비스 관련 상담 및 불만 처리 등</TOSSubText>
            <TOSSubText>기타 법률에서 정한 목적</TOSSubText>
            <TOSSubText>3. 개인정보의 보유기간 및 이용기간</TOSSubText>
            <TOSSubText>이용자가 서비스를 이용하는 기간에 한하여 보유 및 이용. 다만, 아래의 경우는 제외</TOSSubText>
            <TOSSubText>법령에서 정하는 경우 해당 기간까지 보유 및 이용</TOSSubText>
            <TOSSubText>(상세 사항은 회사의 개인정보취급방침에 기재된 바에 따름)</TOSSubText>
            <TOSSubText>4. 본인확인서비스 제공을 위한 개인정보의 취급위탁</TOSSubText>
            <TOSSubText>수탁자 : NICE평가정보㈜, LGU플러스㈜</TOSSubText>
            <TOSSubText>취급위탁 업무 : 본인확인정보의 정확성 여부 확인, 연계정보(CI) 및 중복가입확인정보(DI) 전송, 서비스 관련 상담 및 불만 처리 등</TOSSubText>
            <TOSSubText>5. 상기 개인정보 수집 · 이용 및 취급위탁에 동의하지 않으실 경우, 서비스를 이용하실 수 없습니다.</TOSSubText>
            <TOSSubText>회사가 제공하는 서비스와 관련된 개인정보의 취급과 관련된 사항은, 회사의 아래의 회사의 홈페이지에 기재된 개인정보취급방침에 따릅니다.</TOSSubText>
            <TOSSubText>SK텔레콤㈜ : www.sktelecom.com</TOSSubText>
            <TOSSubText>㈜케이티 : www.kt.com</TOSSubText>
            <TOSSubText>LGU플러스㈜ : www.lguplus.co.kr</TOSSubText>
            <TOSSubText mb>본인은 상기 내용을 숙지하였으며 이에 동의합니다.</TOSSubText>

            <TOSSubTitle>[나이스평가정보㈜, LGU플러스㈜ 귀중]</TOSSubTitle>
            <TOSSubText>나이스평가정보㈜ 또는 LGU플러스㈜(이하 '회사')는 SK텔레콤㈜, ㈜케이티, LGU플러스㈜의 업무를 대행하여 휴대폰본인확인서비스를 제공함에 있어 고객으로부터 개인정보를 수집하고 이용하기 위해 '정보통신망 이용촉진 및 정보보호에 관한 법률'에 따라서 다음과 같이 본인의 동의를 받습니다.</TOSSubText>
            <TOSSubText mt={2}>1. 개인정보의 내용</TOSSubText>
            <TOSSubText>가. 정보항목</TOSSubText>
            <TOSSubText>생년월일, 성명, 성별, 내/외국인 구분, 휴대폰번호, 가입한 이동통신사, IP주소</TOSSubText>
            <TOSSubText>나. 수집방법</TOSSubText>
            <TOSSubText>본인인증 요청시 회원사 서비스 페이지 또는 본인인증 팝업창 페이지에서 이용자가 직접 입력</TOSSubText>
            <TOSSubText>본인인증 과정에서 시스템에서 생성되는 정보 수집(Ex. IP주소)</TOSSubText>
            <TOSSubText>2. 개인정보의 이용목적과 제공정보</TOSSubText>
            <TOSSubText>가. 이용 목적</TOSSubText>
            <TOSSubText>고객의 회원가입, ID/PW찾기, 거래동의 등을 위한 휴대폰 본인확인 결과</TOSSubText>
            <TOSSubText>휴대폰 소지 확인을 위한 SMS 인증번호 전송</TOSSubText>
            <TOSSubText>부정 이용 방지 및 수사의뢰</TOSSubText>
            <TOSSubText>휴대폰번호보호서비스 해제(서비스 가입자에 한함)</TOSSubText>
            <TOSSubText>기타 법률에서 정한 목적</TOSSubText>
            <TOSSubText>나. 제공하는 개인정보</TOSSubText>
            <TOSSubText>성명, 성별, 생년월일, 내/외국인, 휴대폰번호, 이동통신사, IP주소 [제공사 : 서비스 회원사]</TOSSubText>
            <TOSSubText>성명, 성별, 생년월일, 휴대폰번호, 이동통신사 [제공사 : SKT, KT, LGU+, 모빌리언스, 다날]</TOSSubText>
            <TOSSubText>휴대폰번호 [제공사 : SKT, KT, LGU+, 삼성SDS, 모빌리언스, SK네트웍스, 다날]</TOSSubText>
            <TOSSubText>3. 개인정보의 보유 및 이용기간</TOSSubText>
            <TOSSubText>이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명기한 기간 동안 보유합니다.</TOSSubText>
            <TOSSubText>가. 회사 내부 방침에 의한 정보보유 사유 - 본인확인 발생 및 차단기록, 휴대폰번호</TOSSubText>
            <TOSSubText>보유 이유 : 부정 이용 방지 및 민원 처리</TOSSubText>
            <TOSSubText>보유 기간 : 5년</TOSSubText>
            <TOSSubText>나. 관계법령에 의한 정보보유 사유 - 이용자 불만 또는 분쟁 처리에 관한 기록</TOSSubText>
            <TOSSubText>보유 이유 : 전자상거래 등에서의 소비자보호에 관한 법률</TOSSubText>
            <TOSSubText>보유 기간 : 3년</TOSSubText>
        </>
);

export default TOSPhoneCustomer;
