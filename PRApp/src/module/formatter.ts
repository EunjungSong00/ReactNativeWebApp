import {ReactText, useCallback} from 'react';
import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';

export const attachPixel = (val?: ReactText): string | undefined => (val ? (typeof val === 'number' ? `${val}px` : `${val}`) : undefined);

export const getAutoBorderRadiusSize = (height: number): number => {
  if (height < 43) return 2;
  if (height < 70) return 4;
  return 4;
};

export const exportThemeIntoWhcbr = (whcbr?: any[]): any => {
  const parsedWhcbr: any = [];
  whcbr && whcbr.forEach((el) => (Array.isArray(el) ? el.forEach((theme) => parsedWhcbr.push(theme)) : parsedWhcbr.push(el)));
  return parsedWhcbr;
};

// 궁금한 query값을 url에서 알아보자.
// export const getQueryFromUrl = (fullUrl: string, query: string): string => console.info('fullUrl', fullUrl);//new URL(fullUrl).searchParams.get(query) || '';
export const getQueryFromUrl = (asPath: string, query: string): string =>
  asPath.includes('?')
    ? asPath
        ?.split('?')[1]
        ?.split('&')
        ?.filter((el: string) => el.includes(query))[0]
        ?.split('=')[1]
    : '';

export const onlyEmail = (value: string | number) => {
  return value.toString().replace(/[^0-9|a-z|A-Z|@|_|.|-]/g, '');
};

export const onlyNumber = (value: string | number) => {
  return value
    .toString()
    .replace(/[^0-9]/g, '')
    .replace(/(^0+)/, '');
};

export const onlyNumberString = (value: string | number) => {
  return value.toString().replace(/[^0-9]/g, '');
};

export const onlyKorean = (value: string | number) => {
  return value.toString().replace(/[^ㄱ-ㅎ|가-힣]/g, '');
};

export const onlyNumberKorean = (value: string | number) => {
  return value.toString().replace(/[^0-9|ㄱ-ㅎ|가-힣]/g, '');
};

export const numberComma = (value: string | number) => {
  return onlyNumber(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/* 운전면허번호 */
export const driverLicenseNumberHypen = (num: string): string => {
  let val = onlyNumberKorean(num);
  val = val.substring(0, 12);
  let tmp = '';
  const length = val.length;
  if (length < 3) {
    return val;
  }
  if (length < 5) {
    tmp += val.substr(0, 2);
    tmp += '-';
    tmp += val.substr(2);
    return tmp;
  }
  if (length < 11) {
    tmp += val.substr(0, 2);
    tmp += '-';
    tmp += val.substr(2, 2);
    tmp += '-';
    tmp += val.substr(4);
    return tmp;
  }
  tmp += val.substr(0, 2);
  tmp += '-';
  tmp += val.substr(2, 2);
  tmp += '-';
  tmp += val.substr(4, 6);
  tmp += '-';
  tmp += val.substr(10);
  return tmp;
};

/* 주민등록번호 */
export const identificationNumberHypen = (num: string): string => {
  let val = num.replace(/[^0-9*]/g, '');
  val = val.substring(0, 13);
  let tmp = '';
  const length = val.length;
  if (length < 7) {
    return val;
  }
  tmp += val.substr(0, 6);
  tmp += '-';
  tmp += val.substr(6);
  return tmp;
};

/* 주민등록번호 뒷자리 *표시 */
export const identificationNumberStar = (num: string): string => {
  let numberValue = num;
  if (num.length > 7) {
    const value = num.split('-')[1];
    numberValue = num.slice(0, 8);
    for (let i = 0; i < value?.length - 1; i++) {
      numberValue += '*';
    }
  }
  return numberValue;
};

/* 발급일자 */
export const dateNumberDot = (num: string): string => {
  let val = onlyNumber(num);
  val = val.substring(0, 8);
  let tmp = '';
  const length = val.length;
  if (length < 5) {
    return val;
  }
  if (length < 7) {
    tmp += val.substr(0, 4);
    tmp += '.';
    tmp += val.substr(4);
    return tmp;
  }
  tmp += val.substr(0, 4);
  tmp += '.';
  tmp += val.substr(4, 2);
  tmp += '.';
  tmp += val.substr(6);
  return tmp;
};

/* 뒤에 퍼센트 떼기 */
export const removePercentString = (value: string): string => {
  return value.replace('%', '');
};

/* 휴대폰 번호 표시*/
export const phoneNumberHypen = (value: string): string => {
  if (!value) {
    return '';
  }
  value = value.replace(/[^0-9]/g, '');
  let result = [];
  let restNumber = '';

  // 지역번호와 나머지 번호로 나누기
  if (value.startsWith('02')) {
    // 서울 02 지역번호
    result.push(value.substr(0, 2));
    restNumber = value.substring(2);
  } else if (value.startsWith('1')) {
    // 지역 번호가 없는 경우
    // 1xxx-yyyy
    restNumber = value;
  } else {
    // 나머지 3자리 지역번호
    // 0xx-yyyy-zzzz
    result.push(value.substr(0, 3));
    restNumber = value.substring(3);
  }

  if (restNumber.length === 7) {
    // 7자리만 남았을 때는 xxx-yyyy
    result.push(restNumber.substring(0, 3));
    result.push(restNumber.substring(3));
  } else {
    result.push(restNumber.substring(0, 4));
    result.push(restNumber.substring(4));
  }
  return result.filter((val) => val).join('-');
};

export const getPhoneNumberForm = (phoneNumber: string) => phoneNumber.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);

export const activateErrorPopup = (navigation: StackNavigationProp, errorMessage?: string, onConfirm?: () => void) => {
  console.log('activateErrorPopup: ', {errorMessage, onConfirm});
  navigation.setParams({errorMessage, onErrorConfirm: onConfirm} as never);
};
/* 날짜 */
export const formattedDate = (date: Date | undefined): string => (date ? new Date(date.setHours(9)).toISOString().substring(0, 10) : '');

/* 날짜 시간빼기 */
export const dateRemoveTime = (date: string) => {
  return date.slice(0, 10);
};

/* 남은 시간 분초로 계산 */
export const getExpTime = (value: string) => {
  const masTime = new Date(value.replace(' ', 'T')).getTime();
  const todayTime = new Date().getTime();
  const diff = masTime - todayTime;

  const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHour = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const diffMin = Math.floor((diff / (1000 * 60)) % 60);
  const diffSec = Math.floor((diff / 1000) % 60);

  return {minute: diffMin + (diffHour + diffDay * 24) * 60, second: diffSec};
};

/* 날짜를 년월일시간으로 수정 */
export const setYearMonthDayTime = (value: string) => {
  const year = value.slice(0, 4);
  const month = value.slice(5, 7);
  const day = value.slice(8, 10);
  const time = value.slice(11, 16);
  return `${year}년 ${month}월 ${day}일 ${time}`;
};

export const setPricePercent = (newCarPrice: number, salePrice: number) => {
  return Math.round(((newCarPrice - salePrice) / newCarPrice) * 100);
};

// 요일 구하기
export const getDayIndex = (monthIdx: number, dayInx: number) => {
  let day = new Date(2022, monthIdx - 1, dayInx); // 날짜 구하기
  const weekDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return weekDay[day.getDay()];
};

/**
 * 원단위 가격을 콤마처리된 만원단위로 반환하는 함수
 * @param {number} price 원단위로 내려온 가격
 * @param {boolean} excludeUnit '만원' 문자열 제외 여부
 * @returns 콤마가 추가된 만원단위의 문자열을 반환
 */
export const getPriceForm = (price: number, excludeUnit?: boolean): string => {
  try {
    return `${numberComma(Math.round(price / 10000))}${excludeUnit ? '' : ' 만원'}`;
  } catch (error) {
    console.log('error', error);
    return '-';
  }
};
