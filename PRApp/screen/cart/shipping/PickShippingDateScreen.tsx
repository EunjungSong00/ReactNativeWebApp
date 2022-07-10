import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import InstantLayout from "../../../src/component/template/InstantLayout";
import Wrapper from "../../../src/component/atom/Wrapper";
import theme from "../../../public/theme";
import Txt from "../../../src/component/atom/Txt";
import {Calendar, CalendarProps} from 'react-native-calendars';
import theme_new from "../../../public/theme_new";
import {LocaleConfig} from "react-native-calendars/src/index";
import Img from "../../../src/component/atom/Img";
import ButtonNew from "../../../src/component/atom/ButtonNew";
import useInput from "../../../src/hook/useInput";
import ScrollViewBetween from "../../../src/component/template/ScrollViewBetween";
import styled from "@emotion/native";
import usePopup from "../../../src/hook/usePopup";
import {useStores} from "../../../src/module/store";
import {observer} from "mobx-react";
import {formattedDate, getDayIndex} from "../../../src/module/formatter";
import {setStorage} from "../../../src/module/manageAsyncStorage";
import { StackNavigationProp } from 'react-navigation-stack/src/vendor/types';

LocaleConfig.locales['kr'] = {
    monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
    monthNamesShort:  ['01','02','03','04','05','06','07','08','09','10','11','12'],
    dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
    dayNamesShort: ['일', '월','화','수','목','금','토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'kr';

const timeLineData = [
    {
        id: 1,
        timeBegin: '10:00:00',
        timeDeadLine: '12:00:00'
    },
    {
        id: 2,
        timeBegin: '12:00:00',
        timeDeadLine: '14:00:00'
    },
    {
        id: 3,
        timeBegin: '14:00:00',
        timeDeadLine: '16:00:00'
    },
    {
        id: 4,
        timeBegin: '16:00:00',
        timeDeadLine: '18:00:00'
    },
];

// FIXME:  캘린더 스타일 수정, 캘린더 선택 시 날짜 전송
const PickShippingDateScreen = ({navigation}: {navigation: StackNavigationProp}) => {
    const date = new Date();
    const [selected, setSelected] = useState();
    const [month, setMonth] = useState();
    const [current, setCurrent] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const shippingDate = useInput(''); // 배송 날짜 지정
    const [show, setShow] = useState(false);
    const {Popup, setPopupText} = usePopup();
    const [isCheckedId, setIsCheckedId] = useState(-1);
    const [timeData, setTimeData]=useState();
    // FIXME: 시간대 Arr 넣기
    const {shippingStore} = useStores();

    function addDays(date, days) {
        const clone = new Date(date);
        clone.setDate(date.getDate() + days)
        return clone;
    }

    // 오늘 날짜 지정
    // FIXME: 요일 => 목요일, 금요일일때 토, 일을 disabled 처리
    useEffect(() => {
        const today = new Date(date.setHours(9));
        const minDate = addDays(today, 2).toISOString().substring(0, 10);
        setCurrent(minDate);
        const maxDateDay =  Number(current.slice(8,10)) + 1;
        const newMaxDateDay = maxDateDay < 10 ? `${0}`+ maxDateDay.toString() : maxDateDay.toString();
        const newMaxDate = current.slice(0,8) + newMaxDateDay;
        setMaxDate(newMaxDate);
    },[current, maxDate]);

    const marked = useMemo(() => {
        return {
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: theme.color.primary,
                selectedTextColor: theme.color.white
            }
        };
    }, [selected]);


    // 숫자 클릭했을 때
    const onDayPress: CalendarProps['onDayPress'] = useCallback((day) => {
        setSelected(day.dateString);
        shippingDate.setValue(day.dateString);
        setShow(true);


    },[selected, shippingDate]);

    // 캘린더 Header Style
    //FIXME: month default 오늘 기준 2일 더한 날짜 기준의 달로 바꾸기
    const CalendarHeaderStyle = useCallback((date) => {
        // const today = new Date(date.setHours(9));
        // const minDate = addDays(today, 2).toISOString().slice(0, 7);
        // const year = minDate.slice(0, 4);
        // const month = minDate.slice(5,7);
        // console.log('minDateeeeee', minDate);

        const today = new Date(date.setHours(9)).toISOString().slice(0, 7);
        const year = today.slice(0, 4);
        const month = today.slice(5,7);
        return (
            <Wrapper paddingTop={23} paddingBottom={20}>
                <Txt children={year + '. ' + month} size={'md'} weight={'thick'}/>
            </Wrapper>
        )
    },[]);

    const TimeBoxDom = useCallback(({id, isCheckedId, setTimeData, setIsCheckedId, timeBegin, timeDeadLine, disabled}) => {
        const isCheck = isCheckedId === id;
        const _timeDate = {timeBegin}
        const today = new Date();
        const hours = ('0' + today.getHours()).slice(-2);
        const selectHours = timeBegin.slice(0,2);

        return (
            <TimeWrapper
                onPress={() => {
                    isCheck ? setIsCheckedId(-1) : setIsCheckedId(id)
                    isCheck ? setTimeData(undefined) : setTimeData(_timeDate)}}
                    style={{width: '48%'}}>
                <TimeBox w h style={{borderWidth: 1, borderColor: isCheck ? theme.color.primary : theme.color.textGray}} mb={10}>
                    <Wrapper row w h >
                        <Txt children={timeBegin.slice(0,5)} weight={'medium'} size={'sm'} color={isCheck ? 'primary' : 'disabled'}/>
                        <Txt children={' ~ '} weight={'medium'} size={'sm'} color={isCheck ? 'primary' : 'disabled'}/>
                        <Txt children={timeDeadLine.slice(0,5)} weight={'medium'} size={'sm'} color={isCheck ? 'primary' : 'disabled'}/>
                    </Wrapper>
                </TimeBox>
            </TimeWrapper>
        )
    },[]);

    // onSubmitNext
    const onSubmitNext = useCallback(async (shippingDate, isCheckedId, timeData ) => {
        if (!selected) {
            setPopupText('배송일자를 선택해주세요.')
        } else if (isCheckedId === -1) {
            setPopupText('배송시간을 선택해주세요.')
        } else {
            const newShippingDate = {
                desiredDate: shippingDate.value,
                desiredTime: timeData.timeBegin
            };
            shippingStore.setShippingDate(newShippingDate);
            await setStorage('shippingDate', newShippingDate)
            navigation.navigate('PurchaseScreen');
        }
    }, [selected, shippingDate, navigation]);

    return (
        <>
            <InstantLayout title={'배송희망일시 선택'}>
                <Wrapper flexNum={1}>
                    <Wrapper bgColor={theme.color.white} flexNum={9}>
                        <ScrollViewBetween>
                        <Wrapper d>
                            <Wrapper mt={21}>
                                <Calendar
                                    // 스타일 지정
                                    style={styles.calendar}
                                    renderHeader={CalendarHeaderStyle}
                                    theme={{
                                        textDisabledColor: theme.color.lineGray,
                                        dayTextColor: theme.color.text,
                                        textDayFontFamily: theme.font.medium,
                                        textDayFontSize: 15,
                                    }}
                                    // Initially visible month. Default = now
                                    // month={}
                                    current={current} // 현재
                                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                                    minDate={current} // 최소
                                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                                    maxDate={maxDate} // 최대
                                    // Handler which gets executed on day press. Default = undefined
                                    // FIXME : 클릭했을때 날짜 marked 표시
                                    onDayPress={onDayPress}
                                    markedDates={marked}
                                    // 일, 토 disabled
                                    disabledDaysIndexes={[0,6]}
                                    disableAllTouchEventsForDisabledDays
                                    enableSwipeMonths={true}
                                    hideExtraDays
                                    renderArrow={(direction) => direction === 'left' ? (
                                        <Img src={require('../../../public/image/cart/btn-cal-before.png')} width={20} height={20} />
                                    ) : (
                                        <Img src={require('../../../public/image/cart/btn-cal-next.png')} width={20} height={20} />
                                    )} />
                            </Wrapper>
                            {show? (
                                <>
                                    <TitleTxt children={'시간 선택'} mt={30}/>
                                    <Wrapper between row mt={12} style={{flexWrap: 'wrap'}}>

                                        {timeLineData.map((item: any, key) => (
                                            <TimeBoxDom
                                                key={key}
                                                id={item.id}
                                                isCheckedId={isCheckedId}
                                                setIsCheckedId={setIsCheckedId}
                                                timeBegin={item.timeBegin}
                                                setTimeData={setTimeData}
                                                timeDeadLine={item.timeDeadLine}
                                            />
                                        ))}
                                    </Wrapper>
                                </>
                            ): null }
                        </Wrapper>
                        <Wrapper d bgColor={theme.color.white} pt={10} pb={20} >
                            <ButtonNew title={'완료'} onPress={() => onSubmitNext(shippingDate, isCheckedId, timeData)} />
                        </Wrapper>
                        </ScrollViewBetween>
                    </Wrapper>
                </Wrapper>
            </InstantLayout>
            <Popup/>
        </>
    )

};

export default observer(PickShippingDateScreen);


const styles = StyleSheet.create({
    calendar: {
        borderWidth: 1,
        borderColor: theme_new.colors.border,
        borderRadius: 10,
    },
    header: {
        backgroundColor: theme.color.backgroundGray,
    },
    headerContainer: {
        backgroundColor: theme.color.backgroundGray,
    },

});

const CarmerceCalendarTheme = {textDisabledColor:'red'}
    // 'stylesheet.day.basic': {
    //     todayText: {
    //         color: theme.color.text,
    //         fontSize: 15,
    //     },
    //     text: {
    //         fontFamily: theme.font.medium,
    //         color: theme.color.text,
    //         fontSize: 15,
    //         // SectionTitleColor: theme.color.text,
    //
    //     },
    //     textDayFontSize: 10,
    //     // textSectionTitleColor: theme.color.text,
    //     textDisabledColor: {color: 'red'},
    //          // theme.color.textGray,
    //     selected: {
    //         borderRadius: 16,
    //         paddingTop: 5,
    //         marginTop: -5,
    //     },
    //     base: {
    //         width: 32,
    //         height: 32,
    //         alignItems: 'center',
    //     },
    // },


const TimeBox = styled(Wrapper)`
  width: 100%;
  height: 45px;
  border-radius: 6px;
`;

const TitleTxt = styled(Txt)`
  font-family: ${theme.font.thick};
  font-size: ${theme.size.sm};
`;

const TimeWrapper = styled(TouchableOpacity)`
  &:disabled {
    ${({disabled}) => disabled && 'opacity: 0.3;'}
  }
`;
