import React from 'react';
import styled from '@emotion/native';
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
import {ReactElement, Ref, forwardRef, ReactText} from 'react';
import {View} from 'react-native';
import {attachPixel} from '../../module/formatter';
import ICommonStyle from '../../interface/ICommonStyle';

interface IStyledWrapper extends ICommonStyle {
  w?: boolean;
  h?: boolean;
  d?: boolean;
  column?: boolean;
  row?: boolean;
  wrap?: boolean;
  center?: boolean;
  left?: boolean;
  right?: boolean;
  mobile?: boolean;
  between?: boolean;
  flexNum?: number;
  overflowX?: true | string;
  overflowY?: true | string;
  ellipsis?: boolean;
  size?: ReactText[] | ReactText;
  flex?: number;
  bgColor?: string;
  mt?: ReactText;
  mr?: ReactText;
  mb?: ReactText;
  ml?: ReactText;
  activeOpacity?: number;
}
interface IWrapper extends IStyledWrapper {
  className?: string;
  children?: any;
  style?: any;
  key?: string | number;
  id?: string;
}

const _Wrapper = ({key, children, id, bgColor, activeOpacity, ...props}: IWrapper, ref?: Ref<View>): ReactElement => {
  return (
    <StyledWrapper id={id} key={key} ref={ref} bgColor={bgColor} {...props}>
      {children}
    </StyledWrapper>
  );
};

export default forwardRef(_Wrapper);

const StyledWrapper = styled.View<IStyledWrapper | any>`
  ${({w}) => w && 'align-items: center;'}
  ${({h}) => h && 'justify-content: center;'}
  ${({d}) => d && 'padding: 0 20px;'}
  ${({between}) => between && 'justify-content: space-between;'}
  ${({column}) => column && 'flex-direction: column;'}
  ${({row}) => row && 'flex-direction: row;'}
  ${({wrap}) => wrap && 'flexWrap: wrap;'}
  ${({center}) => center && 'text-align: center;'}
  ${({left}) => left && 'text-align: left;'}
  ${({right}) => right && 'text-align: right;'}
  ${({mobile}) => mobile && 'width:400px;'}
  ${({flexNum}) => flexNum && `flex: ${flexNum};`};
  ${({overflowX}) => (typeof overflowX === 'string' ? `overflow-x:${overflowX};` : overflowX ? 'overflow-x:scroll;&::-webkit-scrollbar {height: 5px;};' : 'overflow-y: visible;')}
  ${({overflowY}) => (typeof overflowY === 'string' ? `overflow-y:${overflowY};` : overflowY ? 'overflow-y:scroll;&::-webkit-scrollbar {width: 6px;};' : 'overflow-y: visible;')}
  ${({ellipsis}) => ellipsis && 'text-overflow: ellipsis; overflow: hidden; white-space: nowrap;'}
  ${({size}) => size && `width: ${Array.isArray(size) ? attachPixel(size[0]) : attachPixel(size)}; height: ${Array.isArray(size) ? attachPixel(size[1]) : attachPixel(size)};`}
  ${({bgColor}) => bgColor && `background-color: ${bgColor};`}
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
  ${({mt}) => mt && `margin-top: ${attachPixel(mt)};`}
  ${({mr}) => mr && `margin-right: ${attachPixel(mr)};`}
  ${({mb}) => mb && `margin-bottom: ${attachPixel(mb)};`}
  ${({ml}) => ml && `margin-left: ${attachPixel(ml)};`}
  ${({pt}) => pt && `padding-top: ${attachPixel(pt)};`}
  ${({pr}) => pr && `padding-right: ${attachPixel(pr)};`}
  ${({pb}) => pb && `padding-bottom: ${attachPixel(pb)};`}
  ${({pl}) => pl && `padding-left: ${attachPixel(pl)};`}
`;
