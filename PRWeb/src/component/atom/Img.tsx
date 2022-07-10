import styled from '@emotion/styled';
import {height, margin, width, padding, MarginProps, PaddingProps, WidthProps, HeightProps} from 'styled-system';

interface IImage extends MarginProps, PaddingProps, WidthProps, HeightProps {
    onClick?: () => void;
    src?: string;
    style?: {};
    alt?: string;
}

const _Img = ({style, alt, ...props}: IImage) => <StyledImage style={style} {...props} alt={alt} />;

export default _Img;

const StyledImage = styled.img<any>`
    ${height}
    ${width}
    ${margin}
    ${padding}
`;
