import React, {ReactElement} from "react";
import styled from "@emotion/styled";
import Wrapper from "../../../component/atom/Wrapper";
import theme from "../../../../public/theme";
import Txt from "../../../component/atom/Txt";

interface ICheckBoxStyle {
    isChk?: boolean;
};

interface ICheckbox {
    isChk?: boolean;
    onChange?: () => void;
    name: string | ReactElement;
    mr?: string | number;
    ml?: string | number;
    mt?: string | number;
    mb?: string | number;
};

export const OptionItem = ({isChk, onChange, name, mr, ml, mt, mb} : ICheckbox) => {
    return (
        <OptionBox h w isChk={isChk} onClick={onChange} mr={mr} mt={mt} mb={mb} ml={ml}>
            <OptionTxt type={'medium'} fontSize={15} isChk={isChk}>{name}</OptionTxt>
        </OptionBox>
    )
};


const OptionBox = styled(Wrapper)<ICheckBoxStyle>`
  display: inline-flex;
  margin-right: -2px;
  line-height: 1.2;
  width: 49%;
  height: 48px;
  text-align: center;
  vertical-align: middle;
  background: transparent;
  border-radius: 4px;
  border: ${(props) => props.isChk
    ? `1px solid ${theme.color.optionBox}`
    :`1px solid ${theme.color.lineGray}` };
  &:nth-of-type(2n) {
    margin-left: 10px;
  }
`;

const OptionTxt = styled(Txt)<ICheckBoxStyle>`
  color: ${(props) => props.isChk
    ? `${theme.color.optionBox}`
    : `${theme.color.black}` }
`;
