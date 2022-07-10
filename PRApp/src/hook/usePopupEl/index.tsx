import React, {Dispatch, ReactElement, SetStateAction, useState, useEffect, useRef, useCallback} from 'react';
import Wrapper from '../../component/atom/Wrapper';
import theme, {primary} from '../../../public/theme';
import Text from '../../component/atom/Text';
import styled from '@emotion/native';
import Button from '../../component/atom/Button';

type ReturnTypes = {setPopup: Dispatch<SetStateAction<UsePopupElType>>; Element: ({...props}: IUsePopupEl) => ReactElement; value: UsePopupElType};

export type UsePopupElType = ReactElement | string | undefined;
interface IUsePopupEl extends IStyleUsePopupEl {
  title?: string | 'disable';
  onPressPopupEnter?: () => void;
  disableClose?: boolean;
  loading?: boolean;
}
interface IStyleUsePopupEl {
  nonButton?: boolean;
  nonTitle?: boolean;
  enterColor?: string;
  borderColor?: string;
  titleSize?: string;
  contentAlign?: string;
  width?: string;
  height?: string;
  cancel?: string | boolean;
  ok?: string | boolean;
  popupWrapperPadding?: string;
}

const usePopupEl = (): ReturnTypes => {
  const [popup, setPopup] = useState<UsePopupElType>(undefined);

  const PopupEl = ({
    title = '알림',
    width, // 335px
    height, // 585px
    onPressPopupEnter,
    enterColor = theme.color.primary,
    cancel,
    ok,
    disableClose,
    nonTitle,
    nonButton,
    loading,
    popupWrapperPadding = '25px 20px'
  }: IUsePopupEl): ReactElement => {
    useEffect(() => {
      okRef.current && okRef.current.focus();
    }, [popup]);

    const okRef: any = useRef(null);

    const okByEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onPressPopupEnter && e.key === 'Enter' && onPressPopupEnter();
    };

    const PopupTitle = useCallback(
      () =>
        nonTitle ? (
          <></>
        ) : (
          <Wrapper w>
            <_Title color="#222">{title}</_Title>
          </Wrapper>
        ),
      []
    );

    const PopupContent = useCallback(
      () => (
        <_PopupContent w _width={width} _height={height} className="popup-content">
          {typeof popup === 'string' ? (
            popup && popup.includes('\n') ? (
              <>
                {popup.split('\n').map((item, key) => (
                  <PopupTxt key={key} size="16px" color="#222">
                    {item}
                  </PopupTxt>
                ))}
              </>
            ) : (
              <PopupTxt size="16px" color="#222">
                {popup}
              </PopupTxt>
            )
          ) : (
            popup
          )}
        </_PopupContent>
      ),
      [popup]
    );

    const PopupButton = useCallback(
      () =>
        nonButton ? (
          <></>
        ) : (
          <Wrapper>
            {cancel && (
              <BottomBtn //ref={onPressPopupEnter ? undefined : okRef}
                onPress={() => disableClose || setPopup(undefined)}
              >
                {typeof cancel === 'string' ? cancel : '취소'}
              </BottomBtn>
            )}
            {(ok || onPressPopupEnter || (!cancel && !ok && !onPressPopupEnter)) && (
              <BottomOkBtn
                loading={loading}
                // ref={okRef}
                color={enterColor}
                onPress={() => (onPressPopupEnter ? onPressPopupEnter() : setPopup(undefined))}
                onKeyPress={okByEnter}
                whcbr={['100%', 54, '#007aff']}
                fontSize={18}
                fontWeight="bold"
                style={ok && cancel && {marginLeft: '5px'}}
              >
                {typeof ok === 'string' ? ok : '확인'}
              </BottomOkBtn>
            )}
          </Wrapper>
        ),
      [okRef]
    );

    return popup ? (
      <Wrapper
        w
        h
        //position="fixed"
        style={{position: 'absolute', flex: 1, zIndex: 500, elavation: 500, top: 0, left: 0, bottom: 0, right: 0}}
      >
        <Dim activeOpacity={0.8} onPress={() => disableClose || setPopup(undefined)} />

        <_Popup popupWrapperPadding={popupWrapperPadding} _width={width} _height={height}>
          <PopupTitle />
          <PopupContent />
          <PopupButton />
        </_Popup>
      </Wrapper>
    ) : (
      <></>
    );
  };

  const PopupElement = ({...props}: IUsePopupEl) => <PopupEl {...props} />;
  return {setPopup, Element: PopupElement, value: popup};
};

export default usePopupEl;

const _Popup = styled.View<IStyleUsePopupEl | any>`
  position: absolute;
  width: 100%;
  /* height: 100%; */
  /* border: none; */
  border-radius: 16px;
  padding: ${({popupWrapperPadding}) => popupWrapperPadding};
  ${({_width}) => `max-width:${_width || '335px'};`};
  ${({_height}) => `max-height:${_height || '585px'};`};
  background: #fff;
  z-index: 600;
  /* elevation: 600; */
  /* box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2); */
  /* position: fixed; */
  overflow: hidden;
  text-align: left;
  flex-direction: column;
`;

const _PopupContent = styled(Wrapper)<any>`
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  margin-top: 18px;
`;
/* ${({type}) => type === 'text' && 'line-height: 150%;'}; */
// /* background: ${theme.color.scrollColor}; */

const BottomBtn = styled(Button)<any>`
  flex: 1;
  flex-grow: 1;
  color: ${({color}: {color: string}) => color || '#fff'};
  /* background: #ccc; */
  font-size: 18px;
  font-family: 'SpoqaHanSansNeo-Bold';
  font-weight: bold;
  height: 54px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  &:hover {
    /* background: #9b9b9b; */
  }
  &:focus {
    outline: none;
  }
`;
/* font-size: ${theme.fontSize.xs}; */

const BottomOkBtn = styled(Button)<any>`
  /* position: absolute; */
  /* bottom: 0; */
  /* flex-grow: 1; */
  color: #fff;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

const Dim = styled.TouchableOpacity`
  /* position: fixed; */
  background: #000;
  opacity: 0.8;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const _Title = styled(Text)<any>`
  font-family: ${theme.font.bold};
  font-size: 20px;
  margin: 0;
  padding: 0 10px;
  color: #333;
`;

const PopupTxt = styled(Text)<any>``;
