import {HorizontalSlide} from '../../src/component/atom/HorizontalSlide';
import Line from '../../src/component/atom/Line';
import Txt from '../../src/component/atom/Txt';
import Wrapper from '../../src/component/atom/Wrapper';
import SearchInput from '../../src/component/template/SearchInput';
import {FilterItem, FilterTitle, ResultSort, SearchResultItem} from '../../src/container/search-result/component';
import {Filter} from '../../src/container/search/component/filter';
import axios from 'axios';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useState} from 'react';
import useInput from 'src/hook/useInput';
import searchStore from 'src/store/searchStore';

export default function SearchResult() {
  const router = useRouter();
  // console.log(router.query);
  const inputWord = useInput<any>('');
  const [searchResult, setSearchResult] = useState<any>([]);
  const [totalResult, setTotalResult] = useState<any>();
  const {setSearchWord, removeFilter, setAutocompleteVisible, setResultSize, filter} = searchStore();
  const observerRef = React.useRef<IntersectionObserver>();
  const boxRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    observerRef.current = new IntersectionObserver(intersectionObserver); // IntersectionObserver
    boxRef.current && observerRef.current.observe(boxRef.current);
  }, [searchResult]);

  const getInfo = useCallback(async () => {
    if (totalResult > searchResult.length) {
      const bodyGrade = filter.bodyType.length ? '&bodyGrade=' + filter.bodyType.join('&bodyGrade=') : '';
      const brand = filter.brand.length ? '&brand=' + filter.brand.join('&brand=') : '';
      const option = bodyGrade + brand;
      await axios
        .get(`http://dev.search.carmerce.co.kr/search/list?q=${router.query.q || ''}&from=${searchResult.length}${option}`)
        .then((res) => {
          if (res?.data?.searchDataHits) {
            setTotalResult(res?.data?.totalHit);
            setSearchResult(searchResult.concat(...res?.data?.searchDataHits));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [searchResult.length]);

  const intersectionObserver = (entries: IntersectionObserverEntry[], io: IntersectionObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // ???????????? ?????? entry??? ????????? ???????????? ??????
        io.unobserve(entry.target); // entry ?????? ??????
        getInfo(); // ????????? ????????????
      }
    });
  };

  const [nowFilter, setNowFilter] = useState<'?????????/??????' | '??????' | '????????????' | undefined>(undefined);

  useEffect(() => {
    inputWord.setValue(router?.query?.q);
    setAutocompleteVisible(false);
  }, [router?.query?.q]);

  return (
    <>
      <Wrapper width="100%">
        <Wrapper height={71}>
          <SearchInput setSearchResult={setSearchResult} inputWord={inputWord} setTotalResult={setTotalResult} />
        </Wrapper>

        <Wrapper height="calc(100vh - 71px)" overflowY>
          <Wrapper id="top" width="100%" height={41} flex pt="5px" p20>
            <Txt fontSize="15px" lineHeight="24px" type="regular" mr={10}>
              ????????????
            </Txt>
            <Txt fontSize="15px" lineHeight="24px" type="regular">
              {totalResult || 0}???
            </Txt>
          </Wrapper>
          <Line type="gray5" />
          <Wrapper width="100%" height={54} p20 h>
            <Txt style={{whiteSpace: 'nowrap'}} fontSize="15px" color="#333333" type="medium" width="fit-content" mr="5px">
              ????????????
            </Txt>
            <HorizontalSlide p20>
              <FilterTitle title="?????????/??????" onClick={() => setNowFilter('?????????/??????')} />
              <FilterTitle title="??????" onClick={() => setNowFilter('??????')} />
              <FilterTitle title="????????????" onClick={() => setNowFilter('????????????')} />
            </HorizontalSlide>
          </Wrapper>

          <HorizontalSlide p20 mb="15px">
            {filter.bodyType.length > 0 && <FilterItem onClick={() => removeFilter('bodyType')} value={filter.bodyType.join()} />}
            {filter.brand.length > 0 && <FilterItem onClick={() => removeFilter('brand')} value={filter.brand.join()} />}
          </HorizontalSlide>
          <div style={{opacity: 0.25, height: '10px', background: '#cfd5db', margin: '0'}} />

          <Wrapper width="100%" height={16} h p20 m="16px 0px 20px 0px">
            <ResultSort
              onClick={() => {
                router.push(`/search/search-result?q=${router?.query?.q}&sortType=lowPrice`);
                setSearchWord(`${router?.query?.q}&sortType=lowPrice`);
                console.log(`${router?.query?.q}&sortType=lowPrice`);
              }}
              title="???????????????"
            />
          </Wrapper>
          <Wrapper p20 column>
            {searchResult.map(({salePrice, model, modelYear, modelDetail, manufacturer, mileage, fuelKorNm}, index: any) => {
              if (searchResult.length - 4 === index) {
                return (
                  <SearchResultItem
                    onClick={() => router.push('/search/detail')}
                    ref={boxRef}
                    key={index}
                    brand={manufacturer}
                    modelYear={modelYear}
                    modelName={modelDetail}
                    modelTrim={model}
                    mileage={mileage}
                    isLike={true}
                    fuel={fuelKorNm}
                    discountRate={0}
                    price={salePrice}
                    discountPrice={salePrice}
                  />
                );
              } else {
                return (
                  <SearchResultItem
                    onClick={() => {
                      setResultSize(searchResult.length);
                      router.push('/search/detail');
                    }}
                    key={index}
                    brand={manufacturer}
                    modelYear={modelYear}
                    modelName={modelDetail}
                    modelTrim={model}
                    mileage={mileage}
                    isLike={true}
                    fuel={fuelKorNm}
                    discountRate={0}
                    price={salePrice}
                    discountPrice={salePrice}
                  />
                );
              }
            })}
          </Wrapper>
        </Wrapper>
      </Wrapper>
      <Filter nowTab={nowFilter} setNowTab={setNowFilter} />
    </>
  );
}
