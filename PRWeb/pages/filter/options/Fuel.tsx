import React, {memo, useCallback, useEffect, useState} from 'react';
import Wrapper from "../../../src/component/atom/Wrapper";
import Txt from "../../../src/component/atom/Txt";
import theme from "../../../public/theme";
import {OptionItem} from "../../../src/container/filter/component";

const Fuel = () => {
    const [gasoline, setGasoline] = useState(false);    // 가솔린
    const [diesel, setDiesel] = useState(false);    // 디젤
    const [electricity, setElectricity] = useState(false);  // 전기
    const [hybrid, setHybrid] = useState(false);  // 하이브리드
    const [lpg, setLpg] = useState(false);  // LPG
    const [hydrogenElectricity, setHydrogenElectricity] = useState(false);  // 수소차

    const optionsArr = [
        {name: '가솔린', isChk: gasoline, onChange: () => setGasoline(!gasoline)},
        {name: '전기', isChk: electricity, onChange: () => setElectricity(!electricity)},
        {name: '디젤', isChk: diesel, onChange: () => setDiesel(!diesel)},
        {name: '하이브리드', isChk: hybrid, onChange: () => setHybrid(!hybrid)},
        {name: 'LPG', isChk: lpg, onChange: () => setLpg(!lpg)},
        {name: '수소', isChk: hydrogenElectricity, onChange: () => setHydrogenElectricity(!hydrogenElectricity)},
    ];

    const onChangeElectricity = useCallback((e: any) => {
        e.target.value;
        setElectricity(true);
        console.log('electricity', electricity);
    },[electricity]);

    return (
        <Wrapper padding={'25px'} mt={10} backgroundColor={theme.color.white}>
            <Txt type={'black'} fontSize={15} color={theme.color.black}>연료</Txt>
            {optionsArr.map((item: any, key) => (
                <OptionItem name={item.name} isChk={item.isChk} onChange={item.onChange} mt={10}/>
            ))}
        </Wrapper>
    )

};

export default memo(Fuel);
