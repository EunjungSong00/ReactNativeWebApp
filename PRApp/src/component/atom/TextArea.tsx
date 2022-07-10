import React, {ReactElement, ReactText, useCallback, useState} from 'react';
import {TextInput} from 'react-native';
import styled from '@emotion/native';
import theme from '../../../public/theme';
import Wrapper from 'Wrapper';
import {attachPixel} from '../../module/formatter';
import {MarginProps, PaddingProps} from 'styled-system';

interface ITextArea {
  value: string;
  onChangeText: any;
  placeholder?: string;
  line?: number;
  padding?: ReactText;
  height?: string;
  readOnly?: boolean;
  border?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  fontSize?: ReactText;
  fontFamily?: string;
  style?: any;
  bgGray?: boolean;
}

const TextArea = ({
  value,
  onChangeText,
  placeholder,
  padding,
  line,
  height,
  readOnly,
  maxLength,
  border,
  fontSize,
  fontFamily,
  style,
  bgGray,
  ...props
}: ITextArea): ReactElement => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const _onFocus = useCallback(() => {
    setIsFocus(true);
    props.onFocus;
  }, []);

  const _onBlur = useCallback(() => {
    setIsFocus(false);
    props.onBlur;
  }, []);

  return (
    <Wrapper style={{overflow: 'hidden'}} borderColor={isFocus ? theme.color.primary : theme.color.lineGray} borderWidth={border ? 1 : 0} borderRadius={4}>
      <InputBox
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!readOnly}
        underlineColorAndroid="transparent"
        multiline={true}
        height={height}
        padding={padding}
        maxLength={maxLength}
        numberOfLines={line || 10}
        onFocus={_onFocus}
        onBlur={_onBlur}
        fontSize={fontSize}
        fontFamily={fontFamily}
        textAlignVertical="top"
        backgroundColor={bgGray ? (isFocus ? 'white' : '#f1f2f4') : ''}
        style={style}
        {...props}
      />
    </Wrapper>
  );
};

export default TextArea;

const InputBox = styled(TextInput)<any>`
  height: ${({height}) => height || '150px'};
  padding: ${({padding}) => padding || '20px'};
  font-family: ${({fontFamily}) => (fontFamily ? fontFamily : theme.font.medium)};
  font-size: ${({fontSize}) => (fontSize ? attachPixel(fontSize) : theme.size.sm)};
`;
