import {HorizontalSlide} from '../../src/component/atom/HorizontalSlide';
import Line from '../../src/component/atom/Line';
import Txt from '../../src/component/atom/Txt';
import Wrapper from '../../src/component/atom/Wrapper';
import SearchInput from '../../src/component/template/SearchInput';
import {BrandCategoryItem, RankingItem, RecentSearchWordItem, BodyCategoryItem} from '../../src/container/search/component';
import {PopularSearchkeyword, RecommendedSearchWord} from '../../src/container/search/style';
import theme from '../../public/theme';
import axios from 'axios';
import {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import {useEffect, useState} from 'react';
import useInput from 'src/hook/useInput';
import searchStore from 'src/store/searchStore';

function VisibleButton({state, setState}: {state: any; setState: any}) {
  return <img onClick={() => setState(!state)} style={{width: '15px', height: '9px'}} src={`/image/component/icon-${state ? 'up' : 'down'}.svg`} />;
}
export default function Search() {
  const cookies = parseCookies();
  const inputWord = useInput('');
  const [popularSearchKeyword, setPopularSearchKeyword] = useState(false);
  const [bodyCategoryVisible, setbodyCategoryVisible] = useState(false);
  const [brandCategoryVisible, setbrandCategoryVisible] = useState(false);
  const [popularKeyword, setPopularKeyword] = useState([]);
  const [bodyCategory, setBodyCategory] = useState([]);
  const [brandCategory, setBrandCategory] = useState([]);
  const {setFilter, recentSearchWord, removeAllRecentSearchWord, loadRecentSearchWord, addRecentSearchWord, removeRecentSearchWord, setSearchWord} = searchStore();

  /* 최근 검색어 불러오기 */
  useEffect(() => {
    const recentSearchWord = cookies?.recentSearchWord && JSON.parse(cookies.recentSearchWord);
    if (cookies?.recentSearchWord) loadRecentSearchWord(recentSearchWord);
  }, []);
  /* 인기 검색어 */
  useEffect(() => {
    axios
      .get(`http://dev.search.carmerce.co.kr/querylog/popularKeyword?size=10`)
      .then((res) => {
        console.log('popularKeyword', res.data);
        if (res?.data) {
          setPopularKeyword(res.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  /* 외형 카테고리 */
  useEffect(() => {
    axios
      .get(`http://dev.search.carmerce.co.kr/category/body?size=10`)
      .then((res) => {
        console.log('category', res?.data?.searchDataAggregation?.result);
        if (res?.data?.searchDataAggregation?.result) {
          setBodyCategory(res?.data?.searchDataAggregation?.result);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  /* 브랜드 카테고리 */
  useEffect(() => {
    axios
      .get(`http://dev.search.carmerce.co.kr/category/brand?size=10`)
      .then((res) => {
        console.log('category', res?.data?.searchDataAggregation?.result);
        if (res?.data?.searchDataAggregation?.result) {
          setBrandCategory(res?.data?.searchDataAggregation?.result);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const router = useRouter();
  return (
    <Wrapper width="100%">
      <Wrapper height={71}>
        <SearchInput inputWord={inputWord} />
      </Wrapper>

      <Wrapper height="calc(100vh - 71px)">
        <Wrapper width="100%" height={60} h p="0 20px" column>
          <Wrapper width="100%" height={60} h between>
            <Wrapper flex h>
              <PopularSearchkeyword>인기 검색어</PopularSearchkeyword>
              <Txt color={theme.color.primary} type="bold" fontSize="18px" m="0 15px">
                8
              </Txt>
              <Txt type="medium" fontSize="16px">
                아반떼
              </Txt>
              <img style={{width: '12px', height: '15px', marginLeft: '15px'}} src={`/image/component/icon-ranking-up.svg`} />
            </Wrapper>
            <VisibleButton state={popularSearchKeyword} setState={setPopularSearchKeyword} />
          </Wrapper>
          <Line type="gray35" />
        </Wrapper>
        {popularSearchKeyword && (
          <Wrapper width="100%" p="0 20px">
            {popularKeyword.map(({rank, keyword, rankGap}, index) => {
              return (
                <RankingItem
                  onClick={() => {
                    setSearchWord(keyword);
                    removeRecentSearchWord(keyword);
                    addRecentSearchWord(keyword);
                    router.push('/search/search-result');
                  }}
                  key={index}
                  rank={rank}
                  keyword={keyword}
                  rankGap={rankGap}
                />
              );
            })}
          </Wrapper>
        )}

        <Wrapper width="100%" p="0 20px" between h mt={27}>
          <Txt fontSize="16px" type="bold">
            최근 검색어
          </Txt>
          <Txt onClick={removeAllRecentSearchWord} fontSize="13px" type="regular" color="#333333">
            전체삭제
          </Txt>
        </Wrapper>
        <Wrapper width="100%" p="0 20px" h mt={17}>
          <HorizontalSlide>
            {recentSearchWord.length ? (
              recentSearchWord
                .reverse()
                .slice(0, 10)
                .map((item, index) => (
                  <RecentSearchWordItem
                    title={item}
                    key={index}
                    onClick={() => {
                      setSearchWord(item);
                      removeRecentSearchWord(item);
                      addRecentSearchWord(item);
                      inputWord.setValue(item);
                      router.push(`/search/search-result?q=${item}`);
                    }}
                    onClickDelete={() => removeRecentSearchWord(item)}
                  />
                ))
            ) : (
              <Txt type="regular" color="#333333" fontSize="16px" opacity={0.4}>
                최근 검색어가 없습니다.
              </Txt>
            )}
          </HorizontalSlide>
        </Wrapper>

        <Wrapper width="100%" p="0 20px" column mt={25}>
          <Txt fontSize="16px" type="bold" mb="12px">
            추천 검색어
          </Txt>
        </Wrapper>
        <HorizontalSlide p20>
          <RecommendedSearchWord>아반떼</RecommendedSearchWord>
          <RecommendedSearchWord>썬루프 장착 차량</RecommendedSearchWord>
          <RecommendedSearchWord>아반떼</RecommendedSearchWord>
          <RecommendedSearchWord>경차</RecommendedSearchWord>
          <RecommendedSearchWord>아반떼</RecommendedSearchWord>
        </HorizontalSlide>
        <HorizontalSlide p20 mt={10}>
          <RecommendedSearchWord>신차급</RecommendedSearchWord>
          <RecommendedSearchWord>승합/버스</RecommendedSearchWord>
          <RecommendedSearchWord>아반떼</RecommendedSearchWord>
          <RecommendedSearchWord>경차</RecommendedSearchWord>
          <RecommendedSearchWord>아반떼</RecommendedSearchWord>
        </HorizontalSlide>
        <div style={{height: '10px', background: '#cfd5db', margin: '25px 0px', width: '100%'}} />
        <Wrapper width="100%" p="0 20px">
          <Wrapper between h>
            <Txt fontSize="15px" type="bold">
              외형 카테고리
            </Txt>
            <VisibleButton state={bodyCategoryVisible} setState={setbodyCategoryVisible} />
          </Wrapper>
          <Line type="gray35" mt="10px" />
          {bodyCategoryVisible &&
            bodyCategory?.map(({key, count}, index) => (
              <BodyCategoryItem
                onClick={() => {
                  // setSearchWord('&bodyGrade=' + key);
                  // setFilter('bodyType', key);
                  // router.push(`/search/search-result?bodyGrade=${key}`);
                  setFilter('bodyType', key);
                  router.push(`/search/search-result?q=`);
                }}
                key={index}
                title={key}
                count={count}
              />
            ))}
          <Wrapper mt={35} between h>
            <Txt fontSize="15px" type="bold">
              제조사 카테고리
            </Txt>
            <VisibleButton state={brandCategoryVisible} setState={setbrandCategoryVisible} />
          </Wrapper>
          <Line type="gray35" mt="10px" />
          {brandCategoryVisible &&
            brandCategory?.map(({key, count}, index) => (
              <BrandCategoryItem
                onClick={() => {
                  // setSearchWord('&brand=' + key);
                  // router.push(`/search/search-result?brand=${key}`);
                  setFilter('brand', key);
                  router.push(`/search/search-result?q=`);
                }}
                key={index}
                brand={key}
                count={count}
              />
            ))}
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
}
