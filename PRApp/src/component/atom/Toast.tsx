import React, {useState, useRef, useCallback, forwardRef, useImperativeHandle, memo} from 'react';
import {Platform, StyleSheet} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, withSequence, runOnJS} from 'react-native-reanimated';
import Text from "Text";
import styled from "@emotion/native";
import theme_new from "../../../public/theme_new";

const Toast = forwardRef((props, ref) => {
    const [message, setMessage] = useState('');
    const [top, setTop] = useState(-100);
    const toastOpacity = useSharedValue(0);
    /**
     * isShowed를 통해 애니메이션이 중복으로 실행되는 것을 방지
     */
    const isShowed = useRef(false);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: toastOpacity.value,
            top: top
        };
    }, [top]);

    /**
     * useImperativeHandler를 통해 show 함수를 외부에서 접근할 수 있도록 허용
     */
    useImperativeHandle(ref, () => ({
        show: show
    }));

    const turnOnIsShow = useCallback(() => {
        isShowed.current = false;
        setTop(-100);
    }, []);

    /**
     * show 함수가 실행되면 toastOpacity를 변경하는 animation이 실행된다.
     * 애니메이션은 opacity를 1로 만드는 애니메이션 -> opacity를 0으로 만드는 애니메이션 순으로 실행된다.
     */
    const show = useCallback((message) => {
        if(!isShowed.current) {
            setMessage(message);
            isShowed.current = true;
            setTop(Platform.OS === 'ios' ? 50 : 10);
            toastOpacity.value = withSequence(
                withTiming(1, {duration: 500}),
                withTiming(0, {duration: 2000}, () => {
                    runOnJS(turnOnIsShow)();
                })
            )
        }
    },[]);

    return (
        <Animated.View style={[styles.rootContainer, animatedStyle]}>
            <ToastTxt>{message}</ToastTxt>
        </Animated.View>
    );

});

export default memo(Toast);

const ToastTxt = styled(Text)`
  font-family: ${theme_new.fontFamily.Medium};
  font-size: ${theme_new.fontSize.sm};
  color: ${theme_new.colors.gray["0"]};
  width: 100%;
  text-align: center;
`;

const styles = StyleSheet.create({
    rootContainer : {
        position: "absolute",
        top: 100,
        backgroundColor: theme_new.colors.gray["80"],
        boxShadow: '0 4px 5px 0 rgba(0, 0, 0, 0.3);',
        paddingVertical: 15,
        paddingHorizontal: 23,
        borderRadius: 100,
        textAlign: 'center',
        width: '90%',
        zIndex: 999,
        marginLeft: '5%'
    }
})
