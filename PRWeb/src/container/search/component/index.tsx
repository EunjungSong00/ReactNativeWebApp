import Line from '../../../component/atom/Line';
import Txt from '../../../component/atom/Txt';
import Wrapper from '../../../component/atom/Wrapper';
import theme from '../../../../public/theme';
import React from 'react';

export function RankingItem({rank, keyword, rankGap, onClick}: {rank: number; keyword: string; rankGap?: string; onClick: any}) {
  return (
    <>
      <Wrapper width="100%" height="45px" between h onClick={onClick}>
        <Wrapper flex>
          <Txt color={theme.color.primary} type="bold" fontSize="18px" mr="25px">
            {rank}
          </Txt>
          <Txt type="medium" fontSize="16px">
            {keyword}
          </Txt>
        </Wrapper>
        {/* {rankGap?.includes('+') ? (
          <img style={{width: '12px', height: '15px', marginLeft: '15px'}} src={`/image/component/icon-ranking-up.svg`} />
        ) : rankGap?.includes('-') ? (
          <img style={{width: '12px', height: '15px', marginLeft: '15px'}} src={`/image/component/icon-ranking-down.svg`} />
        ) : (
          <></>
        )} */}
      </Wrapper>
      <Line type="gray35" />
    </>
  );
}

export function RecentSearchWordItem({title, onClick, onClickDelete}: {title: string; onClick?: any; onClickDelete?: any}) {
  return (
    <Wrapper flex h mr="15px">
      <Txt
        onClick={onClick}
        span
        fontSize="15px"
        type="regular"
        mr="4px"
        style={{display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '82px'}}
      >
        {title}
      </Txt>
      <img onClick={onClickDelete} style={{width: '10px', height: '10px'}} src={`/image/component/icon-delete-searchword.svg`} />
    </Wrapper>
  );
}
/* 외형 카테고리 */
export function BodyCategoryItem({title, count, onClick}: {title: string; count: number; onClick: any}) {
  return (
    <>
      <Wrapper onClick={onClick} between h height="45px">
        <Txt type="regular" fontSize="15px">
          {title}
        </Txt>
        <Txt type="regular" fontSize="15px">
          {count}
        </Txt>
      </Wrapper>
      <Line type="gray35" />
    </>
  );
}
export function BrandCategoryItem({brand, count, onClick}: {brand: string; count: number; onClick: any}) {
  return (
    <>
      <Wrapper onClick={onClick} between h height="60px">
        <Wrapper flex width="50%" h>
          <img style={{width: '38px', height: '38px'}} src={`/image/component/icon-car-logo.svg`} />
          <Txt ml="20px">{brand}</Txt>
        </Wrapper>
        <Txt type="regular">{count}</Txt>
      </Wrapper>
      <Line type="gray35" />
    </>
  );
}
