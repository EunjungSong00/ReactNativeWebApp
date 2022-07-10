import React from 'react';
import {Keyboard, Platform, StyleSheet} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import theme from "../../../public/theme";
import Wrapper from "Wrapper";
import Img from "Img";
import {PaymentTitle} from "InputLine";

interface ISelect {
    value: any;
    placeholder?: string;
    onValueChange: any;
    items: Array<any>;
    width?: number;
    title?: string;
}

const Select = ({value, placeholder, onValueChange, items, title, width, ...props}: ISelect) => {
    const BasicSelectDom = () => (
        <Wrapper width={width} paddingY={Platform.OS === 'ios'? 15 : 0}>
            <RNPickerSelect value={value}
                            useNativeAndroidPickerStyle={false}
                            onOpen={() => { // 선택창이 열릴때
                                Keyboard.dismiss(); //키보드 내림
                            }}
                            placeholder={{label: placeholder || '선택', value: null}}
                            onValueChange={(value, index) => onValueChange(value, index)}
                            items={items}
                            style={{
                                placeholder: styles.placeholder,
                                inputAndroid: styles.inputStyle,
                                inputIOS: styles.inputStyle,
                            }}
                            Icon={() => {
                                return <Img src={require('../../../public/image/component/select-arrow.png')}
                                            style={[styles.arrow, {top: Platform.OS === 'android'? 16: 0}]} />
                            }}/>
        </Wrapper>
    )

    return (
        <>
            {
                title?

                    <Wrapper mb={30} borderColor={theme.color.lineGray} borderBottomWidth={1}>
                        <PaymentTitle title={title} />
                        <BasicSelectDom />
                    </Wrapper>
                    :
                    <BasicSelectDom />
            }
        </>
    )
}

export default Select;

const styles = StyleSheet.create({
    arrow: {
        width: 12,
        height: 15,
        position: 'absolute',
        right: 15
    },
    placeholder: {
        fontFamily: theme.font.bold,
        color: theme.color.textGray,
        fontSize: 15,
    },
    inputStyle: {
        width: '100%',
        height: 'auto',
        fontFamily: theme.font.bold,
        fontSize: 15,
        color: theme.color.text,
        letterSpacing: -1
    },
})