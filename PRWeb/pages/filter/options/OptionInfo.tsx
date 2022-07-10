import React, {memo, ReactElement, useState} from 'react';
import Wrapper from "../../../src/component/atom/Wrapper";
import theme from "../../../public/theme";
import Txt from "../../../src/component/atom/Txt";
import Line from "../../../src/component/atom/Line";
import {OptionItem} from "../../../src/container/filter/component";

const OptionInfo = () => {
    // 편의
    const [sunroof, setSunroof] = useState(false);  // 썬루프
    const [memorySeat, setMemorySeat] = useState(false);  // 메모리시트
    const [ventilatedSeat, setVentilatedSeat] = useState(false);  // 통풍시트
    const [heatedSeat, setHeatedSeat] = useState(false);  // 열선시트

    // 주행보조
    const [adaptiveCruiseControl, setAdaptiveCruiseControl] = useState(false);  // 어뎁티드크루즈컨트롤
    const [safetyAroundView, setSafetyAroundView] = useState(false);    // 360도어라운드뷰
    const [laneDepartureWarningSensor, setLaneDepartureWarningSensor] = useState(false);    // 차선이탈 경보 (LDWS)
    const [safetyRearWarningSensor, setSafetyRearWarningSensor] = useState(false);  // 후측방 경고 시스템

    // 유틸리티
    const [bluetooth, setBluetooth] = useState(false);  // 블루투스
    const [headUpDisplay, setHeadUpDisplay] = useState(false);  // 헤드업디스플레이
    const [smartCardKey, setSmartCardKey] = useState(false);  // 스마트키

    // 편의
    const convenienceArr = [
        {name: '썬루프', isChk: sunroof, onChange: () => setSunroof(!sunroof)},
        {name: '메모리시트', isChk: memorySeat, onChange: () => setMemorySeat(!memorySeat)},
        {name: '통풍시트', isChk: ventilatedSeat, onChange: () => setVentilatedSeat(!ventilatedSeat)},
        {name: '열선시트', isChk: heatedSeat, onChange: () => setHeatedSeat(!heatedSeat)},
    ];

    // 주행보조
    const drivingAssistanceArr = [
        {name: <p>어뎁티드<br/>크루즈 컨트롤</p>, isChk: adaptiveCruiseControl, onChange: () => setAdaptiveCruiseControl(!adaptiveCruiseControl)},
        {name: <p>360도<br/>어라운드뷰</p>, isChk: safetyAroundView, onChange: () => setSafetyAroundView(!safetyAroundView)},
        {name: <p>차선이탈<br/>경보 (LDWS)</p>, isChk: laneDepartureWarningSensor, onChange: () => setLaneDepartureWarningSensor(!laneDepartureWarningSensor)},
        {name: <p>후측방<br/>경보시스템</p>, isChk: safetyRearWarningSensor, onChange: () => setSafetyRearWarningSensor(!safetyRearWarningSensor)},
    ];

    // 유틸리티
    const utilitiesArr = [
        {name: '블루투스', isChk: bluetooth, onChange: () => setBluetooth(!bluetooth)},
        {name: '헤드업 디스플레이', isChk: headUpDisplay, onChange: () => setHeadUpDisplay(!headUpDisplay)},
        {name: '스마트키', isChk: smartCardKey, onChange: () => setSmartCardKey(!smartCardKey)},
    ];

     return (
         <Wrapper padding={'25px'} mt={10} backgroundColor={theme.color.white}>
             <Txt type={'black'} fontSize={15} color={theme.color.black}>옵션 정보</Txt>
             <Line width={'100%'} mt={10} mb={16}/>
             {/* 편의 */}
             <Wrapper mt={19}>
                <Txt type={'black'} fontSize={15} color={theme.color.black}>편의</Txt>
                 {convenienceArr.map((item: any, key) => (
                     <OptionItem name={item.name} isChk={item.isChk} onChange={item.onChange} mt={10} />
                 ))}
             </Wrapper>
             {/* 주행보조 */}
             <Wrapper mt={19}>
                 <Txt type={'black'} fontSize={15} color={theme.color.black}>주행보조</Txt>
                 {drivingAssistanceArr.map((item: any, key) => (
                     <OptionItem name={item.name} isChk={item.isChk} onChange={item.onChange} mt={10} />
                 ))}
             </Wrapper>
             {/* 유틸리티 */}
             <Wrapper mt={19}>
                 <Txt type={'black'} fontSize={15} color={theme.color.black}>유틸리티</Txt>
                 {utilitiesArr.map((item: any, key) => (
                     <OptionItem name={item.name} isChk={item.isChk} onChange={item.onChange} mt={10} />
                 ))}
             </Wrapper>


         </Wrapper>
     )
};
export default memo(OptionInfo);


