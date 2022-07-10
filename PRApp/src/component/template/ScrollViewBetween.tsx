import React, {ReactElement} from 'react';
import {ScrollView} from 'react-native';

interface IScrollViewBetween {
  children: any;
  bounces?: boolean;
}

const ScrollViewBetween = ({children, ...props}: IScrollViewBetween): ReactElement => {
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" {...props}>
      {children}
    </ScrollView>
  );
};

export default ScrollViewBetween;

ScrollViewBetween.defaultProps = {
  bounces: true
};
