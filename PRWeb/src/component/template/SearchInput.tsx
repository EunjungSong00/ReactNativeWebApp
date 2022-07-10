import Line from '../atom/Line';
import Txt from '../atom/Txt';
import Wrapper from '../atom/Wrapper';
import styled from '@emotion/styled';
import theme from '../../../public/theme';
import axios from 'axios';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import nookies, {parseCookies} from 'nookies';
import searchStore from 'src/store/searchStore';

const ColoredItem = ({item, query}: {item: string; query: string}) => {
  return item.includes(query) ? (
    <Txt type="regular" fontSize="15px">
      {item.split(query)[0]}
      <Txt span style={{color: '#0083ff'}}>
        {query}
      </Txt>
      {item.split(query)[1]}
    </Txt>
  ) : (
    <Txt type="regular" fontSize="15px">
      {item}
    </Txt>
  );
};

const SearchInput = ({inputWord, setTotalResult, setSearchResult}: {inputWord?: any; setTotalResult?: any; setSearchResult?: any}) => {
  const {searchWord, setSearchWord} = searchStore();
  const router = useRouter();
  const cookies = parseCookies();
  const [autocompleteResult, setAutocompleteResult] = useState([]);
  const [searchAutocomplete, setSearchAutocomplete] = useState(cookies?.carmerceSearchAutocomplete);
  const {filter, recentSearchWord, addRecentSearchWord, removeRecentSearchWord, autocompleteVisible, setAutocompleteVisible, resultSize, setResultSize} = searchStore();

  /* 자동완성 */
  useEffect(() => {
    if (inputWord?.value) {
      setAutocompleteVisible(inputWord.value !== router.query.q);

      axios
        .get(`http://dev.search.carmerce.co.kr/autocomplete/search?q=${inputWord.value}`)
        .then((res) => {
          if (res.data.results) {
            setAutocompleteResult(res.data.results);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setAutocompleteVisible(false);
      setAutocompleteResult([]);
    }
  }, [inputWord?.value]);
  /* 검색 */
  useEffect(() => {
    setAutocompleteVisible(false);
    // if (searchWord === router.query.q) {
    console.log('getSearchList model', searchWord);
    // console.log(searchWord === router.query.q);
    // console.log('searchWord', searchWord, 'router.query.q', router.query.q);

    const bodyGrade = filter.bodyType.length ? '&bodyGrade=' + filter.bodyType.join('&bodyGrade=') : '';
    const brand = filter.brand.length ? '&brand=' + filter.brand.join('&brand=') : '';
    const option = bodyGrade + brand;
    axios
      .get(`http://dev.search.carmerce.co.kr/search/list?q=${searchWord || router?.query?.q}${resultSize ? `&size=${resultSize}` : ''}${option}`)
      .then((res) => {
        if (res?.data?.searchDataHits) {
          console.log(searchWord || router?.query?.q);
          console.log('searchDataHits', res?.data?.searchDataHits);
          console.log('totalHit', res?.data?.totalHit);
          setTotalResult(res?.data?.totalHit);
          setSearchResult(res.data.searchDataHits);
          setResultSize(0);
        } else {
          setSearchResult([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // }
  }, [searchWord, filter]);
  /* 최근 검색어 */
  useEffect(() => {
    if (recentSearchWord) {
      nookies.set(null, 'recentSearchWord', JSON.stringify(recentSearchWord), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      });
    }
  }, [recentSearchWord]);
  const onSearchAutocomplete = () => {
    // console.log('carmerceSearchAutocomplete', cookies?.carmerceSearchAutocomplete);
    setSearchAutocomplete(searchAutocomplete === 'off' ? 'on' : 'off');
    nookies.set(null, 'carmerceSearchAutocomplete', searchAutocomplete === 'off' ? 'on' : 'off', {
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    });
  };

  const onSearch = (word: string) => {
    console.log('onSearch -->', word);
    setSearchWord(word || '');
    removeRecentSearchWord(word);
    if (word.length) {
      addRecentSearchWord(word);
    }
    setAutocompleteVisible(false);
    router.push(`/search/search-result?q=${word}`).then(() => document.getElementById('top')?.scrollIntoView(true));
  };
  const searchEnter = (e: any) => {
    if (e.key === 'Enter') {
      console.log('enter');
      onSearch(e.target.value);
    }
  };
  return (
    <div>
      <Wrapper width="100%" height={60} h p="0 20px" between>
        <img style={{width: '20px', height: '26px'}} src={`/image/component/icon-search-back.svg`} />
        <SearchInputComponent maxLength={40} placeholder="구매하시고 싶은 차량을 설명해주세요." value={inputWord.value} onKeyPress={searchEnter} onChange={inputWord.onChange} />
        {inputWord.value && <img onClick={() => inputWord.setValue('')} style={{width: '24px', height: '24px', marginRight: '14px'}} src={`/image/component/ic-iput-close.svg`} />}
        <img onClick={() => onSearch(inputWord.value)} style={{width: '23px', height: '23px'}} src={`/image/component/icon-search.svg`} />
      </Wrapper>
      <Line type={inputWord.value ? 'active' : 'gray'} mb={10} />
      {autocompleteVisible && autocompleteResult.length > 0 && (
        <div style={{zIndex: 10, marginTop: '-10px', borderRadius: '4px', position: 'absolute', background: 'white', width: '100%'}}>
          {searchAutocomplete !== 'off' &&
            autocompleteResult &&
            autocompleteResult.map(({brandKorNm, genDetailKorNm}, index) => (
              <React.Fragment key={index}>
                <Wrapper p20 h height="50px" borderBottom="1px solid #cfd5db" bg="white" between onClick={() => onSearch(brandKorNm + ' ' + genDetailKorNm)}>
                  <ColoredItem item={brandKorNm + ' ' + genDetailKorNm} query={inputWord.value} />
                  <img style={{width: '25px', height: '24px'}} src={`/image/component/icon-auto-completion.svg`} />
                </Wrapper>
              </React.Fragment>
            ))}
          <Wrapper h borderTop="1px soild #cfd5db" borderBottom="1px solid #cfd5db" height="34px" p="0 20px" backgroundColor="rgba(207, 213, 219, 0.1)" between>
            <Txt onClick={() => onSearchAutocomplete()} type="regular" fontSize="13px" color="#333333">
              자동완성 {searchAutocomplete === 'off' ? '켜기' : '끄기'}
            </Txt>
            <Txt type="regular" fontSize="13px" color="#333333">
              닫기
            </Txt>
          </Wrapper>
        </div>
      )}
    </div>
  );
};
export default SearchInput;

const SearchInputComponent = styled.input`
  width: 100%;
  height: 26px;
  margin: 0 10px;
  border: none;
  outline: none;
  font-size: 17px;
  font-family: ${theme.font.regular};
  &::placeholder {
    color: rgba(34, 34, 34, 0.3);
  }
`;
