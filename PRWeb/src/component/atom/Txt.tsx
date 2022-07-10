import styled from '@emotion/styled';
import {
  height,
  margin,
  width,
  padding,
  color,
  TextAlignProps,
  textAlign,
  FlexProps,
  flex,
  lineHeight,
  display,
  LetterSpacingProps,
  letterSpacing,
  variant,
  fontSize,
  FontSizeProps,
  opacity,
  border
} from 'styled-system';
import ICommonStyle from '../../interface/ICommonStyle';
import {ReactElement} from 'react';

type TextType = 'light' | 'regular' | 'medium' | 'bold' | 'black';

interface IText extends ICommonStyle, TextAlignProps, FlexProps, LetterSpacingProps, FontSizeProps {
  style?: any;
  children?: any;
  onClick?: () => void;
  weight?: string;
  size?: string;
  lineHeight?: string;
  type?: TextType;
  color?: any;
  span?: boolean;
  pointer?: boolean;
  underline?: boolean;
  opacity?: number;
}

const Txt = ({children, onClick, opacity, color, span, pointer, underline, ...props}: IText): ReactElement => (
  <>
    {span ? (
      <TxtVariantSpan opacity={opacity} underline={underline} pointer={pointer} onClick={onClick} {...props} color={color}>
        {children}
      </TxtVariantSpan>
    ) : (
      <TxtVariant opacity={opacity} underline={underline} pointer={pointer} onClick={onClick} {...props} color={color}>
        {children}
      </TxtVariant>
    )}
  </>
);

export default Txt;

const StyledTxt = styled.p<any>`
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
  ${fontSize}
  ${opacity}
  ${border}
  ${({pointer}) =>
    pointer
      ? `
      cursor: pointer`
      : ''};
  ${fontSize}
  ${({underline}) =>
    underline
      ? `
      text-decoration: underline`
      : ''};
`;
const StyledTxtSpan = styled.span<any>`
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
  ${fontSize}
  ${({pointer}) =>
    pointer
      ? `
      cursor: pointer`
      : ''};
  ${fontSize}
  ${({underline}) =>
    underline
      ? `
      text-decoration: underline`
      : ''};
`;

const TxtVariant = styled(StyledTxt)(
  variant({
    prop: 'type',
    variants: {
      light: {
        fontFamily: 'SpoqaHanSansNeo-thin'
      },
      regular: {
        fontFamily: 'SpoqaHanSansNeo-Light'
      },
      medium: {
        fontFamily: 'SpoqaHanSansNeo-Regular'
      },
      bold: {
        fontFamily: 'SpoqaHanSansNeo-Medium'
      },
      black: {
        fontFamily: 'SpoqaHanSansNeo-bold'
      }
    }
  })
);
const TxtVariantSpan = styled(StyledTxtSpan)(
  variant({
    prop: 'type',
    variants: {
      light: {
        fontFamily: 'SpoqaHanSansNeo-thin'
      },
      regular: {
        fontFamily: 'SpoqaHanSansNeo-Light'
      },
      medium: {
        fontFamily: 'SpoqaHanSansNeo-Regular'
      },
      bold: {
        fontFamily: 'SpoqaHanSansNeo-Medium'
      },
      black: {
        fontFamily: 'SpoqaHanSansNeo-bold'
      }
    }
  })
);
