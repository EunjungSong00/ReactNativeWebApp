import Txt from '../../../component/atom/Txt';
import Wrapper from '../../../component/atom/Wrapper';
import styled from '@emotion/styled';
import {getCommas} from '../../../module/formatter';
import React, {forwardRef, Ref, ReactElement} from 'react';

type DataType = {
  brand: string;
  modelYear: string;
  modelName: string;
  modelTrim: string;
  mileage: number;
  isLike: boolean;
  fuel: string;
  discountRate: number;
  price: number;
  discountPrice: number;
  onClick: any;
  ref?: Ref<HTMLInputElement>;
};

export const SearchResultItem = forwardRef(
  (
    {modelYear = '-', brand = '-', modelName = '-', modelTrim = '-', mileage = 0, isLike = false, fuel = '-', discountRate = 0, price = 0, discountPrice = 0, onClick}: DataType,
    ref?: Ref<HTMLInputElement>
  ) => {
    return (
      <Wrapper ref={ref} onClick={onClick} height="140px" flex mb="30px">
        <Wrapper width="140px" height="140px" bg="skyblue" mr="25px" position="relative">
          <img style={{width: '30px', height: '30px', position: 'absolute', top: '103px', left: '7px'}} src={`/image/component/icon-like-${isLike ? 'on' : 'off'}.svg`} />
        </Wrapper>
        <Wrapper column width="calc(100% - 160px)">
          <Txt fontSize="15px" type="regular" letterSpacing="-0.25px" lineHeight="19px" color="#000000">
            {modelYear + ' ' + brand + ' ' + (modelName || '')}
          </Txt>
          <Txt fontSize="13px" type="regular" mt="10px" color="#333333">
            {modelTrim}
          </Txt>
          <Wrapper mt="2px" height="16px" flex h>
            <Txt fontSize="13px" type="regular" mr="5px" color="#333333">
              {mileage && getCommas(mileage)}km
            </Txt>
            <Txt fontSize="13px" type="regular" color="#333333">
              {fuel}
            </Txt>
          </Wrapper>
          <Wrapper mt="10px" flex>
            <Txt fontSize="13px" type="regular" color="#333333" mr="3px">
              신차가
            </Txt>
            <Txt fontSize="13px" type="regular" color="#333333" style={{textDecoration: 'line-through'}}>
              {price && getCommas(price)}만원
            </Txt>
          </Wrapper>
          <Wrapper height="19px" mt="2px" h flex>
            <Txt fontSize="15px" type="regular" color="#fe2828" mr="5px">
              {discountRate}%
            </Txt>
            <Txt fontSize="16px" type="bold" mr="2px">
              {discountPrice && getCommas(discountPrice)}
            </Txt>
            <Txt fontSize="14px" type="regular">
              만원
            </Txt>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    );
  }
);
export function ResultSort({title, onClick}: {title: string; onClick: any}) {
  return (
    <Wrapper onClick={onClick} flex h>
      <Txt fontSize="13px" type="regular" letterSpacing="-0.3px" color="#444444">
        {title}
      </Txt>
      <img style={{width: '11px', height: '16px', marginLeft: '4px', marginRight: '15px'}} src={`/image/component/icon-sort-down.svg`} />
    </Wrapper>
  );
}
export function FilterTitle({title, onClick}: {title: string; onClick: any}) {
  return (
    <Txt onClick={onClick} fontSize="15px" mr={18} type="regular" color="#333333">
      {title}
    </Txt>
  );
}

export function FilterItem({value, onClick}: {value: string; onClick: any}) {
  return (
    <Wrapper onClick={onClick} width="fit-content" height="34px" borderRadius={17} p="0px 15px" bg="#ebf6fe" mr="8px" h>
      <Txt
        fontSize="14px"
        color="#007aff"
        type="regular"
        mr="7px"
        style={{display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '125px'}}
      >
        {value}
      </Txt>
      <img style={{width: '9px', height: '10px'}} src={`/image/component/icon-filter-item-delete.svg`} />
    </Wrapper>
  );
}
const Temp2 = styled(Wrapper)`
  width: fit-content;
  height: 34px;
  border-radius: 17px;
  padding: 0px 15px;
  background: #ebf6fe;
`;
