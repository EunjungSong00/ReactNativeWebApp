import styled from '@emotion/styled';
import Wrapper from './Wrapper';

export const HorizontalSlide = styled(Wrapper)`
  overflow-x: auto;
  display: flex;
  white-space: nowrap;
  width: 100%;
  * {
    -ms-overflow-style: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`;
