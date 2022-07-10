import React, {useCallback, useState} from 'react';
import theme from '../../public/theme';
import ButtonTwo from '../component/template/ButtonTwo';
import Wrapper from '../component/atom/Wrapper';
import Txt from '../component/atom/Txt';
import ButtonNew from '../component/atom/ButtonNew';

interface ISetPopupContents {
  title?: string;
  text?: string;
  two?: boolean;
  cancel?: string;
  confirm?: string;
  clickConfirm?: () => void;
  clickCancel?: () => void;
}

const usePopup = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [value, setValue] = useState<ISetPopupContents>({});

  const popupToggle = useCallback(() => {
    setPopupVisible(!popupVisible);
  }, [popupVisible]);

  const setPopupContents = useCallback(
    ({title, text, two, cancel, confirm, clickCancel, clickConfirm}: ISetPopupContents) => {
      setValue({title, text, two, cancel, confirm, clickCancel, clickConfirm});
      popupToggle();
    },
    [popupVisible]
  );

  const setPopupText = useCallback(
    (text: string) => {
      setValue({text});
      popupToggle();
    },
    [popupVisible]
  );

  const closeCancel = useCallback(() => {
    value?.clickCancel ? value?.clickCancel() : null;
    popupToggle();
  }, [value, popupVisible]);

  const closeConfirm = useCallback(() => {
    value?.clickConfirm ? value?.clickConfirm() : null;
    popupToggle();
  }, [value, popupVisible]);

  const Popup = () => (
    <>
      {popupVisible ? (
        <Wrapper width={'100%'} height={'100%'} position={'absolute'} w h>
          <Wrapper width={'100%'} height={'200%'} position={'absolute'} backgroundColor={theme.color.black} opacity={0.5} style={{top: '-100%'}} />
          <Wrapper w position={'absolute'} backgroundColor={theme.color.white} width={'80%'} padding={20} borderRadius={16}>
            <Txt size={'lg'} weight={'thick'} mb={15}>
              {value?.title || '알림'}
            </Txt>
            <Txt size={'sm'} weight={'medium'} textAlign={'center'}>
              {value?.text}
            </Txt>
            {value?.two ? (
              <ButtonTwo mt={30} titleLeft={value?.cancel || '취소'} titleRight={value?.confirm || '확인'} onPressLeft={closeCancel} onPressRight={closeConfirm} />
            ) : (
              <ButtonNew title={value?.confirm || '확인'} flex={1} mt={20} type={'primary'} onPress={closeConfirm} />
            )}
          </Wrapper>
        </Wrapper>
      ) : null}
    </>
  );

  return {setPopupContents, setPopupText, Popup};
};

export default usePopup;
