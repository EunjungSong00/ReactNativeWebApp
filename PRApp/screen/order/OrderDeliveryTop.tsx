import React, {useCallback, useEffect, useState} from 'react';
import styled from "@emotion/native";
import theme from "../../public/theme";
import PurchaseHistoryThumb from "../purchaseHistory/PurchaseHistoryThumb";
import Wrapper from "../../src/component/atom/Wrapper";
import Txt from "../../src/component/atom/Txt";
import {getStorage} from "../../src/module/manageAsyncStorage";

const typeList = {
    delivery: [
        {title: '배송준비중', value: 'ready'},
        {title: '배송중', value: 'ing'},
        {title: '배송완료', value: 'complete'},
    ],
    refund: [
        {title: '환불접수', value: 'ready'},
        {title: '사유검토', value: 'confirm'},
        {title: '반납중', value: 'ing'},
        {title: '반납완료', value: 'complete'},
    ]
}

interface IOrderDeliveryTop {
    data: any;
    type: 'delivery' | 'refund';
    status: 'ready' | 'ing' | 'confirm' | 'complete';
    navigation: any;
}

interface IStatusDom {
    active: boolean;
    title: string;
}

interface IStatusListDom {
    value: IOrderDeliveryTop['status'];
    title: string;
}

/*주문상태 배송 상단*/
const OrderDeliveryTop = ({data, type, status, navigation}: IOrderDeliveryTop) => {
    const typeArr = useState(typeList[type]);

    const StatusDom = useCallback(({active, title}: IStatusDom) => (
        <StatusTxtBox active={active} type={type}>
            <StatusTxt active={active}>{title}</StatusTxt>
        </StatusTxtBox>
    ), []);

    const StatusListDom = useCallback(({value, title}: IStatusListDom) => {
        const ready = value === 'ready';
        const complete = value === 'complete';
        const middle = (value !== 'ready' && value !== 'complete');
        const active = value === status;

        return (
            <Wrapper flexNum={1}>
                <Wrapper style={{position: middle? 'relative' : 'absolute', right: complete? 0 : 'auto'}} w={middle}>
                    <StatusDom title={title} active={active} />
                    {
                       !middle ?
                            <Wrapper row>
                                <Wrapper flexNum={1} height={ready? 30 : 'auto'} backgroundColor={ready? theme.color.white : undefined} />
                                <StatusBox active={active} type={type} />
                                <Wrapper flexNum={1} height={complete? 30 : 'auto'} backgroundColor={complete? theme.color.white : undefined} />
                            </Wrapper>
                            :
                            <StatusBox active={active} type={type} />
                    }
                </Wrapper>
            </Wrapper>
        )
    }, []);

    return (
        <>
            {
                ['refund'].includes(type)?
                    <Wrapper d mt={20}>
                        <Txt size={'sm'} weight={'thick'} color={'red'}>환불요청</Txt>
                    </Wrapper>
                    :
                    null
            }
            <PurchaseHistoryThumb {...data} navigation />
            <Wrapper row between d mb={20}>
                <Wrapper width={'100%'} height={1} position={'absolute'} style={{left: 20, bottom: (status !== 'ready' && status !== 'complete') ? 10: 7}} backgroundColor={'#d7dde5'} />
                {
                    typeArr[0].map((item) => (
                        <StatusListDom key={item.value} value={item.value} title={item.title} />
                    ))
                }
            </Wrapper>
        </>
    )
}
export default OrderDeliveryTop;

const StatusTxtBox = styled(Wrapper)`
  ${({active, type}: {active: IStatusDom['active'], type: IOrderDeliveryTop['type']}) => active? 
    `background-color: ${type === 'delivery' ? theme.color.primary : theme.color.red};padding: 6px 7.5px; border-radius: 20px; margin-top: -12px;`
    : 
    ''};
`;

const StatusTxt = styled(Txt)`
font-size: ${theme.size.xs};
  ${({active}: {active: IStatusDom['active']}) => active?
    `font-family: ${theme.font.thick};
    color: ${theme.color.white};`
    :
    `font-family: ${theme.font.bold};
    color: ${theme.color.textGray};`};
`;

const StatusBox = styled(Wrapper)`
  ${({active, type}: {active: IStatusDom['active'], type: IOrderDeliveryTop['type']}) => active?
    `width: 20px;
    height: 20px;
    margin-top: 5px;
    border: 4px solid ${type === 'delivery' ? theme.color.primary : theme.color.red}`
    :
    `width: 15px;
    height: 15px;
    margin-top: 7px;
    border: 3px solid #d7dde5`};
    position: relative;
    z-index: 9;
    background-color: ${theme.color.white};
    border-radius: 15px;
`;
