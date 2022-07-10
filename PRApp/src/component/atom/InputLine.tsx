import React, {useCallback, useEffect, useState} from 'react';
import {Platform, TextInput} from "react-native";
import styled from "@emotion/native";
import theme from "../../../public/theme";
import {IUseInput} from "../../hook/useInput";
import Wrapper from "Wrapper";
import Txt from "Txt";
import Select from "Select";
import {numberComma, onlyEmail, onlyKorean, onlyNumber, onlyNumberKorean, onlyNumberString} from "../../module/formatter";

interface IInputLine {
    hook: IUseInput;
    title?: string;
    placeholder?: string;
    phone?: boolean;
    readOnly?: boolean;
    maxLength?: number;
    autoFocus?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    inputStyle?: any;
    resetable?: boolean;
    secure?: boolean;
    error?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    validationMessage?: string;
    autoCapitalize?: string;
    type?: string;
    returnKeyType?: 'none' | 'done' | 'search' | 'default' | 'go' | 'next' | 'send' | 'previous' | 'google' | 'join' | 'route' | 'yahoo' | 'emergency-call';
    onSubmitEditing?: () => void;
    blurOnSubmit?: boolean;
    clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
    multiline?: boolean;
    children?: any;
    en?: boolean;
    onPressNumber?: () => void;
    selectArr?: any[];
    selectValue?: string;
    changeSelect?: any;
    keyboardType?: 'number-pad' | 'email-address' | 'numeric';
    fontFamily?: string;
    fontSize?: string;
    fontColor?: string;
    valid?: boolean | '';
    disabled?: boolean;
    publicHook?: IUseInput;
    email?: boolean;
    number?: boolean;
    numberString?: boolean;
    korean?: boolean;
    numberKorean?: boolean;
    comma?: boolean;
}

export const PaymentTitle = ({title}: any) => (
    <Txt size={'sm'} weight={'bold'}>{title}</Txt>
)


const InputLine = ({maxLength = 40, resetable = true, valid = false, autoCapitalize = 'none', title, placeholder, children, ...props}: IInputLine) => {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [isSecure, setIsSecure] = useState<boolean | undefined>(props.secure);

    useEffect(() => {
        props.error && props.error[1](false);
    }, [props.hook.value]);

    const _onFocus = useCallback(() => {
        setIsFocus(true);
        props.onFocus;
    }, []);

    const _onBlur = useCallback(() => {
        setIsFocus(false);
        props.onBlur;
    }, []);

    const _onChangeText = useCallback((value: string) => {
        if (props.publicHook) {
            const numberValue = onlyNumber(value);
            props.hook!.setValue(numberValue);
            const num = Number(numberValue);
            const myValue = num? (100 - num) + '' : '';
            props.publicHook.setValue(myValue);
        } else if (props.number) {
            props.hook!.setValue(onlyNumber(value));
        } else if (props.numberString) {
            props.hook!.setValue(onlyNumberString(value));
        } else if (props.korean) {
            props.hook!.setValue(onlyKorean(value));
        } else if (props.numberKorean) {
            props.hook!.setValue(onlyNumberKorean(value));
        } else if (props.comma) {
            props.hook!.setValue(numberComma(value));
        } else if (props.email) {
            props.hook!.setValue(onlyEmail(value));
        } else {
            props.hook!.setValue(value);
        }
    }, [props.hook, props.publicHook]);

    return (
        <>
            <Wrapper>
                {
                    !props.type && title?
                        <PaymentTitle title={title} />
                        :
                        null
                }
                <InputWrapper row between w type={props.type} platform={Platform.OS}
                              valid={valid}>
                    {
                        props.selectArr?
                            <>
                                <Select items={props.selectArr}
                                        value={props.selectValue}
                                        onValueChange={props.changeSelect} width={120} />
                            </>
                            :
                            null
                    }
                    {
                        props.type?
                            <>
                                <Txt size={'sm'} color={'primary'} weight={'bold'}>{title}</Txt>
                            </>
                            :
                            null
                    }
                    <Wrapper h flexNum={1}>
                        <InputBox value={props.hook!.value}
                                   onChangeText={_onChangeText}
                                   keyboardType={props.keyboardType}
                                   placeholder={placeholder}
                                   onFocus={_onFocus}
                                   onBlur={_onBlur}
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
                                   en={props.en}
                                  {...props}
                        />
                    </Wrapper>
                    {children}
                    {
                        props.phone?
                            <Wrapper pl={10}>
                                <Txt size={'sm'} color={props.disabled? 'primary': 'lineGray'} weight={'medium'} onPress={props.onPressNumber}>인증번호 전송</Txt>
                            </Wrapper>
                            :
                            null
                    }
                </InputWrapper>
            </Wrapper>
        </>
    )
}
export default InputLine;

const InputWrapper = styled(Wrapper)<any>`
    padding: ${({type, platform}) => type ? platform === 'ios'? `25px 0` : `10px 0` : platform === 'ios'? '15px 0' : ''};
    margin-bottom: 30px;
    border: solid ${({type}) => type? theme.color[type] : theme.color.lineGray};
    ${({valid}) => valid? `border: solid ${theme.color.red}` : ''};
    border-width: 0 0 1px 0;
`

const InputBox = styled(TextInput)<any>`
    color: ${({fontColor}) => fontColor? theme.color[fontColor] : theme.color.text};
    font-family: ${({fontFamily}) => fontFamily || theme.font.medium};
    font-size: ${({fontSize}) => fontSize? theme.size[fontSize] : '16px'};
    ${({en}) => en? `letter-spacing: 1px` : ''};
    ${({type}) => type === 'primary' ? `text-align: right` : ''};
`