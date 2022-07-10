import React, {memo, useState} from 'react';
import theme from "../../../public/theme";
import Txt from "../../../src/component/atom/Txt";
import Wrapper from "../../../src/component/atom/Wrapper";
import {OptionItem} from "../../../src/container/filter/component";

const WheelDriveTransmission = () => {
    // 구동방식
    const [frontWheelDrive, setFrontWheelDrive] = useState(false);  // 전륜
    const [rearWheelDrive, setRearWheelDrive] = useState(false);    // 후륜
    const [fourWheelDrive, setFourWheelDrive] = useState(false);    // 4D

    // 변속기
    const [automatic, setAutomatic] = useState(false); // 자동
    const [manual, setManual] = useState(false);    // 수동

    // 구동방식
    const wheelDriveArr = [
        {name: '전륜', isChk: frontWheelDrive, onChange: () => setFrontWheelDrive(!frontWheelDrive)},
        {name: '후륜', isChk: rearWheelDrive, onChange: () => setRearWheelDrive(!rearWheelDrive)},
        {name: '4WD', isChk: fourWheelDrive, onChange: () => setFourWheelDrive(!fourWheelDrive)},
    ];

    // 변속기
    const transmissionArr = [
        {name: '자동', isChk: automatic, onChange: () => setAutomatic(!automatic)},
        {name: '수동', isChk: manual, onChange: () => setManual(!manual)},
    ];

    return (
        <Wrapper padding={'25px'} mt={10} backgroundColor={theme.color.white}>
            {/* 구동방식 */}
            <Wrapper>
                <Txt type={'black'} fontSize={15} color={theme.color.black}>구동 방식</Txt>
                {wheelDriveArr.map((item, key) => (
                    <OptionItem name={item.name} isChk={item.isChk} onChange={item.onChange} mt={10}/>
                ))}
            </Wrapper>
            {/* 변속기 */}
            <Wrapper mt={19}>
                <Txt type={'black'} fontSize={15} color={theme.color.black}>변속기</Txt>
                {transmissionArr.map((item, key) => (
                    <OptionItem name={item.name} isChk={item.isChk} onChange={item.onChange} mt={10}/>
                ))}
            </Wrapper>
        </Wrapper>
    );
};

export default memo(WheelDriveTransmission);
