import styled from '@emotion/styled';
import {height, margin, width, padding, color, TextAlignProps, textAlign, FlexProps, flex, lineHeight, display, LetterSpacingProps, letterSpacing, variant} from 'styled-system';
import ICommonStyle from '../../interface/ICommonStyle';
import {ReactElement, ReactText} from 'react';
import theme from '../../../public/theme';

interface IText extends ICommonStyle, TextAlignProps, FlexProps, LetterSpacingProps {
  style?: any;
  children?: any;
  onClick?: () => void;
  weight?: 'light' | 'regular' | 'medium' | 'bold' | 'thick';
  size?: ReactText;
  lineHeight?: string;
  en?: boolean;
  hover?: boolean;
}

const Text = ({hover = false, children, onClick, color, ...props}: IText): ReactElement => <_Text onClick={onClick} hover={hover} {...props} color={color} children={children} />;

export default Text;

const StyledText = styled('p')<any>`
  ${flex}
  ${margin}
  ${padding}
  ${color}
  ${width}
  ${height}
  ${textAlign}
  ${lineHeight}
  ${letterSpacing}
  ${display}
  letter-spacing: ${({en}) => (en ? 0 : en && '-0.45px')};
  font-family: ${({weight}: {weight: 'light' | 'regular' | 'medium' | 'bold' | 'thick'}) => (weight ? theme.font[weight] : theme.font.regular)};
  font-size: ${({size}) => size};
  &:hover {
    font-weight: ${({hover}) => hover && '700'};
    cursor: ${({hover}) => hover && 'pointer'};
  }
`;
/* font-family: ${({weight}: {weight: '1' | '2' | '3' | '4' | '5' | '6' | 'light' | 'regular' | 'medium' | 'bold'}) => (weight ? theme.font[weight] : theme.font['3'])};
  font-size: ${({size}: {size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'}) => (size && size.includes('px') ? size : '16px' && theme.fontSize[size])}; */
/* color: ${({hover}) => hover && theme.color.main}; */

const _Text = styled(StyledText)<any>``;

const Arrow = styled.span`
  display: inline-block;
  margin-left: 10px;
  width: 7px;
  height: 12px;
  background: url(/images/icon-more@2x.png) no-repeat;
  background-size: contain;
  cursor: pointer;
`;
