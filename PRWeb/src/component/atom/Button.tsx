import React, {memo, useEffect, useRef} from 'react';
import styled from '@emotion/styled';
import ICommonStyle from '../../interface/ICommonStyle';
import Text from 'Text';
import theme from '../../../public/theme';
import Wrapper from './Wrapper';
import WhcbrType from 'src/type/WhcbrType';
import {attachPixel, exportThemeIntoWhcbr, getAutoBorderRadiusSize} from '../../module/formatter';
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
  whcbr?: WhcbrType;
  onClick?: (e: any) => void;
  style?: any;
  children?: any | string;
  loading?: boolean; // loading이 true면 페이지 내의 모든 행동이 제어됨 (중복 submit방지 등 zIndex:1000인 Wrapper가 fixed됨).
  loadingDialog?: boolean; // loadingDialog가 true면 로딩 팝업이 활성화 되면서 페이지 내의 모든 행동이 제어됨 (중복 submit방지 등 zIndex:1000인 Wrapper가 fixed됨).
  className?: string;
  loadingDialogMessage?: string;
  disabled?: boolean;
  tabIndex?: number;
}

const Button = ({whcbr, onClick, width, children, loading, loadingDialog, className, loadingDialogMessage, tabIndex, disabled, ...props}: IButton) => {
  const OnClick = (e: any) => {
    onClick ? (loading ? () => null : loading === false ? onClick(e) : loading === undefined ? onClick(e) : () => null) : () => null;
  };

  const focusRef: any = useRef(null);
  useEffect(() => {
    loadingDialog && focusRef.current && focusRef.current.focus();
  }, [loadingDialog]);

  return (
    <>
      <_Button
        whcbr={exportThemeIntoWhcbr(whcbr)}
        onClick={OnClick}
        tabIndex={tabIndex}
        disabled={disabled}
        loading={loading}
        loadingDialog={loadingDialog}
        loadingDialogMessage={loadingDialogMessage}
        {...props}
      >
        {children}
      </_Button>
      {loading && <Wrapper width="100vw" height="100vh" position="fixed" background="none" style={{top: 0, left: 0, zIndex: 1000, cursor: 'progress'}}></Wrapper>}
      {loadingDialog && (
        <Wrapper w h width="100vw" height="100vh" position="fixed" background="#ffffffc7" style={{top: 0, left: 0, zIndex: 1000, cursor: 'progress'}}>
          <LoadingWrapper>
            <img src="/images/carmerce_symbol.png" className="rotating-loading-logo" />
            {/* 로딩시 중복 클릭을 방지한 focus제어 버튼 (엔터광클방지) */}
          </LoadingWrapper>
          <Text size="20px">{loadingDialogMessage}</Text>
          <FakeBtn className="fake-button" ref={focusRef} style={{width: '0px', height: '0px', background: 'none', border: 'none'}}></FakeBtn>
        </Wrapper>
      )}
    </>
  );
};
export default memo(Button);

const isWhiteButton = (color: string): boolean => color === 'white' || color === '#fff' || color === '#ffffff' || color === 'transparent' || color === 'none';
const getAutoFontSize = (height: number): number => {
  if (height < 40) return 13;
  if (height < 50) return 15;
  return 15;
};

const _Button = styled('button')<any>`
  font-family: ${({fontFamily}) => fontFamily || theme.font.bold};
  width: ${({whcbr}) => attachPixel(whcbr[0])};
  height: ${({whcbr}) => attachPixel(whcbr[1])};
  background: ${({whcbr}) => whcbr[2]};
  border: ${({whcbr}) => whcbr[3]};
  border-radius: ${({whcbr}) => `${whcbr[4] || getAutoBorderRadiusSize(whcbr[1])}px`};
  cursor: ${({cursor}) => cursor || 'pointer'};
  color: ${({color, whcbr}) => color || (isWhiteButton(whcbr[2]) ? (whcbr[3].includes('#0066ff') ? '#0066ff' : 'black') : 'white')};
  font-size: ${({fontSize, whcbr}) => `${fontSize || getAutoFontSize(whcbr[1])}px`};
  &:active {
    box-shadow: 0px 0px 10px #b3b3b3 inset;
  }
  &:disabled {
    ${({disabled}) => disabled && 'opacity: 0.3;'}
    cursor: not-allowed;
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

const LoadingWrapper = styled.div`
  display: flex;
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

const FakeBtn = styled.button`
  &:focus {
    outline: none;
    box-shadow: none;
    -webkit-box-shadow: none;
  }
`;
