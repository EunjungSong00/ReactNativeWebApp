import React, {memo, ReactElement, ReactText} from 'react';
import {Text, TouchableOpacity} from "react-native";
import styled from "@emotion/native";
import theme_new from "../../../public/theme_new";
import {margin, padding, flex} from 'styled-system';
import theme from "../../../public/theme";
import Wrapper from "Wrapper";
import {attachPixel} from "../../module/formatter";

type ButtonType = 'primary' | 'line' | 'small' | 'gray' | 'darkGray' | 'lineBlack';

interface IButton {
    flex?: number;
    type?: ButtonType;
    title: string;
    size?: ReactText;
    style?: object;
    disabled?: boolean;
    round?: boolean;
    thin?: boolean;
    weight?: 'light' | 'regular' | 'medium' | 'bold' | 'thick';
    mt?: number;
    mb?: number;
    ml?: number;
    mr?: number;
    pt?: number;
    pb?: number;
    pl?: number;
    pr?: number;
    height?: ReactText;
    width?: number | string;
    onPress?: () => void;
    smallTitle?: string;
}

const ButtonNew = ({type = 'primary', title, style, size, onPress, disabled, width, height, smallTitle, round, thin, ...props} : IButton) => {
    return (
        <ButtonWrapper activeOpacity={1} type={type} onPress={onPress} round={round} disabled={disabled} width={width} _height={attachPixel(height)} style={style} {...props}>
            <Wrapper w>
                <ButtonTxt type={type} size={size} thin={thin}>
                    {title}
                </ButtonTxt>
                {smallTitle ? (
                    <SmallTxt>
                        {smallTitle}
                    </SmallTxt>
                ) : null}
            </Wrapper>
        </ButtonWrapper>
    )
};

export default memo(ButtonNew);

const ButtonWrapper = styled(TouchableOpacity)<any>`
  flex-direction: ${({smallTitle}) => smallTitle ? 'column;' : 'row;'};
  align-items: center;
  width: ${({width}) => width ? `${width}` : '100%'};
  justify-content: center;
  height: ${({_height}: {_height: any}) => attachPixel(_height) || '56px'};
  border-radius: ${({round}) => round? '100px' : '6px'};=
  ${flex}
  ${margin}
  ${padding}
  ${({type, disabled}) =>
    type === 'primary' ? (disabled ? `backgroundColor: ${theme_new.colors.primary["100"]}; opacity: 0.3;` : `backgroundColor: ${theme_new.colors.primary["100"]}`)
    : type === 'line' ? (disabled ? `backgroundColor: transparent; border: 1px solid ${theme_new.colors.primary["100"]}; opacity: 0.3;` : `backgroundColor: transparent; border: 1px solid ${theme_new.colors.primary["100"]}`)
    : type === 'small' ? (disabled ?  `backgroundColor: #transparent; border: 1px solid ${theme_new.colors.gray["40"]}; opacity: 0.3;` : `backgroundColor: #transparent; border: 1px solid ${theme_new.colors.gray["40"]};` ) 
    : type === 'gray' ? (disabled ?  `backgroundColor: ${theme.color.lightGray}; ` : `backgroundColor: ${theme.color.lightGray};` )
    : type === 'darkGray' ? (disabled ? `backgroundColor: ${theme.color.buttonGray};` : `backgroundColor: ${theme.color.buttonGray};`)
    : type === 'lineBlack' ? (disabled ? `backgroundColor: transparent; border: 1px solid ${theme.color.textBlack}; opacity: 0.3;` : `backgroundColor: transparent; border: 1px solid ${theme.color.textBlack};`)
    : null
}
`;

const ButtonTxt = styled(Text)<any>`
  font-family: ${({type}) => 
          type === 'small' ? (`${theme.font['medium']}`)
         : type === 'darkGray' ? (`${theme.font['medium']}`)
         : `${theme.font['thick']}`};
  ${({thin}) => thin? `font-family: ${theme.font.regular}` : ''};
  font-size: ${({size}) => size ? `${theme.size[size]}` : `${theme_new.fontSize.md}`};
  ${({type, disabled}) =>
    type === 'primary' ? (disabled ? `color:${theme_new.colors.gray["0"]}; opacity: 0.3;` : `color:${theme_new.colors.gray["0"]};`)
    : type === 'line' ? (disabled ? `color:${theme_new.colors.primary["100"]}; opacity: 0.3;` : `color:${theme_new.colors.primary["100"]};`)
    : type === 'small' ? (disabled ?  `color: ${theme_new.colors.gray["40"]}; opacity: 0.3;` : `color: 1px solid ${theme_new.colors.gray["40"]};` )
    : type === 'gray' ? (`color: ${theme.color.primary}`)
    : type === 'darkGray' ? (`color: ${theme.color.white}`)
    : type === 'lineBlack' ? (disabled ? `color:${theme.color.textBlack}; opacity: 0.3;` : `color:${theme.color.textBlack};`)
    : null};
`;

const SmallTxt = styled(Text)`
  font-family: ${theme.font.medium};
  font-size: ${theme.size.xs};
  color: ${theme.color.primary};
`
