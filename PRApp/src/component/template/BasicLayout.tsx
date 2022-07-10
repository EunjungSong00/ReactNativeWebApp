import React, {ReactElement, useCallback} from 'react';
import Layout from './Layout';
import Wrapper from '../atom/Wrapper';
import Text from '../atom/Text';
import {useNavigation, useRoute} from '@react-navigation/native';
import locales from '../../../public/locales';
import Img from '../atom/Img';
import Txt from '../atom/Txt';

interface IBasicLayout {
  title?: string;
  children: ReactElement;
  keyboardView?: boolean;
  onPress?: any;
}
const BasicLayout = ({title, children, keyboardView, onPress}: IBasicLayout): ReactElement => {
  const route = useRoute();
  const navigation = useNavigation();
  const titleText = locales[route.name]?.title;

  const clickBack = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  }, []);

  return (
    <Layout keyboardView={keyboardView}>
      <>
        <Wrapper paddingX={25} flexNum={1} backgroundColor={'#fff'}>
          <Wrapper mt={13} mb={24}>
            <Img src={require('../../../public/image/icon/ic-back-w.png')} width={20} height={18} padding onPress={clickBack} />
          </Wrapper>
          <Txt weight={'thick'} size={'xl'} mb={20}>
            {title || titleText}
          </Txt>
          {children}
        </Wrapper>
      </>
    </Layout>
  );
};

export default BasicLayout;
