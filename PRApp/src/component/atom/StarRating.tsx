import {TouchableOpacity} from 'react-native';
import {Dispatch, SetStateAction} from 'react';
import Img from './Img';
import Wrapper from './Wrapper';
import React from 'react';
interface IStar {
  score: number;
  setScore?: Dispatch<SetStateAction<number>>;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}
const StarRating = ({score, setScore, readOnly, size, ...style}: IStar) => {
  function Star({count}: {count: number}) {
    return (
      <TouchableOpacity {...style} activeOpacity={1} onPress={() => (readOnly ? null : setScore && setScore(count))}>
        <Img
          style={{
            width: size === 'small' ? 12 : size === 'medium' ? 22 : 30,
            height: size === 'small' ? 11 : size === 'medium' ? 20 : 28,
            marginRight: size === 'small' ? 1 : size === 'medium' ? 2 : 6
          }}
          src={score > count - 1 ? require('../../../public/image/component/icon-star-on.png') : require('../../../public/image/component/icon-star-off.png')}
        />
      </TouchableOpacity>
    );
  }

  return (
    <Wrapper flexDirection="row">
      <Star count={1} />
      <Star count={2} />
      <Star count={3} />
      <Star count={4} />
      <Star count={5} />
    </Wrapper>
  );
};

export default StarRating;
