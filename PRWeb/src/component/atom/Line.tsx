import {css} from '@emotion/react';
import styled from '@emotion/styled';
import theme from '../../../public/theme';
import React, {memo} from 'react';
import {BorderProps, ColorProps, height, LayoutProps, margin, MarginProps, SpaceProps, TypographyProps, width} from 'styled-system';
type type = 'gray' | 'gray5' | 'gray35' | 'active';
interface ILine extends LayoutProps, ColorProps, MarginProps {
  type?: type;
}

const Line = ({type = 'gray', ...props}: ILine) => {
  return <LineComponent type={type} {...props} />;
};

export default memo(Line);
const LineComponent = styled.div<any>`
  width: 100%;
  height: 1px;
  ${({type}: {type: type}) => {
    switch (type) {
      case 'gray':
        return css`
          background-color: ${theme.color.lineGray};
        `;
      case 'gray5':
        return css`
          background-color: ${theme.color.lineGray5};
        `;
      case 'gray35':
        return css`
          background-color: ${theme.color.lineGray35};
        `;
      case 'active':
        return css`
          background-color: #0083ff;
        `;
    }
  }};
  ${height};
  ${margin};
`;
