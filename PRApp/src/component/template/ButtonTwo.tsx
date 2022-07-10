import React, {ReactElement} from "react";
import Wrapper from "../atom/Wrapper";
import ButtonNew from "../atom/ButtonNew";

interface IButtonTwo {
    titleLeft: string;
    titleRight: string;
    onPressLeft?: () => void;
    onPressRight?: () => void;
    disabledLeft?: boolean;
    disabledRight?: boolean;
    mt?: number;
}

const ButtonTwo = ({titleLeft, titleRight, onPressLeft, onPressRight, disabledLeft, disabledRight, mt}: IButtonTwo): ReactElement => (
    <Wrapper row between mt={mt}>
        <ButtonNew title={titleLeft} flex={1} mr={10} type={'gray'} onPress={onPressLeft} disabled={disabledLeft || false} />
        <ButtonNew title={titleRight} flex={1} type={'primary'} onPress={onPressRight} disabled={disabledRight || false} />
    </Wrapper>
)
export default ButtonTwo;