import Txt from '../../src/component/atom/Txt';
import Wrapper from '../../src/component/atom/Wrapper';
import theme from '../../public/theme';
import Img from "../../src/component/atom/Img";
import React from "react";
import styled from "@emotion/native";
import {PaymentTitle} from "../../src/component/atom/InputLine";

const optionList: any = {
    bluetooth: require('../../public/image/detail/icon-option-bluetooth.png'),
    exterior1: require('../../public/image/detail/icon-option-exterior1.png'),
    interior8: require('../../public/image/detail/icon-option-interior12.png'),
    interior10: require('../../public/image/detail/icon-option-interior10.png'),
    interior12: require('../../public/image/detail/icon-option-interior8.png'),
    ldws: require('../../public/image/detail/icon-option-ldws.png'),
    navigation: require('../../public/image/detail/icon-option-navigation.png'),
    safety2: require('../../public/image/detail/icon-option-safety2.png'),
    safety9: require('../../public/image/detail/icon-option-safety9.png'),
    safety15: require('../../public/image/detail/icon-option-safety15.png'),
    smartkey: require('../../public/image/detail/icon-option-smartkey.png'),
    '1': require('../../public/image/detail/icon-option-sunroof.png'),
    utilityMultimedia1: require('../../public/image/detail/icon-option-utilityMultimedia1.png'),
    utilityMultimedia2: require('../../public/image/detail/icon-option-utilityMultimedia2.png'),
    utilityMultimedia5: require('../../public/image/detail/icon-option-utilityMultimedia5.png'),
    utilityMultimedia6: require('../../public/image/detail/icon-option-utilityMultimedia6.png'),
    utilityMultimedia11: require('../../public/image/detail/icon-option-utilityMultimedia11.png'),
}

interface IOptionDom {
    title: string | any;
    value: string;
}

const OptionDom = ({title, value}: IOptionDom) => (
    <OptionBox w paddingY={17}>
        <Img src={optionList[value]} width={50} height={50} />
        <Txt size={'xs'} weight={'medium'} textAlign={'center'} mt={1}>{title}</Txt>
    </OptionBox>
)
const OptionBox = styled(Wrapper)`
    width: 25%;
`;

export function OptionTop({data}: {data?: any}) {
    const basicOption = data;
    const exterior = basicOption?.exterior?.filter((item: any) => item.isExist === true && ![1].includes(item.priority));
    const interior = basicOption?.interior?.filter((item: any) => item.isExist === true && ![8, 10, 12].includes(item.priority));
    const safety = basicOption?.safety?.filter((item: any) => item.isExist === true && ![2, 9, 15].includes(item.priority));
    const utilityMultimedia = basicOption?.utilityMultimedia?.filter((item: any) => item.isExist === true && ![1, 2, 5, 6, 11].includes(item.priority));
    const keyExterior = basicOption?.exterior?.filter((item: any) => item.isExist === true && [1].includes(item.priority));
    const keyInterior = basicOption?.interior?.filter((item: any) => item.isExist === true && [8, 10, 12].includes(item.priority));
    const keySafety = basicOption?.safety?.filter((item: any) => item.isExist === true && [2, 9, 15].includes(item.priority));
    const keyUtilityMultimedia = basicOption?.utilityMultimedia?.filter((item: any) => item.isExist === true && [1, 2, 5, 6, 11].includes(item.priority));

    return (
        <>
            <Wrapper row between>
                <PaymentTitle title={'주요 옵션정보'} />
                <Wrapper row>
                    <Txt size={'sm'} weight={'medium'}>주요 옵션 </Txt>
                    <Txt size={'sm'} weight={'thick'} color={'primary'}>{keyExterior?.length + keyInterior?.length + keySafety?.length + keyUtilityMultimedia?.length || 0}</Txt>
                    <Txt size={'sm'} weight={'medium'}> 개 / 기타 옵션 </Txt>
                    <Txt size={'sm'} weight={'thick'} color={'primary'}>{exterior?.length + interior?.length + safety?.length + utilityMultimedia?.length || 0}</Txt>
                    <Txt size={'sm'} weight={'medium'}> 개</Txt>
                </Wrapper>
            </Wrapper>
            <Wrapper mt={20} row wrap>
                {keyExterior?.map((item: any, index: number) => (
                    <OptionDom key={index} title={[item.optionName]} value={item.priority} />
                ))}
                {keyInterior?.map(
                    (item: any, index: number) =>
                        [8, 10, 12].includes(item.priority) && <OptionDom key={index} title={item.optionName.replace('(', ' (').split(' ')} value={`interior${item.priority}`} />
                )}
                {keySafety?.map(
                    (item: any, index: number) =>
                        [2, 9, 15].includes(item.priority) && <OptionDom key={index} title={item.optionName.replace('(', ' (').split(' ')} value={`safety${item.priority}`} />
                )}
                {keyUtilityMultimedia?.map(
                    (item: any, index: number) =>
                        [1, 2, 5, 6, 11].includes(item.priority) && (
                            <OptionDom key={index} title={item.optionName.replace('(', ' (').split(' ')} value={`utilityMultimedia${item.priority}`} />
                        )
                )}
            </Wrapper>
        </>
    );
}
