import React, {ReactElement, ReactText} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styled from '@emotion/native';
import {height, margin, width, padding, TextAlignProps, textAlign, FlexProps, lineHeight, display, LetterSpacingProps, letterSpacing} from 'styled-system';
import ICommonStyle from '../../interface/ICommonStyle';
import theme from '../../../public/theme';

export interface IText extends ICommonStyle, TextAlignProps, FlexProps, LetterSpacingProps {
  style?: any;
  children?: any;
  weight?: 'light' | 'regular' | 'medium' | 'bold' | 'thick';
  size?: ReactText;
  lineHeight?: ReactText;
  en?: boolean;
  hover?: boolean;
  line?: number;
  underline?: boolean;
  lineThrough?: boolean;
  onPress?: (() => void) | undefined;
}

const Txt = ({hover = false, size = 'md', weight='regular', color = 'text', children, ...props}: IText): ReactElement => {
  const TextDom = (
      <>
        <StyledText {...props} size={size} weight={weight} color={color} children={children} underline={props.underline}
                    numberOfLines={props.line ? props.line : undefined}/>
      </>
  )

  return (
      <>
        {props.onPress ? (
            <TouchableOpacity activeOpacity={1} onPress={props.onPress}>
              {TextDom}
            </TouchableOpacity>
        ) : (
            TextDom
        )}
      </>
  );
};

export default Txt;

const StyledText = styled(Text)<any>`
  ${margin}
  ${padding}
  ${width}
  ${height}
  ${textAlign}
  ${lineHeight}
  letter-spacing: ${({letterSpacing}) => letterSpacing || '-0.5px'};
  ${display}
  font-family: ${({weight}: {weight: 'light' | 'regular' | 'medium' | 'bold' | 'thick'}) => (theme.font[weight])};
  font-size: ${({size}) => theme.size[size]};
  color: ${({color}) => theme.color[color]};
  ${({en}) => en? `letter-spacing: 0px` : ''};
  &:hover {
    font-weight: ${({hover}) => hover && '700'};
    cursor: ${({hover}) => hover && 'pointer'};
  }
  ${({underline}) => underline? `textDecorationLine: underline` : ''};
  ${({lineThrough}) => lineThrough? `text-decorationLine: line-through` : ''};
`;