import React, {forwardRef, useState, ReactText, useCallback, useEffect} from 'react';
import {TextInput} from 'react-native';
import styled, {css} from '@emotion/native';
import ICommonStyle from '../../interface/ICommonStyle';
import {margin, padding, color, minWidth, minHeight, maxWidth, maxHeight} from 'styled-system';
import {
  attachPixel,
  numberComma,
  onlyEmail,
  onlyKorean,
  onlyNumber,
  onlyNumberKorean,
  onlyNumberString
} from '../../module/formatter';
import Wrapper from './Wrapper';
import Text from './Text';
import theme from '../../../public/theme';
import {IUseInput} from 'src/hook/useInput';
import Img from './Img';

interface IInput extends ICommonStyle {
  hook: IUseInput;
  width?: ReactText;
  height?: ReactText;
  borderRadius?: ReactText;
  bgColor?: string;
  placeholder?: string;
  onChange?: any;
  onChangeText?: any;
  inputStyle?: any;
  wrapperStyle?: any;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  resetable?: boolean;
  secure?: boolean;
  innerMessage?: InnerMessageType;
  error?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  validationMessage?: string;
  autoCapitalize?: string;
  type?: string;
  returnKeyType?: 'none' | 'done' | 'search' | 'default' | 'go' | 'next' | 'send' | 'previous' | 'google' | 'join' | 'route' | 'yahoo' | 'emergency-call';
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
  clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
  multiline?: boolean;
  dataDetectorTypes?: 'phoneNumber' | 'link' | 'address' | 'calendarEvent' | 'none' | 'all' ;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  keyboardType?: 'number-pad' | 'email-address' | 'numeric';
  email?: boolean;
  number?: boolean;
  numberString?: boolean;
  korean?: boolean;
  numberKorean?: boolean;
  comma?: boolean;
  stringNumber?: boolean;
  onlyEmail?: boolean;
}
type InnerMessageType = {
  message?: string;
  color?: string;
  size?: ReactText;
};

const Input = ({maxLength = 40, resetable = true, autoCapitalize = 'none', ...props}: IInput, ref?: any) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isSecure, setIsSecure] = useState<boolean | undefined>(props.secure);

  const _onFocus = useCallback(() => {
    setIsFocus(true);
    props.onFocus;
  }, []);

  const _onBlur = useCallback(() => {
    setIsFocus(false);
    props.onBlur;
  }, []);

  const handleSecure = useCallback(() => {
    setIsSecure((val) => !val);
  }, []);

  useEffect(() => {
    props.error && props.error[1](false);
  }, [props.hook.value]);

  const _onChangeText = useCallback((value: string) => {
    if (props.publicHook) {
      const numberValue = onlyNumber(value);
      props.hook!.setValue(numberValue);
      const num = Number(numberValue);
      const myValue = num? (100 - num) + '' : '';
      props.publicHook.setValue(myValue);
    } else if (props.number) {
      props.hook!.setValue(onlyNumber(value));
    } else if (props.korean) {
      props.hook!.setValue(onlyKorean(value));
    } else if (props.numberKorean) {
      props.hook!.setValue(onlyNumberKorean(value));
    } else if (props.comma) {
      props.hook!.setValue(numberComma(value));
    } else if (props.stringNumber) {
      props.hook!.setValue(onlyNumberString(value));
    } else if (props.onlyEmail) {
      props.hook!.setValue(onlyEmail(value));
    } else {
      props.hook!.setValue(value);
    }
  }, [props.hook, props.publicHook]);

  return (
      <>
        <InputWrapper
            row
            w
            status={props?.type || (props?.error?.[0] ? 'error' : isFocus ? 'focus' : !props.hook!.value && 'empty')}
            _width={attachPixel(props.width)}
            _height={attachPixel(props.height)}
            _borderRadius={attachPixel(props.borderRadius)}
            bgColor={props.bgColor}
            style={props.wrapperStyle}
            {...props}
        >
          <_Input
              ref={props.ref}
              value={props.hook!.value}
              onChangeText={_onChangeText}
              onFocus={_onFocus}
              onBlur={_onBlur}
              placeholder={props.placeholder}
              secureTextEntry={isSecure}
              maxLength={maxLength}
              resetable={resetable}
              editable={!props.readOnly}
              autoCapitalize={autoCapitalize} //자동대문자
              isError={props?.error?.[0]}
              returnKeyType={props.returnKeyType}
              onEditingSubmot={props.onSubmitEditing}
              style={props.inputStyle}
              blurOnSubmit={props.blurOnSubmit}
              clearButtonMode={props.clearButtonMode}
              multiline={props.multiline}
              dataDetectorTypes={props.dataDetectorTypes}
              pointerEvents={props.pointerEvents}
              keyboardType={props.keyboardType}
          />
          {!!props.hook!.value && isFocus && (
              <ToolWrapper row w>
                {resetable && <DeleteButton src={require('../../../public/image/common/icon-input-delete.png')} onPress={props.hook!.resetValue} />}
                {isSecure !== undefined &&
                (isSecure ? (
                    <VisibleButton src={require('../../../public/image/common/icon-input-eye-open.png')} onPress={handleSecure} />
                ) : (
                    <VisibleButton src={require('../../../public/image/common/icon-input-eye-close.png')} onPress={handleSecure} />
                ))}
              </ToolWrapper>
          )}
          {props.innerMessage?.message && (
              <InnerMessageWrapper h>
                {props.innerMessage?.message && (
                    <InnerMessage children={props.innerMessage.message} size={props.innerMessage.size || 14} color={props.innerMessage.color || theme.color.primary} />
                )}
              </InnerMessageWrapper>
          )}
        </InputWrapper>
        {!!props.validationMessage && <Text pl={20} pt={10} color={props.validationMessage.includes('X') ? 'red' : '#0083ff'} children={props.validationMessage} />}
      </>
  );
};
export default forwardRef(Input);

const InputWrapper = styled(Wrapper)<any>`
  padding: 0 12px 0 0;
  border-radius: ${({_borderRadius}: {_borderRadius: any}) => _borderRadius || '6px'};
  width: ${({_width}: {_width: any}) => attachPixel(_width) || '100%'};
  height: ${({_height}: {_height: any}) => attachPixel(_height) || '60px'};
  ${({status, border}: {status: string; border: string}) => {
    switch (status) {
      case 'transparent':
        return css`
          background-color: transparent;
        `;
      case 'focus':
        return css`
          background-color: #f5f8fe;
          border: 1px solid #0066ff;
        `;
      case 'empty':
        return css`
          background-color: #f1f2f4;
          border: ${border || '1px solid #f1f2f4'};
        `;
      case 'error':
        return css`
          background-color: #fff4f4;
          border: ${border || '1px solid #fe2828'};
        `;
      default:
        return css`
          background-color: transparent;
          border: ${border || '1px solid #dadbdb'};
        `;
    }
  }};
  ${margin}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${padding}
`;

const _Input = styled(TextInput)<any>`
  flex: 1;
  padding: ${({padding}) => padding || '18px 20px'};
  font-family: ${({fontFamily}) => fontFamily || theme.font.regular};
  font-size: ${({fontSize}) => attachPixel(fontSize) || '17px'};
  ${({isError}: {isError: boolean}) => (isError ? 'color: #fe2828' : 'color: #000')};
  ${color}
`;

const ToolWrapper = styled(Wrapper)``;

const DeleteButton = styled(Img)`
  width: 24px;
  height: 24px;
`;
const VisibleButton = styled(Img)`
  width: 24px;
  height: 24px;
  margin-left: 10px;
`;

const InnerMessageWrapper = styled(Wrapper)`
  padding: 0 5px 0 10px;
`;
const InnerMessage = styled(Text)`
  /* width: 125px; */
  /* display: flex;
  align-items: center;
  padding: 0 8px 0 5px; */
`;
