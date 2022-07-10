import React from 'react';
import {
    TouchableWithoutFeedback,
    Keyboard,
    StyleProp,
    ViewStyle,
    KeyboardAvoidingView,
} from 'react-native';

const DismissKeyboardHOC = (
    Comp: typeof KeyboardAvoidingView,
): React.FC<{style?: StyleProp<ViewStyle>}> => {
    return ({children, ...props}) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Comp {...props} style={props.style}>
                {children}
            </Comp>
        </TouchableWithoutFeedback>
    );
};
const DismissKeyboardView = DismissKeyboardHOC(KeyboardAvoidingView);

export default DismissKeyboardView;
