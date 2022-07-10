import React, {memo, ReactText, useEffect, useRef} from 'react';
import styled from '@emotion/native';
import ICommonStyle from '../../interface/ICommonStyle';
import Text from 'Text';
import theme from '../../../public/theme';
import Wrapper from './Wrapper';
import WhcbrType from '../../type/WhcbrType';
import {attachPixel, exportThemeIntoWhcbr, getAutoBorderRadiusSize} from '../../module/formatter';
import {TouchableOpacity} from 'react-native';
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
  alignItems
} from 'styled-system';

interface IButton extends ICommonStyle {
  whcbr: WhcbrType;
  onPress?: (e: any) => void;
  fontSize?: ReactText;
  style?: any;
  children?: any | string;
  loading?: boolean; // loading이 true면 페이지 내의 모든 행동이 제어됨 (중복 submit방지 등 zIndex:1000인 Wrapper가 fixed됨).
  loadingDialog?: boolean; // loadingDialog가 true면 로딩 팝업이 활성화 되면서 페이지 내의 모든 행동이 제어됨 (중복 submit방지 등 zIndex:1000인 Wrapper가 fixed됨).
  className?: string;
  loadingDialogMessage?: string;
  disabled?: boolean;
  tabIndex?: number;
  fontWeight?: 'light' | 'regular' | 'medium' | 'bold' | 'thick';
}

const Button = ({whcbr, fontWeight, fontSize = 15, onPress, width, children, loading, loadingDialog, className, loadingDialogMessage, tabIndex, disabled, ...props}: IButton) => {
  const _onPress = (e: any) => {
    onPress ? (loading ? () => null : loading === false ? onPress(e) : loading === undefined ? onPress(e) : () => null) : () => null;
  };

  const focusRef: any = useRef(null);
  useEffect(() => {
    loadingDialog && focusRef.current && focusRef.current.focus();
  }, [loadingDialog]);

  return (
    <>
      <_Button
        children={
          <_Text weight={fontWeight} size={attachPixel(fontSize)} whcbr={exportThemeIntoWhcbr(whcbr)}>
            {children}
          </_Text>
        }
        whcbr={exportThemeIntoWhcbr(whcbr)}
        onPress={_onPress}
        tabIndex={tabIndex}
        disabled={disabled}
        loading={loading}
        loadingDialog={loadingDialog}
        loadingDialogMessage={loadingDialogMessage}
        {...props}
      />
    </>
  );
};
export default memo(Button);
// {loading && <Wrapper width="100vw" height="100vh" position="fixed" background="none" style={{top: 0, left: 0, zIndex: 1000}}></Wrapper>}
// {loadingDialog && (
//   <Wrapper w h width="100vw" height="100vh" position="fixed" background="#ffffffc7" style={{top: 0, left: 0, zIndex: 1000}}>
//     <LoadingWrapper>
//       <img src="/images/carmerce_symbol.png" className="rotating-loading-logo" />
//       {/* 로딩시 중복 클릭을 방지한 focus제어 버튼 (엔터광클방지) */}
//     </LoadingWrapper>
//     <Text size="20px">{loadingDialogMessage}</Text>
//     <FakeBtn className="fake-button" ref={focusRef} style={{width: '0px', height: '0px', backgroundColor: 'none', border: 'none'}}></FakeBtn>
//   </Wrapper>
// )}

const isWhiteButton = (color: string): boolean => color === 'white' || color === '#fff' || color === '#ffffff' || color === 'transparent' || color === 'none';
const getAutoFontSize = (height: number): number => {
  if (height < 40) return 13;
  if (height < 50) return 15;
  return 15;
};

const _Button = styled(TouchableOpacity)<any>`
  font-family: ${({fontFamily}) => fontFamily || theme.font.bold};
  width: ${({whcbr}) => attachPixel(whcbr[0])};
  height: ${({whcbr}) => attachPixel(whcbr[1])};
  background: ${({whcbr}) => whcbr[2]};
  border: ${({whcbr}) => whcbr[3]};
  border-radius: ${({whcbr}) => `${whcbr[4] || getAutoBorderRadiusSize(whcbr[1])}px`};
  font-size: ${({fontSize, whcbr}) => `${fontSize || getAutoFontSize(whcbr[1])}px`};
  align-items: center;
  justify-content: center;
  &:disabled {
    ${({disabled}) => disabled && 'opacity: 0.3;'}
  }
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

const _Text = styled(Text)<any>`
  color: ${({whcbr}: {whcbr: WhcbrType}) => (isWhiteButton(whcbr[2] as string) ? ((whcbr[3] as string).includes('#0066ff') ? '#0066ff' : 'black') : 'white')};
`;

const LoadingWrapper = styled.View`
  align-items: center;
  justify-content: center;
  height: 80%;
  margin-right: 15px;
  img.rotating-loading-logo {
    animation: rotate_image 1s linear infinite;
    transform-origin: 50% 50%;
    width: 110px;
    opacity: 1;
  }

  @keyframes rotate_image {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const FakeBtn = styled.TouchableOpacity`
  &:focus {
    outline: none;
    box-shadow: none;
    -webkit-box-shadow: none;
  }
`;
