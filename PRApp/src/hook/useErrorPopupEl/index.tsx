import React, {useCallback, useEffect, useState} from 'react';
import theme from '../../../public/theme';
import Wrapper from '../../component/atom/Wrapper';
import Txt from '../../component/atom/Txt';
import ButtonNew from '../../component/atom/ButtonNew';
import {StackNavigationProp} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {NavigationRoute} from 'react-navigation';

const usePopup = () => {
  const [errorMessage, setErrorMessage] = useState();
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const closeConfirm = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  useEffect(() => {
    console.log('errorMessage', errorMessage);
  }, [errorMessage]);

  const handlePopupWithNavigation = (route: NavigationRoute, navigation: StackNavigationProp) => {
    setErrorMessage(route.params!.errorMessage);
    setOnConfirm(() => route?.params?.onErrorConfirm);
    navigation.setParams({errorMessage: undefined, onErrorConfirm: undefined});
  };

  const Element = () => {
    return (
      <>
        {!!errorMessage ? (
          <Wrapper width={'100%'} height={'100%'} position={'absolute'} w h>
            <Wrapper width={'100%'} height={'200%'} position={'absolute'} backgroundColor={theme.color.black} opacity={0.5} style={{top: '-100%'}} />
            <Wrapper w position={'absolute'} backgroundColor={theme.color.white} width={'80%'} padding={20} borderRadius={16}>
              <Txt size={'lg'} weight={'thick'} mb={15}>
                {'알림'}
              </Txt>
              <Txt size={'sm'} weight={'medium'} textAlign={'center'}>
                {errorMessage}
              </Txt>
              <ButtonNew
                title={'확인'}
                flex={1}
                mt={20}
                type={'primary'}
                onPress={() => {
                  closeConfirm();
                  onConfirm && onConfirm();
                }}
              />
            </Wrapper>
          </Wrapper>
        ) : null}
      </>
    );
  };

  return {errorMessage, setErrorMessage, Element, handlePopupWithNavigation};
};

export default usePopup;
