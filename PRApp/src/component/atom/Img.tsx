import React, {memo} from 'react';
import {GestureResponderEvent, StyleProp, TouchableOpacity} from 'react-native';
import FastImage, {ImageStyle, ResizeMode, Source} from 'react-native-fast-image';

interface IImage {
  src?: Source;
  url?: string;
  width?: number;
  height?: number;
  padding?: boolean;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

const Img = ({src, url, style, width=100, height=100, padding, resizeMode, onPress}: IImage) => {
  const source = src || {uri: url};
  const ImageDom = <FastImage source={source} style={[{width: width, height: height}, style]} resizeMode={resizeMode || FastImage.resizeMode.contain} />;
  return (
    <>
      {onPress ? (
        <TouchableOpacity activeOpacity={1} onPress={onPress} style={{padding: padding ? 5 : 0}}>
          {ImageDom}
        </TouchableOpacity>
      ) : (
        ImageDom
      )}
    </>
  );
};

export default memo(Img);
