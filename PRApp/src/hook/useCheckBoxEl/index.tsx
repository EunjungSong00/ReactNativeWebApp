import styled from '@emotion/native';
import React, {useState, useCallback, ReactText} from 'react';
import Wrapper from '../../component/atom/Wrapper';
import Text from '../../component/atom/Text';
import {TouchableOpacity, Image} from 'react-native';
import ICommonStyle from '../../../../carmerce-user/src/interface/ICommonStyle';
import {
  height,
  margin,
  width,
  padding,
  color,
  flexDirection,
  textAlign,
  borderRadius,
  background,
  display,
  position,
  justifyContent,
  minWidth,
  verticalAlign,
  minHeight,
  maxWidth,
  maxHeight,
  border,
  alignItems,
  flex
} from 'styled-system';
import Txt from "../../component/atom/Txt";
import Img from "../../component/atom/Img";

interface IUseCheckBox extends ICommonStyle {
  label?: ReactText;
}

const useCheckBoxEl = (initialValue?: boolean) => {
  const [check, setCheck] = useState(!!initialValue);

  const CheckBoxEl = useCallback(
    ({label, ...props}: IUseCheckBox) => (
      <CheckBoxWrapper {...props}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setCheck((val) => !val)}>
          <Wrapper w row>
            <Img src={check ? require('../../../public/image/component/check-on.png') : require('../../../public/image/component/check-off.png')} width={20} height={20} />
            <Txt size={'sm'} weight={'medium'} ml={13}>{label}</Txt>
          </Wrapper>
        </TouchableOpacity>
      </CheckBoxWrapper>
    ),
    [check]
  );

  return {Element: CheckBoxEl, value: check, setValue: setCheck};
};

export default useCheckBoxEl;

const CheckBoxWrapper = styled(Wrapper)`
  ${flex}
  ${height}
${width}
${minWidth}
${maxWidth}
${minHeight}
${maxHeight}
${margin}
${padding}
${color}
${flexDirection}
${borderRadius}
${background}
${display}
${position}
${justifyContent}
${alignItems}
${verticalAlign}
${textAlign}
${border}
`;
