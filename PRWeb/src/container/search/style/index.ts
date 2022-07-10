import Wrapper from '../../../component/atom/Wrapper';
import styled from '@emotion/styled';
import theme from '../../../../public/theme';

export const SearchInput = styled.input`
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

export const PopularSearchkeyword = styled.div`
  width: 80px;
  height: 27px;
  border-radius: 14px;
  background-color: #06f;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: ${theme.font.bold};
`;

export const RecommendedSearchWord = styled.div`
  border-radius: 19px;
  border: solid 1px rgba(64, 170, 254, 0.6);
  background-color: rgba(64, 170, 254, 0.04);
  /* margin: 0 6px 10px 0;
  padding: 8px 13px 7px; */
  color: #40aafe;
  font-size: 15px;
  font-family: ${theme.font.regular};
  height: 34px;
  padding: 0 13px;
  width: fit-content;
  display: flex;
  align-items: center;
  margin-right: 6px;
`;
