import React, {ReactElement, useCallback} from 'react';
import Wrapper from "../../src/component/atom/Wrapper";
import styled from "@emotion/styled";
import Txt from "../../src/component/atom/Txt";
import Input from "../../src/component/atom/Input";
import useInput from "../../src/hook/useInput";
import theme, {whiteBlue} from "../../public/theme";
import Fuel from "options/Fuel";
import OptionInfo from "options/OptionInfo";
import WheelDriveTransmission from "options/WheelDriveTransmission";

const Filter = () => {
    const searchBrand = useInput('');

    return(
        <Wrapper backgroundColor={theme.color.backgroundGray}>
            {/* tab start */}
            <Wrapper flex borderBottom={'1px solid #cfd5db'} padding={'0 20px'} between backgroundColor={theme.color.white}>
                <Wrapper flex>
                    <TabBox width={80} borderBottom={'2px solid #007aff'} center>
                        <Txt type={'black'} fontSize={16} color={'#333'}>브랜드/모델</Txt>
                    </TabBox>
                    <TabBox width={80} center>
                        <Txt type={'medium'} fontSize={16} color={'#333'} opacity={0.3}>외형</Txt>
                    </TabBox>
                    <TabBox width={80} center>
                        <Txt type={'medium'} fontSize={16} color={'#333'} opacity={0.3}>상세필터</Txt>
                    </TabBox>
                </Wrapper>
                <Wrapper padding={'25px 0 15px'}>
                    <CloseIcon />
                </Wrapper>
            </Wrapper>
            {/* tab end */}
            <Wrapper padding={'14px 20px'} backgroundColor={theme.color.white}>
                <Input hook={searchBrand} placeholder={'브랜드 또는 모델명을 검색해주세요'} whcbr={['100%', 50, whiteBlue]} mb={10}/>
            </Wrapper>
            <Fuel />
            <OptionInfo />
            <WheelDriveTransmission />
        </Wrapper>
    )
};

export default Filter;


export const TabBox = styled(Wrapper)`
  padding: 25px 0 15px;
`;

export const CloseIcon = styled.div`
  width: 15px;
  height: 15px;
  position: relative;
  //outline: 2px dotted red;
  
  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: -3px;
    left: 7px;
    width: 1px;
    height: 20px;
    background-color: #333;
    transform: rotate(45deg);
  }
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: -3px;
    left: 7px;
    width: 1px;
    height: 20px;
    background-color: #333;
    transform: rotate(-45deg);
  }
`;
