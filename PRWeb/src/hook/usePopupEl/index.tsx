import React, {Dispatch, ReactElement, SetStateAction, useState, useEffect, useRef, useCallback} from 'react';
import Wrapper from '../../component/atom/Wrapper';
import theme from '../../../public/theme';
import Text from '../../component/atom/Text';
import styled from '@emotion/styled';

type ReturnTypes = {setPopup: Dispatch<SetStateAction<UsePopupElType>>; Element: ({...props}: IUsePopupEl) => ReactElement};

export type UsePopupElType = ReactElement | string | undefined;
interface IUsePopupEl extends IStyleUsePopupEl {
  title?: string | 'disable';
  onClickPopupEnter?: () => void;
  disableClose?: boolean;
  loading?: boolean;
}
interface IStyleUsePopupEl {
  nonButton?: boolean;
  nonTitle?: boolean;
  enterColor?: string;
  borderColor?: string;
  titleSize?: string;
  titleAlign?: string;
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
    onClickPopupEnter,
    enterColor = theme.color.primary,
    cancel,
    ok,
    disableClose,
    nonTitle,
    nonButton,
    loading,
    titleAlign = 'left',
    popupWrapperPadding = '25px 20px'
  }: IUsePopupEl): ReactElement => {
    useEffect(() => {
      okRef.current && okRef.current.focus();
    }, [popup]);

    const okRef: any = useRef(null);

    const okByEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onClickPopupEnter && e.key === 'Enter' && onClickPopupEnter();
    };

    const PopupTitle = useCallback(
      ({nonTitle, titleAlign, title}: IUsePopupEl) =>
        nonTitle ? (
          <></>
        ) : (
          <_Title titleAlign={titleAlign} color="#222">
            {title}
          </_Title>
        ),
      []
    );

    const PopupContent = useCallback(
      () => (
        <_PopupContent
          //  _wdth={width} _height={height}
          className="popup-content"
        >
          {typeof popup === 'string' ? (
            popup && popup.includes('\n') ? (
              <>
                {popup.split('\n').map((item, key) => (
                  <PopupTxt key={key} type="medium" size="18px" color="#222">
                    {item}
                  </PopupTxt>
                ))}
              </>
            ) : (
              <PopupTxt type="medium" size="18px" color="#222">
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
      ({nonButton, cancel, onClickPopupEnter, disableClose, ok, loading, enterColor}: IUsePopupEl) =>
        nonButton ? (
          <></>
        ) : (
          <Wrapper flex>
            {cancel && (
              <BottomBtn ref={onClickPopupEnter ? undefined : okRef} onClick={() => disableClose || setPopup(undefined)}>
                {typeof cancel === 'string' ? cancel : '취소'}
              </BottomBtn>
            )}
            {(ok || onClickPopupEnter || (!cancel && !ok && !onClickPopupEnter)) && (
              <BottomOkBtn
                loading={loading}
                ref={okRef}
                color={enterColor}
                onClick={() => onClickPopupEnter || setPopup(undefined)}
                onKeyPress={okByEnter}
                style={ok && cancel && {marginLeft: '5px'}}
              >
                {typeof ok === 'string' ? ok : '확인'}
              </BottomOkBtn>
            )}
          </Wrapper>
        ),
      [okRef, okByEnter, setPopup]
    );

    return popup ? (
      <Wrapper w h position="fixed" style={{zIndex: 500, top: 0, left: 0, bottom: 0, right: 0}}>
        <Dim onClick={() => disableClose || setPopup(undefined)} />
        <_Popup popupWrapperPadding={popupWrapperPadding} _width={width} _height={height}>
          <PopupTitle nonTitle={nonTitle} titleAlign={titleAlign} title={title} />
          <PopupContent />
          <PopupButton nonButton={nonButton} cancel={cancel} onClickPopupEnter={onClickPopupEnter} disableClose={disableClose} ok={ok} loading={loading} enterColor={enterColor} />
        </_Popup>
      </Wrapper>
    ) : (
      <></>
    );
  };

  const PopupElement = ({...props}: IUsePopupEl) => <PopupEl {...props} />;
  return {setPopup, Element: PopupElement};
};

export default usePopupEl;

const _Popup = styled.div<IStyleUsePopupEl | any>`
  width: calc(100% - 40px);
  height: calc(100% - 226px);
  border: none;
  border-radius: 10px;
  padding: ${({popupWrapperPadding}) => popupWrapperPadding};
  ${({_width}) => `max-width:${_width || '335px'};`};
  ${({_height}) => `max-height:${_height || '585px'};`};
  background: #fff;
  z-index: 600;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  position: fixed;
  overflow: hidden;
  text-align: left;
  display: flex;
  flex-direction: column;
  & ::-webkit-scrollbar {
    width: 0px;
    background: none;
  }
  & ::-webkit-scrollbar-thumb {
    background: none;
    /* opacity: 0.4; */
  }
  &::-webkit-scrollbar-track {
    background: none;
  }
`;

const _PopupContent = styled.div<any>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: none;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  margin-top: 18px;
`;
/* ${({type}) => type === 'text' && 'line-height: 150%;'}; */
/* background: ${theme.color.scrollColor}; */

const BottomBtn = styled.button<any>`
  flex: 1;
  color: ${({color}) => color || '#fff'};
  background: #ccc;
  font-size: 18px;
  font-family: 'SpoqaHanSansNeo-Bold';
  font-weight: bold;
  height: 54px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  &:hover {
    background: #9b9b9b;
  }
  &:focus {
    outline: none;
  }
  ${({loading}) => loading && 'cursor: progress'};
`;
/* font-size: ${theme.fontSize.xs}; */

const BottomOkBtn = styled.button<any>`
  flex: 1;
  background: #0073e8;
  color: #fff;
  font-size: 18px;
  font-family: 'SpoqaHanSansNeo-Bold';
  font-weight: bold;
  height: 54px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  &:hover {
    background: #0355a8;
  }
  &:focus {
    outline: none;
  }
`;

const Dim = styled.div`
  position: fixed;
  background: #000;
  opacity: 0.8;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const _Title = styled.p<any>`
  /* font-family: 'SpoqaHanSansNeo-Bold'; */
  margin: 0;
  padding: 0 10px;
  color: #333;
  ${({titleAlign}) => `text-align: ${titleAlign};`}
`;
/* ${({_titleSize}) => `font-size: ${_titleSize || '24px'};`};
  ${({_titleAlign}) => `text-align: ${_titleAlign || 'center'};`}; */

const PopupTxt = styled(Text)<any>``;
/* ${({_contentAlign}) => `text-align: ${_contentAlign || 'left'};`}; */
