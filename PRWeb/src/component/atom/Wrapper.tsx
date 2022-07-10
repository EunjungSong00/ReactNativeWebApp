import styled from '@emotion/styled';
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
import ICommonStyle from '../../interface/ICommonStyle';
import {ReactElement, Ref, forwardRef, ReactText} from 'react';
import {attachPixel} from '../../module/formatter';

export interface IStyledWrapper extends ICommonStyle {
  w?: boolean;
  h?: boolean;
  p20?: boolean;
  column?: boolean;
  center?: boolean;
  left?: boolean;
  right?: boolean;
  mobile?: boolean;
  flex?: boolean;
  between?: boolean;
  flexNum?: number;
  overflowX?: true | string;
  overflowY?: true | string;
  ellipsis?: boolean;
  size?: ReactText[] | ReactText;
  pointer?: boolean;
}
interface IWrapper extends IStyledWrapper {
  className?: string;
  children?: any;
  onClick?: () => void;
  style?: any;
  key?: string | number;
  id?: string;
}

/*
    w = 가로중앙정렬, h = 세로중앙정렬
*/
const StyledWrapper = styled.div<IStyledWrapper>`
  ${({p20}) => p20 && 'padding: 0 20px;'}
  ${({flex}) => flex && 'display: flex;'}
  ${({w, h, column, display, between, flex}) => (w || h || column || between) && !display && !flex && 'display: flex;'}
  ${({w}) => w && 'justify-content: center;'}
  ${({between}) => between && 'justify-content: space-between;'}
  ${({h}) => h && 'align-items: center;'}
  ${({column}) => column && 'flex-direction: column;'}
  ${({center}) => center && 'text-align: center;'}
  ${({left}) => left && 'text-align: left;'}
  ${({right}) => right && 'text-align: right;'}
  ${({mobile}) => mobile && 'width:400px;'}
  ${({flexNum}) => flexNum && `flex: ${flexNum}`};
  ${({overflowX}) => (typeof overflowX === 'string' ? `overflow-x:${overflowX};` : overflowX ? 'overflow-x:scroll;&::-webkit-scrollbar {height: 5px;};' : 'overflow-y: visible;')}
  ${({overflowY}) => (typeof overflowY === 'string' ? `overflow-y:${overflowY};` : overflowY ? 'overflow-y:scroll;&::-webkit-scrollbar {width: 6px;};' : 'overflow-y: visible;')}
  ${({overflowX, overflowY}) =>
    ((typeof overflowX === 'boolean' && overflowX) || (typeof overflowY === 'boolean' && overflowY)) &&
    `&::-webkit-scrollbar-thumb {background: #d2d2d2;border-radius: 4px;}&::-webkit-scrollbar-track {background: none;}`}
  ${({ellipsis}) => ellipsis && 'text-overflow: ellipsis; overflow: hidden; white-space: nowrap;'}
  ${({size}) => size && `width: ${Array.isArray(size) ? attachPixel(size[0]) : attachPixel(size)}; height: ${Array.isArray(size) ? attachPixel(size[1]) : attachPixel(size)};`}
  ${({pointer}) => pointer && 'cursor: pointer'};
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

const _Wrapper = ({key, children, id, ...props}: IWrapper, ref?: Ref<HTMLDivElement>): ReactElement => (
  <StyledWrapper id={id} key={key} ref={ref} {...props}>
    {children}
  </StyledWrapper>
);

export default forwardRef(_Wrapper);
