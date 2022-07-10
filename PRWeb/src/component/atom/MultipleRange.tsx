import ICommonStyle from '../../interface/ICommonStyle';
import {StringValueNode} from 'graphql';
import React, {Dispatch, SetStateAction, ReactElement, useRef, useCallback} from 'react';
import {Range, getTrackBackground} from 'react-range';
import Text from './Text';
import Wrapper from './Wrapper';

type HookType = [number[], [Dispatch<SetStateAction<number>>, Dispatch<SetStateAction<number>>]];

interface IMultipleRange extends ICommonStyle {
  hook: HookType;
  step?: number;
  min?: number;
  max?: number;
  plus?: boolean; // 최대값일 경우 두번째Box우측에 + 활성화
  formatter?: (val: number) => string;
  type?: 'balloon' | 'box';
  className?: {
    rangeWrapper?: string;
    track?: string;
    thumb?: string;
  };
}

const MultipleRange = ({hook, step = 1, min = 0, max = 100, formatter, type = 'balloon', className, ...props}: IMultipleRange): ReactElement => {
  const balloonRef = useRef<HTMLDivElement>(null);

  const Balloon = useCallback(() => {
    const averageParcentage = ((hook[0][0] + hook[0][1] - 2 * min) / 2) * (1 / (max - min)) * 100;

    return (
      <Wrapper background={'transparent'} size={['100%', 30]}>
        <Wrapper
          background={'#06f'}
          ref={balloonRef}
          size={['fit-content', 25]}
          style={{position: 'relative', left: `${averageParcentage}%`, borderRadius: '4px'}}
          ml={`-${(balloonRef?.current?.offsetWidth || 0) / 2}px`}
          w
        >
          <Wrapper w h padding={'5px 10px'} style={{zIndex: 2}} color="#fff">
            <Text size={'10px'} weight={'bold'}>
              {formatter ? formatter(hook[0][0]) : hook[0][0]} ~ {formatter ? formatter(hook[0][1]) : hook[0][1]}
            </Text>
          </Wrapper>
          <Wrapper position="absolute" mt={9} size={20} background={'#06f'} style={{transform: 'rotate(45deg)', zIndex: 1}} />
        </Wrapper>
      </Wrapper>
    );
  }, [hook]);

  const Boxes = useCallback(() => {
    const Box = useCallback(
      ({plus, val}: {plus?: boolean; val: number}) => (
        <Wrapper h>
          <Wrapper w h size={[plus && max === val ? 132 : 152, 48]} border={`1px solid rgba(51, 51, 51, 0.15)`} borderRadius={'4px'}>
            <Text color="#06f" size={'15px'}>
              {formatter ? formatter(val) : val}
            </Text>
          </Wrapper>
          {plus && max === val && <Text ml="12px">+</Text>}
        </Wrapper>
      ),
      [max]
    );

    return (
      <Wrapper w h width="325px" background={'transparent'} size={['100%', 30]} mb={20}>
        <Box val={hook[0][0]} />
        <Text marginX={10} weight="bold">
          ~
        </Text>
        <Box val={hook[0][1]} plus={props.plus} />
      </Wrapper>
    );
  }, [hook]);

  return (
    <Wrapper h column className={className?.rangeWrapper} {...props}>
      {type === 'balloon' ? <Balloon /> : <Boxes />}
      <Range
        values={hook[0]}
        step={step}
        min={min}
        max={max}
        onChange={(value: number[]) => {
          console.log(value);
          hook[1][0](value[0]);
          hook[1][1](value[1]);
        }}
        renderTrack={({props, children}) => (
          <div
            className={className?.track}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%'
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: hook[0],
                  colors: ['#cfd5db', '#06f', '#cfd5db'],
                  min,
                  max
                }),
                alignSelf: 'center'
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({props, isDragged}) => (
          <div
            className={className?.thumb}
            {...props}
            style={{
              ...props.style,
              height: '25px',
              width: '25px',
              borderRadius: '13px',
              backgroundColor: '#FFF',
              display: 'flex',
              border: '1px solid #06f'
            }}
          />
        )}
      />
    </Wrapper>
  );
};

export default MultipleRange;
