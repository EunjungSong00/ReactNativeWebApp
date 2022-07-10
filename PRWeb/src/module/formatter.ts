import {ReactText} from 'react';

export const attachPixel = (val: ReactText): string => (typeof val === 'number' ? `${val}px` : `${val}`);

export const getAutoBorderRadiusSize = (height: number): number => {
  if (height < 43) return 4;
  if (height < 70) return 6;
  return 6;
};

export const exportThemeIntoWhcbr = (whcbr?: any[]): any => {
  const parsedWhcbr: any = [];
  whcbr && whcbr.forEach((el) => (Array.isArray(el) ? el.forEach((theme) => parsedWhcbr.push(theme)) : parsedWhcbr.push(el)));
  return parsedWhcbr;
};

export const getCommas = (val: string | number): string => (val ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '');
