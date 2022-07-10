import React from 'react';
import {TouchableOpacity} from "react-native";
import theme from "../../public/theme";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";

interface IReasonButton {
    title: string;
    value: string;
    reason?: string;
    onPress: any;
}

interface IReasonTitle {
    title: string;
}

export const ReasonButton = ({title, value, reason, onPress}: IReasonButton) => (
    <TouchableOpacity activeOpacity={1} onPress={() => onPress(value)}>
        <Wrapper borderColor={value === reason? theme.color.primary : theme.color.lineGray} borderWidth={1} borderRadius={4} paddingX={12} paddingY={16} mb={15}>
            <Txt size={'sm'} weight={'medium'}>{title}</Txt>
        </Wrapper>
    </TouchableOpacity>
);

export const ReasonTitle = ({title}: IReasonTitle) => (
    <Wrapper w paddingY={20} backgroundColor={theme.color.lineGray35}>
        <Txt color={'primary'} weight={'medium'}>{title}</Txt>
    </Wrapper>
)