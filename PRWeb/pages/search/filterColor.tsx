import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import styled from "@emotion/styled";
import theme from "../../public/theme";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";

const colorList = [
    [
        {title: '전체', src: `/image/search/filter-color-all.svg`},
        {title: '흰색', color: `white`},
        {title: '회색', color: `silver`},
        {title: '미색', color: `offWhite`},
        {title: '검정', color: `black`},
    ],
    [
        {title: '빨강', color: `red`},
        {title: '파랑', color: `blue`},
        {title: '초록', color: `green`},
        {title: '노랑', color: `yellow`},
        {title: '갈색', color: `brown`},
    ],
    [
        {title: '자주', color: `purple`},
        {title: '기타', src: `/image/search/filter-color-etc.svg`},
    ]
]

const FilterColor = () => {
    const [colorMargin, setColorMargin] = useState('');
    const [selectedList, setSelectedList] = useState([]);
    const myRef = useRef();

    useEffect(() => {
        getClientWidth();
    }, []);

    useEffect(() => {
        window.addEventListener("resize", getClientWidth);
    }, []);

    const getClientWidth = () => {
        if (myRef.current && myRef.current.clientWidth) {
            const width = myRef.current.clientWidth;
            const value = (width - (40*5)) /4 + 'px';
            setColorMargin(value)
        }
    }

    const clickColorBox = useCallback((title) => {
        let list = [...selectedList]
        const allChk = title === '전체';
        if (list.includes(title)) {
            // 누른거 다시 눌렀을때
            if (allChk) {
                // 전체
                list = [];
            } else {
                // 전체 아닌거
                list = list.filter(item => item !== title)
            }
        } else {
            // 처음 누른거
            if (allChk) {
                // 전체
                list = ['전체'];
            } else {
                // 전체 아닌거
                list = list.filter(item => item !== '전체')
                list.push(title);
            }
        }
        setSelectedList(list)
    }, [selectedList]);

    const ListComponent = useCallback((props) => {
        return (
            <Wrapper style={{display:'inline-block'}} onClick={() => clickColorBox(props.title)} mr={props.idx !== 4 ? colorMargin: 'auto'}>
                <ColorBox h color={props.color || ''}>
                    {
                        props.src?
                            <img style={{width: '40px', height: '40px'}} src={props.src} />
                            :
                            null
                    }
                    {
                        selectedList.includes(props.title) ?
                            <img style={{position: 'absolute', width: '12px', height: '12px', marginLeft: '14px'}}
                                 src={`/image/component/ic-iput-close.svg`}/>
                            :
                            null
                    }
                </ColorBox>
                <Txt style={{'textAlign': 'center'}}>{props.title}</Txt>
            </Wrapper>
        )
    }, [colorMargin, selectedList]);

    const ListWrapper = useCallback(({item, index}) => {
        return (
            <Wrapper mb={15}>
                {
                    item.map((value, idx) => {
                        return <ListComponent key={value.title} idx={idx} {...value} />
                    })
                }
            </Wrapper>
        )
    }, [colorMargin, selectedList]);

    return (
        <Wrapper ref={myRef}>
            <Txt mb={16}>색상</Txt>
            <Wrapper>
                {
                    colorList.map((item, index) => (
                        <ListWrapper item={item} index={index} key={'colorList' + index} />
                    ))
                }
            </Wrapper>
        </Wrapper>
    )
};

export default memo(FilterColor);

export const ColorBox = styled(Wrapper)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 7px;
  ${({color}: {color: any}) => color? `background-color: ${theme.color[color]}` : null};
  ${({color}: {color: any}) => color === 'white' ? `border: 1px solid #bbb` : null};
`;