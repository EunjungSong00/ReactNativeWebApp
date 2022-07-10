import {ReactElement} from 'react';
import Wrapper, {IStyledWrapper} from '../atom/Wrapper';
import {Swiper, SwiperSlide} from 'swiper/react';
import {AutoplayOptions, PaginationOptions, Swiper as SwiperType} from 'swiper/types';
import {Pagination} from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

interface ISwipeBox extends IStyledWrapper {
  children: ReactElement[];
  pagination?: boolean | PaginationOptions | undefined;
  onSlideChange?: ((swiper: SwiperType) => void) | undefined;
  initialSlide?: number;
  style?: any;
  onClick?: ((swiper: SwiperType, event: MouseEvent | TouchEvent | PointerEvent) => void) | undefined;
  onDoubleClick?: ((swiper: SwiperType, event: MouseEvent | TouchEvent | PointerEvent) => void) | undefined;
  autoplay?: boolean | AutoplayOptions | undefined;
}

const SwipeBox = ({children, pagination, onSlideChange, initialSlide, style, onClick, onDoubleClick, autoplay, ...props}: ISwipeBox) => {
  return (
    <Wrapper {...props} height="100%">
      <Swiper
        pagination={pagination}
        modules={[Pagination]}
        autoplay={autoplay}
        onSlideChange={onSlideChange}
        initialSlide={initialSlide || 0}
        style={style}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {children?.map((child: ReactElement, key: number) => (
          <SwiperSlide children={child} key={key} />
        ))}
      </Swiper>
    </Wrapper>
  );
};

export default SwipeBox;
