import React from 'react';
import {TOSSubText, TOSSubTitle, TOSTableWrapper, TOSTd, TOSTh, TOSTitle} from "../../login/TosScreen";

const TOSPersonalInformation = () => (
        <>
            <TOSTitle>카머스 파트너스 개인정보 처리방침</TOSTitle>
            <TOSSubText>주식회사 핸들(이하 "회사")는 정보주체의 자유와 권익 보호를 위해 통신비밀보호법, 전기통신사업법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 및 정부가 제정한 개인정보보호지침 등 정보통신서비스제공자가 준수하여야 할 관계 법령상의 개인정보보호 규정을 준수하며, 관계 법령에 의거한 개인정보처리방침을 정하여 이용자의 권익 보호에 최선을 다하고 있습니다.</TOSSubText>
            <TOSSubText>회사의 개인정보처리방침은 회사가 제공하는 “카머스 파트너스” 관련 제반 서비스(모바일 웹/앱 포함)이용에 적용되며 다음과 같은 내용을 담고 있습니다.</TOSSubText>
            <TOSSubText>1.	수집하는 개인정보의 항목 및 수집방법</TOSSubText>
            <TOSSubText>2.	개인정보의 수집 및 이용목적</TOSSubText>
            <TOSSubText>3.	개인정보의 공유 및 제공</TOSSubText>
            <TOSSubText>4.	개인정보의 처리위탁</TOSSubText>
            <TOSSubText>5.	개인정보의 보유 및 이용기간</TOSSubText>
            <TOSSubText>6.	개인정보 파기절차 및 방법</TOSSubText>
            <TOSSubText>7.	만14세 미만 아동의 개인정보보호</TOSSubText>
            <TOSSubText>8.	이용자의 권리와 그 행사방법</TOSSubText>
            <TOSSubText>9.	개인정보 자동수집 장치의 설치/운영 및 거부에 관한 사항</TOSSubText>
            <TOSSubText>10.	개인정보의 기술적/관리적 보호 대책</TOSSubText>
            <TOSSubText>11.	개인정보보호책임자 및 담당자의 연락처</TOSSubText>
            <TOSSubText>12.	기타</TOSSubText>
            <TOSSubText mb>13.	고지의 의무</TOSSubText>
            <TOSSubTitle>1. 수집하는 개인정보의 항목 및 수집방법</TOSSubTitle>
            <TOSSubText>가. 수집하는 개인정보의 항목</TOSSubText>
            <TOSSubText>회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 최초 회원가입 당시 아래와 같은 최소한의 개인정보를 필수항목으로 수집하고 있습니다.</TOSSubText>
            <TOSSubText>회원가입</TOSSubText>
            <TOSSubText>{`<회원가입 - 준회원>`}</TOSSubText>
            <TOSSubText>필수항목: 아이디, 비밀번호, 전자우편주소</TOSSubText>
            <TOSSubText>{`<회원가입 - 정회원>`}</TOSSubText>
            <TOSSubText>필수항목: 이름, 실명확인값(DI), 생년월일, 성별, 통신사 정보, 휴대전화번호, 전자우편주소, 아이디, 비밀번호, 소속 사업장 상호명, 사업자등록번호, 법인번호, 사업자 개업일시, 소속 사업장 대표자명, 소속 매매상사 주소, 소속 자동차매매사업조합 연합회명, 딜러 사원증 번호, 딜러 자격 유무, 소속 자동차매매사업조합명, 조합코드, 소속 매매단지명, 소속 매매단지코드, 소속 사업장 전화번호, 사업장 신관리사업자번호</TOSSubText>
            <TOSSubText>선택항목: 대표 차량소유주명, 사업자용 계좌 개설 은행, 사업자용 계좌 계좌번호, 사업자용 계좌 명의</TOSSubText>
            <TOSSubText>개별서비스</TOSSubText>
            <TOSSubText>{`<차량등록>`}</TOSSubText>
            <TOSSubText>필수항목: 차량번호, 소유주명, 차종(차명), 트림명, 담당 딜러, 출고가, 차대번호, 변속기, 유종, 최대마력, 연비, 배기량, 구동방식, 색상, 차량외형, 주행거리, 주차위치, 차량사진, 성능점검 정보, 상세 옵션 정보, 보험이력 정보, 판매 금액</TOSSubText>
            <TOSSubText>선택항목: 차량매입가, 차량 이전비용, 판금/수리비, 성능점검비, 탁송비, 기타비용, 금융사, 매입일, 주차 위치</TOSSubText>
            <TOSSubText>{`<판매등록>`}</TOSSubText>
            <TOSSubText>필수항목: 판매하고자 하는 차량 정보(회사가 제공한 정보와 회원이 입력한 정보 모두 포함), 차량 소유자의 주소, 판매딜러 연락처(휴대전화번호), 차량 소유자의 성명(명칭), 딜러의 소속 매매상사 명의의 계좌 개설 은행, 딜러의 소속 매매상사 명의의 계좌 계좌번호, 딜러의 소속 매매상사 계좌 명의</TOSSubText>
            <TOSSubText>나. 개인정보 수집방법</TOSSubText>
            <TOSSubText>회사는 다음과 같은 적법하고 공정한 방법으로 개인정보를 수집합니다.</TOSSubText>
            <TOSSubText>- 홈페이지, 상담게시판, 이메일, 이벤트 응모, 배송요청</TOSSubText>
            <TOSSubText>- 협력회사로부터의 제공</TOSSubText>
            <TOSSubText mb>- 생성정보 수집 툴을 통한 수집</TOSSubText>
            <TOSSubTitle>2. 개인정보의 수집 및 이용목적</TOSSubTitle>
            <TOSSubText>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</TOSSubText>
            <TOSSubText>가. 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</TOSSubText>
            <TOSSubText>컨텐츠 제공, 특정 맞춤 서비스 제공, 물품배송 또는 청구서 등 발송, 본인인증, 구매 및 요금 결제, 요금 추심, 자동차 관련 보험, 등록대행 서비스를 위한 본인확인, 분쟁조정을 위한 기록보존, 불만처리 등 민원처리, 고지사항 전달</TOSSubText>
            <TOSSubText>나. 회원관리</TOSSubText>
            <TOSSubText>회원제 서비스 제공, 개인식별, 이용약관 위반 회원에 대한 이용제한 조치, 서비스의 원활한 운영에 지장을 미치는 행위 및 서비스 부정이용 행위 제재, 가입의사 확인, 가입 및 가입횟수 제한</TOSSubText>
            <TOSSubText>다. 신규 서비스 개발 및 마케팅</TOSSubText>
            <TOSSubText>신규 서비스 개발 및 맞춤 서비스 제공, 통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 이벤트 정보 및 참여기회 제공, 광고성 정보 제공, 접속빈도 파악, 회원의 서비스이용에 대한 통계</TOSSubText>
            <TOSSubText>라. 수집한 개인정보의 이용목적 구분</TOSSubText>
            <TOSSubText>- 회원제 서비스에 따른 본인 확인 절차: 이름, 실명확인값(DI), 생년월일, 성별, 통신사 정보, 휴대전화번호</TOSSubText>
            <TOSSubText>- 고지사항 전달 및 본인의사확인, 불만처리, 사용자구분등 원활한 의사소통 경로의 확보: 이메일, 전화번호, 연락처(전화번호, 휴대전화번호)</TOSSubText>
            <TOSSubText>- 소속 사업장 존재 여부 및 영업 상태 확인: 소속 사업장 상호명, 사업자등록번호, 법인번호, 사업자 개업일시, 소속 사업장 대표자명</TOSSubText>
            <TOSSubText>- 딜러 자격 유무 검증 및 소속 사업장 정보 확인: 소속 매매상사 주소, 소속 자동차매매사업조합 연합회명, 딜러 사원증 번호, 딜러 자격 유무, 소속 자동차매매사업조합명, 조합코드, 소속 매매단지명, 소속 매매단지코드, 소속 사업장 전화번호, 사업장 신관리사업자번호</TOSSubText>
            <TOSSubText>- 판매대금 정산: 딜러의 소속 매매상사 명의의 계좌 개설 은행, 딜러의 소속 매매상사 명의의 계좌 계좌번호, 딜러의 소속 매매상사 계좌 명의</TOSSubText>
            <TOSSubText mb>- 소비자 차량 정보 제공: 차량번호, 소유주명, 차종(차명), 트림명, 담당 딜러, 출고가, 차대번호, 변속기, 유종, 최대마력, 연비, 배기량, 구동방식, 색상, 차량외형, 주행거리, 주차위치, 차량사진, 성능점검 정보, 상세 옵션 정보, 보험이력 정보, 판매 금액</TOSSubText>
            <TOSSubTitle>3. 개인정보의 공유 및 제공</TOSSubTitle>
            <TOSSubText>회사는 이용자의 개인정보를 "2. 개인정보의 수집 및 이용목적"에서 고지한 범위 내에서 사용하며, 이용자의 사전 동의 없이는 동 범위를 초과하여 이용하거나 원칙적으로 이용자의 개인정보를 외부에 공개하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</TOSSubText>
            <TOSSubText>- 이용자가 사전에 공개에 동의하였거나 서비스 제공 관련 계약 이행을 위하여 필요한 개인정보로 통상의 동의를 받기가 경제적/기술적 사유로 현저히 곤란한 경우</TOSSubText>
            <TOSSubText>- 법률의 특별한 규정 등 「개인정보보호법」 제17조 및 제18조에 해당하는 경우 (예. 관련 법령에 의거 적법한 절차에 의한 정부/수사기관의 요청이 있는 경우 등)</TOSSubText>
            <TOSSubText>- 서비스 이용에 필요한 목적을 위해 이용자의 개인정보에 대해서 제3자에게 제공하는 경우(별도 이용자의 동의 영부 확인)</TOSSubText>
            <TOSSubText>이용자가 온라인상의 게시판 등을 통해 기재한 인적사항을 제3자가 수집하는 경우가 있을 수 있으므로 이에 유의하시기 바랍니다. 이용자가 스스로 게시판 등을 통해 기재한 인적사항과 관련하여 회사는 어떠한 책임도 지지 않습니다.</TOSSubText>
            <TOSSubText mb>서비스 개인정보 제공내역 바로가기</TOSSubText>
            <TOSSubTitle>4. 개인정보의 처리위탁</TOSSubTitle>
            <TOSSubText>가. 회사는 서비스 향상을 위해서 필요한 경우 및 기타 서비스 제공을 위해서 이용자의 개인정보를 외부에 수집·보관·처리·이용·제공·관리·파기 등을 할 수 있도록 아래와 같이 업무를 위탁하여 운영하고 있습니다.</TOSSubText>
            <TOSTableWrapper>
                <TOSTh border width={'25%'}>{`개인정보\n제공 받는 자`}</TOSTh>
                <TOSTh border>{`개인정보\n제공 항목`}</TOSTh>
                <TOSTh width={'25%'}>{`개인정보\n제공 목적`}</TOSTh>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border width={'25%'}>다코스</TOSTd>
                <TOSTd border>차량 소유자의 성명(명칭), 차량 소유자의 주민(법인)등록번호, 차량 소유자의 주소, 차량번호, 등록 차량 주행거리</TOSTd>
                <TOSTd width={'25%'}>차량 소유주 확인 및 온라인이전등록 대행</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border width={'25%'}>로드윈, YW</TOSTd>
                <TOSTd border>소속 매매상사 주소, 회원 휴대전화번호, 회원 이름</TOSTd>
                <TOSTd width={'25%'}>판매차량 탁송</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border width={'25%'}>NICE 페이먼츠</TOSTd>
                <TOSTd border>딜러의 소속 매매상사 명의의 계좌 개설 은행, 딜러의 소속 매매상사 명의의 계좌 계좌번호, 딜러의 소속 매매상사 계좌 명의</TOSTd>
                <TOSTd width={'25%'}>판매대금 정산</TOSTd>
            </TOSTableWrapper>
            <TOSTableWrapper>
                <TOSTd border width={'25%'}>보험개발원</TOSTd>
                <TOSTd border>차량번호</TOSTd>
                <TOSTd width={'25%'}>보험이력 조회</TOSTd>
            </TOSTableWrapper>
            <TOSSubText mt={15}>
                개인정보 이용 기간 : 전자상거래법에 의해 5년간 보관 후 파기
            </TOSSubText>
            <TOSSubText>나. 회사는 위탁계약 체결 시 「개인정보보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적ㆍ관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리ㆍ감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하여 서면 또는 전자적으로 보관하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</TOSSubText>
            <TOSSubText>개인정보처리의 위탁에 관한 사항 및 제3자제공에 관한 사항 자세히 보기</TOSSubText>
            <TOSSubText mb>다. 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.</TOSSubText>

            <TOSSubTitle>5. 개인정보의 보유 및 이용기간</TOSSubTitle>
            <TOSSubText>회사는 이용자가 회원으로서 서비스를 이용하는 동안 이용자의 개인정보를 보유 및 이용하며, 이용자가 회원탈퇴를 요청한 경우나 개인정보의 수집 및 이용목적을 달성하거나 보유 및 이용기간이 종료한 경우 또는 사업폐지 등의 사유가 발생한 경우 해당 정보를 지체 없이 파기합니다.</TOSSubText>
            <TOSSubText>단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.</TOSSubText>
            <TOSSubText>가. 회사 내부 방침에 의한 정보보유 사유</TOSSubText>
            <TOSSubText>- 부정이용기록</TOSSubText>
            <TOSSubText>보존 이유 : 부정 이용 방지</TOSSubText>
            <TOSSubText>보존 기간 : 5년</TOSSubText>
            <TOSSubText>- 차량광고에 관한 기록</TOSSubText>
            <TOSSubText>보존 이유 : 판매자와 구매자간 분쟁처리</TOSSubText>
            <TOSSubText>보존 기간 : 1년</TOSSubText>
            <TOSSubText>나. 관계 법령에 의한 정보보유 사유</TOSSubText>
            <TOSSubText>상법, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 이 경우 회사는 보관하는 정보를 그 보관의 목적으로만 이용하며 보존기간은 아래와 같습니다.</TOSSubText>
            <TOSSubText>- 계약 또는 청약철회 등에 관한 기록</TOSSubText>
            <TOSSubText>보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률</TOSSubText>
            <TOSSubText>보존 기간 : 5년</TOSSubText>
            <TOSSubText>- 대금결제 및 재화 등의 공급에 관한 기록</TOSSubText>
            <TOSSubText>보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률</TOSSubText>
            <TOSSubText>보존 기간 : 5년</TOSSubText>
            <TOSSubText>- 소비자의 불만 또는 분쟁처리에 관한 기록</TOSSubText>
            <TOSSubText>보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률</TOSSubText>
            <TOSSubText>보존 기간 : 3년</TOSSubText>
            <TOSSubText>- 방문에 관한 기록</TOSSubText>
            <TOSSubText>보존 이유 : 통신비밀보호법</TOSSubText>
            <TOSSubText mb>보존 기간 : 3개월</TOSSubText>

            <TOSSubTitle>6. 개인정보 파기절차 및 방법</TOSSubTitle>
            <TOSSubText>가. 회사는 다른 법률에 따라 개인정보를 보존하여야 하는 경우가 아닌 한, 수집한 이용자의 개인정보의 수집 및 이용목적이 달성되거나, 이용자가 회원탈퇴를 요청한 경우 지체 없이 파기하여 향후 어떠한 용도로도 열람 또는 이용할 수 없도록 처리합니다.</TOSSubText>
            <TOSSubText>나. 가항에도 불구하고, 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우(“5. 개인정보의 보유 및 이용기간 가, 나”)에는 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</TOSSubText>
            <TOSSubText>다. 회사의 개인정보 파기절차 및 방법은 다음과 같습니다.</TOSSubText>
            <TOSSubText>가. 파기절차</TOSSubText>
            <TOSSubText>파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다</TOSSubText>
            <TOSSubText>나. 파기방법</TOSSubText>
            <TOSSubText mb>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기하며, 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</TOSSubText>

            <TOSSubTitle>7. 미이용자의 개인정보 파기 등에 관한 조치</TOSSubTitle>
            <TOSSubText>가. 회사는 1년간 서비스를 이용하지 않은 이용자의 정보를 파기하고 있습니다. 다만, 다른 법령에서 정한 보존기간이 경과할 때까지 다른 이용자의 개인정보와 분리하여 별도로 저장ㆍ관리할 수 있습니다.</TOSSubText>
            <TOSSubText>나. 회사는 개인정보의 파기 30일 전까지 개인정보가 파기되는 사실, 기간만료일 및 파기되는 개인정보의 항목을 이메일, 문자 등 이용자에게 통지 가능한 방법으로 알리고 있습니다.</TOSSubText>
            <TOSSubText mb>다. 개인정보의 파기를 원하지 않으시는 경우, 기간 만료 전 서비스 로그인을 하시면 됩니다.</TOSSubText>

            <TOSSubTitle>8. 만14세 미만 아동의 개인정보보호</TOSSubTitle>
            <TOSSubText mb>회사가 운영하는 사이트에서는 만14세 미만 아동의 경우 회원가입이 불가능합니다.</TOSSubText>

            <TOSSubTitle>9. 이용자의 권리와 그 행사방법</TOSSubTitle>
            <TOSSubText>가. 이용자는 회사에 대해 언제든지 등록되어 있는 자신의 개인정보 열람ㆍ정정ㆍ삭제ㆍ처리정지 요구 등의 권리를 행사할 수 있습니다.</TOSSubText>
            <TOSSubText>나. 이용자의 개인정보 조회, 수정을 위해서는 '개인정보변경'(또는 '회원정보수정' 등)을, 가입해지(동의철회)를 위해서는 ’회원탈퇴’를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다. 혹은 개인정보보호법 시행령 제41조 제1항에 따라 개인정보관리책임자에게 서면, 전자우편, 모사전송(FAX) 또는 전화로 연락하시면 지체 없이 조치하겠습니다.</TOSSubText>
            <TOSSubText>다. 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수도 있습니다. 이 경우 “개인정보 처리 방법에 관한 고시(제2020-7호)” 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</TOSSubText>
            <TOSSubText>라. 개인정보 열람 및 처리정지 요구는 「개인정보보호법」 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한될 수 있습니다.</TOSSubText>
            <TOSSubText>마. 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</TOSSubText>
            <TOSSubText>바. 회사는 정보주체 권리에 따른 열람의 요구, 정정ㆍ삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</TOSSubText>
            <TOSSubText>사. 이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이 이루어지도록 하겠습니다.</TOSSubText>
            <TOSSubText mb>아. 회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는 "5. 개인정보의 보유 및 이용기간"에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.</TOSSubText>

            <TOSSubTitle>10. 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항</TOSSubTitle>
            <TOSSubText>회사는 이용자들에게 특화된 맞춤서비스를 제공하기 위해서 이용자들의 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다. 쿠키는 웹사이트를 운영하는 데 이용되는 서버(HTTP)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다.</TOSSubText>
            <TOSSubText>가. 쿠키의 사용 목적</TOSSubText>
            <TOSSubText>이용자들이 방문한 회사의 각 서비스와 웹 사이트들에 대한 로그인 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위하여 사용합니다. 또한 이용자의 접속 빈도나 방문 시간 등을 분석하고 이용자의 취향과 관심분야를 파악하여 타겟(Target) 마케팅 및 서비스 개편 등의 척도로 활용합니다.</TOSSubText>
            <TOSSubText>나. 쿠키의 설치운영 및 거부</TOSSubText>
            <TOSSubText>이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서, 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.</TOSSubText>
            <TOSSubText>쿠키 설정을 거부하는 방법으로는 이용자가 사용하는 웹 브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나 쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.</TOSSubText>
            <TOSSubText>{`설정방법(예:인터넷 익스플로어의 경우) : 웹 브라우저 상단의 도구 > 인터넷 옵션 > 개인정보`}</TOSSubText>
            <TOSSubText mb>다만, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 회사의 일부 서비스는 이용에 어려움이 있을 수 있습니다.</TOSSubText>

            <TOSSubTitle>11. 행태정보의 수집ㆍ이용ㆍ제공 및 거부 등에 관한 사항</TOSSubTitle>
            <TOSSubText mb>회사는 온라인 맞춤형 광고 등을 위한 행태정보를 수집ㆍ이용ㆍ제공하지 않습니다.</TOSSubText>

            <TOSSubTitle>12. 개인정보의 기술적/관리적 보호 대책</TOSSubTitle>
            <TOSSubText>회사는 이용자들의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적/관리적 대책을 강구하고 있습니다.</TOSSubText>
            <TOSSubText>가. 개인정보 암호화</TOSSubText>
            <TOSSubText>이용자의 주요 개인정보는 암호화하여 저장하고 있으며, 파일 및 전송데이터를 암호화하여 혹시 발생할 수 있는 사고 시라도 이용자의 개인정보가 유출되지 않도록 관리되고 있습니다.</TOSSubText>
            <TOSSubText>나. 해킹 등에 대비한 대책</TOSSubText>
            <TOSSubText>회사는 해킹이나 컴퓨터 바이러스 등에 의해 이용자의 개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을 다하고 있습니다. 개인정보의 훼손에 대비해서 자료를 수시로 백업하고 있고, 최신 백신프로그램을 이용하여 이용자들의 개인정보나 자료가 누출되거나 손상되지 않도록 방지하고 있으며, 암호화 통신 등을 통하여 네트워크상에서 개인정보를 안전하게 전송할 수 있도록 하고 있습니다. 그리고 24시간 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있으며, 기타 시스템적으로 보안성을 확보하기 위한 가능한 모든 기술적 장치를 갖추려 노력하고 있습니다.</TOSSubText>
            <TOSSubText>다. 처리 직원의 최소화 및 교육</TOSSubText>
            <TOSSubText>회사의 개인정보관련 처리 직원은 담당자에 한정시키고 있고 이를 위한 별도의 비밀번호를 부여하여 정기적으로 갱신하고 있으며, 담당자에 대한 수시 교육을 통하여 개인정보처리방침의 준수를 항상 강조하고 있습니다.</TOSSubText>
            <TOSSubText>라. 개인정보보호전담기구의 운영</TOSSubText>
            <TOSSubText>사내 개인정보보호전담기구 등을 통하여 회사의 개인정보처리방침의 이행사항 및 담당자의 준수여부를 확인하여 문제가 발견될 경우 즉시 수정하고 바로 잡을 수 있도록 노력하고 있습니다.</TOSSubText>
            <TOSSubText mb>단, 회사가 개인정보보호 의무를 다 하였음에도 불구하고 이용자 본인의 부주의나 회사가 관리하지 않는 영역에서의 사고 등 회사의 귀책에 기인하지 않은 손해에 대해서는 회사는 책임을 지지 않습니다.</TOSSubText>

            <TOSSubTitle>13. 개인정보관리책임자 및 담당자의 연락처</TOSSubTitle>
            <TOSSubText>회사는 개인정보에 대한 의견수렴 및 불만처리를 담당하는 개인정보보호책임자 및 담당자를 지정하고 있고, 연락처는 아래와 같습니다.</TOSSubText>
            <TOSSubText>개인정보 관리책임자(적용일시: 22.05.31)</TOSSubText>
            <TOSSubText>· 이름 : ㈜핸들 기획팀 이동녕 이사</TOSSubText>
            <TOSSubText>· 전화번호 : 070-4285-7153</TOSSubText>
            <TOSSubText>· E-MAIL : dnlee@carmerce.co.kr</TOSSubText>
            <TOSSubText>개인정보관리담당자</TOSSubText>
            <TOSSubText>· 이름 : ㈜핸들 기획팀 최지한 매니저</TOSSubText>
            <TOSSubText>· 전화번호 : 070-4285-7153</TOSSubText>
            <TOSSubText>· E-MAIL : jhchoi@carmerce.co.kr</TOSSubText>
            <TOSSubText>이용자는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보보호책임자 혹은 담당부서로 신고하실 수 있습니다. 회사는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.</TOSSubText>
            <TOSSubText>기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.</TOSSubText>
            <TOSSubText>- 개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</TOSSubText>
            <TOSSubText>- 개인정보분쟁조정위원회 (www.kopico.go.kr / 02-1833-6972)</TOSSubText>
            <TOSSubText>- 대검찰청 사이버수사과 (http://www.spo.go.kr / 국번없이 1301)</TOSSubText>
            <TOSSubText mb>- 경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</TOSSubText>

            <TOSSubTitle>14. 개인정보 열람청구</TOSSubTitle>
            <TOSSubText>정보주체는 「개인정보보호법」 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.</TOSSubText>
            <TOSSubText>개인정보 열람청구 접수ㆍ처리 부서</TOSSubText>
            <TOSSubText>· 부서명 : 기획팀</TOSSubText>
            <TOSSubText>· 담당자 : 이동녕 이사</TOSSubText>
            <TOSSubText mb>· 연락처 : 070-4285-7153</TOSSubText>

            <TOSSubTitle>15. 기타</TOSSubTitle>
            <TOSSubText mb>회사가 운영하는 사이트에 링크되어 있는 웹사이트들이 개인정보를 수집하는 행위에 대해서는 본 "카머스 파트너스 개인정보처리방침"이 적용되지 않음을 알려 드립니다.</TOSSubText>

            <TOSSubTitle>16. 개인정보 처리방침 변경 및 고지</TOSSubTitle>
            <TOSSubText>현 개인정보처리방침 내용 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일 전부터 변경이유 및 내용을 홈페이지의 '공지사항'을 통해 고지할 것입니다.</TOSSubText>
            <TOSSubText>본 개인정보처리방침의 내용은 수시로 변경될 수 있으므로 사이트를 방문하실 때마다, 이를 확인하시기 바랍니다.</TOSSubText>
            <TOSSubText>· 개인정보처리방침 버전번호 : Ver 1.0</TOSSubText>
            <TOSSubText>· 공고일자 : 2022년 05월 31일</TOSSubText>
            <TOSSubText mb>· 시행일자 : 2022년 05월 31일</TOSSubText>
        </>
);

export default TOSPersonalInformation;
