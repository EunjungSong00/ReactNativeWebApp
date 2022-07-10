import React from 'react';
import {Text} from 'react-native';
import styled from '@emotion/native';
import {height, margin, width, padding, color, TextAlignProps, textAlign, FlexProps, flex, lineHeight, display, LetterSpacingProps, letterSpacing} from 'styled-system';
import ICommonStyle from '../../interface/ICommonStyle';
import {ReactElement, ReactText} from 'react';
import theme from '../../../public/theme';
import {attachPixel} from '../../module/formatter';

interface IText extends ICommonStyle, TextAlignProps, FlexProps, LetterSpacingProps {
  style?: any;
  children?: any;
  onClick?: () => void;
  weight?: 'light' | 'regular' | 'medium' | 'bold' | 'thick';
  size?: ReactText;
  lineHeight?: ReactText;
  en?: boolean;
  hover?: boolean;
  numberOfLines?: number;
  lineThrough?: boolean;
}

const _Text = ({hover = false, size = '15px', lineThrough, children, onClick, color, numberOfLines, ...props}: IText): ReactElement => (
  <StyledText
    onClick={onClick}
    lineThrough={lineThrough}
    hover={hover}
    color={color}
    children={children}
    size={size}
    numberOfLines={numberOfLines ? numberOfLines : undefined}
    {...props}
  />
);

export default _Text;

const StyledText = styled(Text)<any>`
  ${margin}
  ${padding}
  ${color}
  ${width}
  ${height}
  ${textAlign}
  ${lineHeight}
  ${letterSpacing}
  ${display}
  font-family: ${({weight}: {weight: 'light' | 'regular' | 'medium' | 'bold' | 'thick'}) => (weight ? theme.font[weight] : theme.font.regular)};
  font-size: ${({size}) => attachPixel(size)};
  ${({lineThrough}) => (lineThrough ? `text-decorationLine: line-through` : '')};
  ${({mt}) => mt && `margin-top: ${attachPixel(mt)};`}
  ${({mr}) => mr && `margin-right: ${attachPixel(mr)};`}
  ${({mb}) => mb && `margin-bottom: ${attachPixel(mb)};`}
  ${({ml}) => ml && `margin-left: ${attachPixel(ml)};`}
  ${({pt}) => pt && `padding-top: ${attachPixel(pt)};`}
  ${({pr}) => pr && `padding-right: ${attachPixel(pr)};`}
  ${({pb}) => pb && `padding-bottom: ${attachPixel(pb)};`}
  ${({pl}) => pl && `padding-left: ${attachPixel(pl)};`}
`;
/* letter-spacing: ${({en}) => (en ? 0 : en && '-0.45px')}; */
// font-size: ${({size}: {size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'}) => (size && size.includes('px') ? size : '16px' && theme.fontSize[size])}; */
/* color: ${({hover}) => hover && theme.color.main}; */
