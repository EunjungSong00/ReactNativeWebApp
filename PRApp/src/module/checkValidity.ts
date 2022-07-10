import {driverLicenseNumberHypen, identificationNumberHypen, identificationNumberStar} from 'formatter';

export const validateId = (value: string): string => {
  let bool = false;
  let result = '';
  if (value !== '') {
    bool = /^[a-z0-9]{6,10}$/.test(value) && /^(?=.*[a-z]).{6,10}$/.test(value);
    !bool ? (result = '6~10자의 영문(소문자)과 숫자만을 조합해주세요.') : '';
  }
  return result;
};

export const validateEmail = (value: string): string => {
  let bool = false;
  let result = '';
  if (value !== '') {
    bool = /^[\w+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/.test(value);
    !bool ? (result = '이메일 형식을 확인해주세요.') : '';
  }
  return result;
};

export const validatePassword = (value: string, id: string): string => {
  let passInt = 0; // 한가지 조건 충족할 때마다 +1, 2 이상이면 valid check success

  // 비밀번호 조건 체크
  const pw = value.trim();
  if (/[0-9]/g.test(pw)) passInt = passInt + 1; // 숫자 있는지
  if (/[a-z]/gi.test(pw)) passInt = passInt + 1; // 영문 있는지
  if (/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi.test(pw)) passInt = passInt + 1; // 숫자 있는지
  if (/(\w)\1\1/.test(pw)) passInt = passInt = 0; // 같은 문자 3번 이상 입력 문자 있을때
  if (pw.length < 8 || pw.length > 16) passInt = 0; // 8 ~ 16
  if (pw.includes(id)) passInt = 0; // 아이디 포함

  return pw && passInt < 2 ? 'X 영문/숫자/특수문자 2가지 이상 조합(8~16자)' : '';
};

export const validatePasswordCheck = (value: string, password: string): string => {
  let bool = false;
  let result = '';
  if (value !== '') {
    bool = value === password;
    !bool ? (result = 'X 입력하신 비밀번호가 서로 달라요.') : '';
  }
  return result;
};

export const validatePhone = (value: any): string => {
  let bool = false;
  let result = '';
  if (value) {
    bool = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/.test(`${value}`);
    !bool ? (result = '번호를 올바르게 입력하세요.') : '';
  }
  return result;
};

/* 주민등록번호 */
export const validateIdentificationNumber = (number: any) => {
  const value = number.value;
  return value.length === 14;
};

/* 운전면허증 */
export const validateDriverLicenseNumber = (number: any) => {
  const code = ['서울','부산','경기','강원','충북','충남','전북','전남','경북','경남','제주','대구','인천','광주','대전','울산','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','28']
  const value = number.value;
  return value.length === 15 && code.includes(value.slice(0,2));
};

/* 문의하기 이름 */
export const validateName = (value: string): string => {
  let bool = false;
  let result = '';
  if (value !== '') {
    bool = value.trim().length >= 2;
    !bool ? (result = '이름을 입력해주세요') : '';
  }
  return result;
};
