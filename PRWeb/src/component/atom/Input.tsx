import {
  ChangeEventHandler,
  forwardRef,
  Dispatch,
  SetStateAction,
  ForwardedRef,
  KeyboardEventHandler,
  LegacyRef,
  RefObject,
  ChangeEvent,
  useState,
  useRef,
  useCallback
} from 'react';
import styled from '@emotion/styled';
import ICommonStyle from '../../interface/ICommonStyle';
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
import WhcbrType from 'src/type/WhcbrType';
import {attachPixel, exportThemeIntoWhcbr, getAutoBorderRadiusSize} from '../../module/formatter';
// import theme from "@public/theme";
import Wrapper from './Wrapper';
import {useEffect, ReactText} from 'react';
import Text from './Text';
import theme from '../../../public/theme';

interface IInputHook<T> {
  value: T | '';
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<SetStateAction<T>>;
}

interface IInput<T> extends ICommonStyle {
  hook: IInputHook<T>;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  message?: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  paddingRight?: string;
  style?: any;
  className?: string;
  disabled?: boolean;
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
  name?: string;
  readOnly?: boolean;
  maxLength?: number;
  onClick?: () => void;
  autoFocus?: boolean;
  open?: boolean;
  onSelect?: () => void;
  tabIndex?: number;
  autoComplete?: string;
  whcbr?: WhcbrType;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  resetable?: boolean;
  type?: string;
  innerMessage?: InnerMessageType;
  center?: boolean;
}
type InnerMessageType = {
  message?: string;
  color?: string;
  size?: ReactText;
};

const Input = (
  {
    hook,
    placeholder,
    onKeyPress,
    message,
    width,
    maxWidth,
    height,
    paddingRight,
    className,
    disabled,
    style,
    readOnly,
    onClick,
    maxLength = 40,
    autoFocus,
    open,
    onSelect,
    tabIndex,
    autoComplete,
    whcbr,
    onFocus,
    onKeyUp,
    resetable = true,
    type = 'text',
    onBlur,
    innerMessage,
    center = false,
    ...props
  }: IInput<any>,
  ref?: RefObject<HTMLInputElement> | ForwardedRef<HTMLInputElement>
) => {
  const _whcbr = exportThemeIntoWhcbr(whcbr);
  const _ref = ref || useRef(null);
  const resetValue = useCallback(() => {
    hook.setValue('');
    (_ref as RefObject<HTMLInputElement>).current!.focus();
  }, []);
  const visualizePassword = useCallback(() => {
    setIsPassword((val) => !val);
    (_ref as RefObject<HTMLInputElement>).current!.focus();
  }, []);
  const [isPassword, setIsPassword] = useState(type === 'password');
  const [isFocus, setIsFocus] = useState(false);
  const _onFocus = useCallback(() => {
    onFocus && onFocus();
    setIsFocus(true);
  }, []);

  const _onBlur = useCallback(() => {
    onBlur && onBlur();
    setIsFocus(false);
  }, []);

  useEffect(() => {
    (_ref as RefObject<HTMLInputElement>).current!.selectionStart = (_ref as RefObject<HTMLInputElement>).current!.value.length;
  }, [isPassword]);

  return (
    <InputWrapper
      isEmpty={!hook.value}
      isFocus={isFocus}
      whcbr={_whcbr}
      flex
      width={attachPixel(_whcbr[0])}
      height={attachPixel(_whcbr[1])}
      maxWidth={maxWidth}
      className={className}
      {...props}
    >
      <_Input
        whcbr={_whcbr}
        ref={_ref as LegacyRef<HTMLInputElement>}
        value={hook.value}
        onChange={hook.onChange}
        onKeyPress={onKeyPress}
        style={style}
        readOnly={readOnly}
        onClick={onClick}
        maxLength={maxLength}
        tabIndex={tabIndex}
        placeholder={placeholder}
        disabled={disabled}
        onKeyUp={onKeyUp}
        resetable={resetable}
        onFocus={_onFocus}
        onBlur={_onBlur}
        type={isPassword ? 'password' : type === 'password' ? 'text' : type}
        isPassword={type === 'password'}
        innerMessage={innerMessage}
        focused={isFocus}
        center={center}
        {...props}
      />
      <ToolWrapper flex>
        {resetable && hook.value && isFocus && <ResetButton children={<img src="/image/component/ic-iput-close.svg" />} onMouseDown={resetValue} onPointerDown={resetValue} />}
        {hook.value && type === 'password' && (
          <VisibleButton children={<img src={`/image/component/ic-eyes-${isPassword ? 'open' : 'close'}.svg`} />} onClick={visualizePassword} />
        )}
        {innerMessage?.message && <InnerMessage children={innerMessage.message} size={innerMessage.size || '14px'} color={innerMessage.color || theme.color.primary} />}
      </ToolWrapper>
    </InputWrapper>
  );
};
export default forwardRef(Input);

const isWhiteInput = (color: string): boolean => color === 'white' || color === '#fff' || color === '#ffffff' || color === 'transparent' || color === 'none';
const getAutoFontSize = (height: number): number => {
  if (height < 50) return 14;
  return 14;
};
const getAutoPadding = (height: number, options?: {focused?: boolean; resetable?: boolean; isPassword?: boolean; innerMessage?: boolean}): string => {
  let inputPaddingRight = 12;
  if (options?.focused) {
    if (options?.resetable) inputPaddingRight += 31;
    if (options?.isPassword) inputPaddingRight += 31;
  }
  if (options?.innerMessage) inputPaddingRight += 125;
  if (height < 50) return `18px ${inputPaddingRight}px 17px 20px`;
  return `18px ${inputPaddingRight}px 17px 20px`;
};

const InputWrapper = styled(Wrapper)<any>`
  position: relative;
  ${({isFocus, whcbr, isEmpty}) =>
    isFocus
      ? `border: 1px solid #0073eb; ${isWhiteInput(whcbr[2]) && `background: ${!isFocus && isEmpty ? theme.color.backgroundGray : '#f9fcff'};`}`
      : `border: ${!isFocus ? `1px solid ${theme.color.backgroundGray}` : whcbr[3]}; background: ${!isFocus && isEmpty ? theme.color.backgroundGray : whcbr[2]};`}
  border-radius: ${({whcbr}) => `${whcbr[4] || getAutoBorderRadiusSize(whcbr[1])}px`};
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

const _Input = styled('input')<any>`
  font-family: ${({fontFamily}) => fontFamily || theme.font.regular};
  font-size: ${({fontSize}) => fontSize || '17px'};
  outline: 0 none;
  height: 100%;
  width: 100%;
  background: none;
  border: none;
  cursor: ${({cursor}) => cursor || 'pointer'};
  ${({center}) => center && 'text-align: center;'};
  color: ${({color, whcbr}) => color || (isWhiteInput(whcbr[2]) ? '#444444' : 'white')};
  font-size: ${({fontSize, whcbr}) => (fontSize || typeof whcbr[1] === 'number' ? `${getAutoFontSize(whcbr[1])}px` : whcbr[1])};
  padding: ${({padding, whcbr, focused, resetable, isPassword, innerMessage}) =>
    padding || typeof whcbr[1] === 'number' ? getAutoPadding(whcbr[1], {focused, resetable, isPassword, innerMessage}) : whcbr[1]};
  &::placeholder {
    opacity: 0.4;
    font-family: ${theme.font.regular};
    color: ${theme.color.textGray};
  }

  &:disabled {
    background-color: #f9f9f9;
    color: #93989f;
    cursor: not-allowed;
  }
`;

const ToolWrapper = styled(Wrapper)`
  position: absolute;
  height: 100%;
  padding: 0 7px 0 0;
  right: 0;
  button,
  div {
    height: 100%;
    padding: 0 5px;
    border: none;
    background: none;
    &:hover {
      cursor: pointer;
    }
  }
`;

const ResetButton = styled.button``;
const VisibleButton = styled.button``;
const InnerMessage = styled(Text)`
  width: 125px;
  display: flex;
  align-items: center;
  padding: 0 8px 0 5px;
`;
