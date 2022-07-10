import Button from '../src/component/atom/Button';
import Input from '../src/component/atom/Input';
import Text from '../src/component/atom/Text';
import Wrapper from '../src/component/atom/Wrapper';
import styled from '@emotion/styled';
import {primary, whiteBlue} from '../public/theme';
import {ReactElement, useCallback, useEffect, useState} from 'react';
import useCheckBoxEl from 'src/hook/useCheckBoxEl';
import usePopupEl from 'src/hook/usePopupEl';
import useInput from '../src/hook/useInput';
import MultipleRange from '../src/component/atom/MultipleRange';
import {Pagination} from 'swiper';
import {Swiper as SwiperReact, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import ICommonStyle from '../src/interface/ICommonStyle';

const components = () => {
  const popup = usePopupEl();
  const testInputProps = useInput<string>('');
  const testPasswordProps = useInput<string>('');
  const testCertiCodeProps = useInput<string>('');
  const checkBox = useCheckBoxEl();
  const multipleRangeBoxFirst = useInput(60);
  const multipleRangeBoxSecond = useInput(120);
  const multipleRangeBalloonFirst = useInput(50);
  const multipleRangeBalloonSecond = useInput(100);
  const multipleRangeBoxFirstSwipe = useInput(20);
  const multipleRangeBoxSecondSwipe = useInput(120);

  const Pallete = useCallback(
    ({height, children, ...props}: {height?: number; children: ReactElement} & ICommonStyle) => (
      <Wrapper w h size={['100%', height || 100]} border="1px dotted grey" {...props}>
        {children}
      </Wrapper>
    ),
    []
  );

  const WrapperEx = (
    <Wrapper column size={[500, 70]} w h background="skyBlue">
      <Text weight="regular" children="Wrapper입니다." />
      <br />
      <Text weight="regular" children="<Wrapper column size={[400, 70]} w h background='skyBlue'>" />
    </Wrapper>
  );

  const ButtonEx = (
    <Wrapper>
      <Button whcbr={[100, 50, primary]} onClick={() => alert('클릭')} children="확인" />
      <Button whcbr={[100, 50, primary]} disabled onClick={() => alert('클릭')} children="비활성화" />
      <Button whcbr={[100, 50, whiteBlue]} onClick={() => alert('클릭')} children="whiteBlue" />
      <Button whcbr={[100, 50, whiteBlue]} disabled onClick={() => alert('클릭')} children="비활성화" />
    </Wrapper>
  );

  const TextEx = (
    <Wrapper>
      <Text weight="light" children="theme.font.light:  SpoqaHanSansNeo-thin." />
      <Text weight="regular" children="theme.font.regular:  SpoqaHanSansNeo-Light." />
      <Text weight="medium" children="theme.font.medium:  SpoqaHanSansNeo-Regular." />
      <Text weight="bold" children="theme.font.bold:  SpoqaHanSansNeo-Medium." />
      <Text weight="thick" children="theme.font.thick:  SpoqaHanSansNeo-Bold." />
    </Wrapper>
  );

  const CheckBoxEx = <checkBox.Element label={'모든 내용, 동의 합니다.'} />;

  const PopupEx = (
    <>
      <Button whcbr={[100, 50, whiteBlue]} onClick={() => popup.setPopup('팝업')} children="팝업" /> <popup.Element cancel ok />
    </>
  );

  const InputEx = (
    <Wrapper flex>
      <Input placeholder="아이디" hook={testInputProps} whcbr={[200, 56, whiteBlue]} mr={10} />
      <Input placeholder="비밀번호" hook={testPasswordProps} whcbr={[200, 56, whiteBlue]} type="password" mr={10} />
      <Input placeholder="인증번호" hook={testCertiCodeProps} whcbr={[250, 56, whiteBlue]} innerMessage={{message: '유효기간 : 2분58초'}} />
    </Wrapper>
  );

  const MultipleRangeEx = (
    <Wrapper width="80%">
      <MultipleRange
        mt={50}
        height={70}
        min={10}
        max={200}
        hook={[
          [multipleRangeBalloonFirst.value as number, multipleRangeBalloonSecond.value as number],
          [multipleRangeBalloonFirst.setValue, multipleRangeBalloonSecond.setValue]
        ]}
        type="balloon"
        formatter={(val) => `${val}0 km`}
        className={{track: 'swiper-no-swiping', thumb: 'swiper-no-swiping'}}
      />
      <MultipleRange
        mt={50}
        height={70}
        min={10}
        max={200}
        hook={[
          [multipleRangeBoxFirst.value as number, multipleRangeBoxSecond.value as number],
          [multipleRangeBoxFirst.setValue, multipleRangeBoxSecond.setValue]
        ]}
        type="box"
        formatter={(val) => `${val}0 km`}
        className={{track: 'swiper-no-swiping', thumb: 'swiper-no-swiping'}}
      />
    </Wrapper>
  );

  const SwipeableEx = (
    <SwiperReact
      pagination={{type: 'bullets', clickable: true}}
      onSlideChange={(e) => {}}
      initialSlide={0}
      style={{cursor: 'pointer', width: '100%', height: '100%', zIndex: 1}}
      onClick={() => {}}
      onDoubleClick={() => {}}
      modules={[Pagination]}
    >
      <SwiperSlide style={{height: '100%', background: 'red', color: 'white'}}>
        <Wrapper w h height={'100%'}>
          Red
        </Wrapper>
      </SwiperSlide>
      <SwiperSlide style={{height: '100%', background: 'white', zIndex: 2}}>
        <Wrapper w h style={{height: '100%', background: 'white', zIndex: 3}}>
          <MultipleRange
            mt={50}
            height={70}
            min={10}
            max={200}
            hook={[
              [multipleRangeBoxFirstSwipe.value as number, multipleRangeBoxSecondSwipe.value as number],
              [multipleRangeBoxFirstSwipe.setValue, multipleRangeBoxSecondSwipe.setValue]
            ]}
            type="box"
            formatter={(val) => `${val}0 km`}
            className={{track: 'swiper-no-swiping', thumb: 'swiper-no-swiping'}}
          />
        </Wrapper>
      </SwiperSlide>
      <SwiperSlide style={{height: '100%', background: 'green', color: 'white'}}>
        <Wrapper w h height={'100%'}>
          Green
        </Wrapper>
      </SwiperSlide>
      <SwiperSlide style={{height: '100%', background: 'blue', color: 'white'}}>
        <Wrapper w h height={'100%'}>
          Blue
        </Wrapper>
      </SwiperSlide>
    </SwiperReact>
  );

  useEffect(() => {
    console.log(checkBox.value);
  }, [checkBox.value]);

  return (
    <_Components padding={'30px 100px'}>
      <Pallete children={WrapperEx} />
      <Pallete children={ButtonEx} />
      <Pallete children={TextEx} />
      <Pallete children={PopupEx} />
      <Pallete children={InputEx} />
      <Pallete children={CheckBoxEx} />
      <Pallete height={300} children={MultipleRangeEx} />
      <Pallete height={300} padding={20} children={SwipeableEx} />
    </_Components>
  );
};

export default components;

const _Components = styled(Wrapper)``;
