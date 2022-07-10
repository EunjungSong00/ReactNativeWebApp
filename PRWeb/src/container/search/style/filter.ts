import theme from '../../../../public/theme';
import styled from '@emotion/styled';
import Wrapper from '../../../component/atom/Wrapper';

export const FilterLayoutWrapper = styled(Wrapper)`
  position: absolute;
  display: flex;
  z-index: 1;
  top: 0;
  background: #fff;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  .swiper-pagination {
    display: flex;
    top: 0;
    bottom: auto;
    position: relative;
    div {
      width: fit-content;
      height: 36px;
      margin: 0 18px 0 0 !important;
      padding: 0;
      border: none;
      background: none;
      font-family: ${theme.font.regular};
      font-size: 16px;
      cursor: pointer;
    }
    .swiper-pagination-bullet-active {
      font-family: ${theme.font.bold};
      border-bottom: 2px solid #007aff;
      border-radius: 0;
    }
  }
`;
