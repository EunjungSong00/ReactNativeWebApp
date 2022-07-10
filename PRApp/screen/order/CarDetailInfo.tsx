import React, {useCallback, useEffect, useState} from 'react';
import styled from "@emotion/native";
import theme from "../../public/theme";
import {numberComma} from "../../src/module/formatter";
import {OptionTop} from "CarDetailInfoOption";
import getVehicleApi from "../../src/api/vehicle/getVehicleIdApi";
import getVehicleInsuranceHistoryApi from "../../src/api/purchaseHistory/getVehicleInsuranceHistoryApi";
import Txt from "../../src/component/atom/Txt";
import Wrapper from "../../src/component/atom/Wrapper";
import {PaymentTitle} from "../../src/component/atom/InputLine";
import ButtonNew from "../../src/component/atom/ButtonNew";

interface ICarDetailInfo {
    id: number;
    navigation: any;
}

interface ITableRow {
    th: string;
    td?: string;
    top?: boolean;
}

interface IInsuranceHistoryDom {
    title: string;
    count: string;
    end?: boolean;
}

/*차량 상세 정보*/
const CarDetailInfo = ({id, navigation}: ICarDetailInfo) => {
    const [data, setData] = useState();
    const [vehicleInsuranceHistory, setVehicleInsuranceHistory] = useState();

    useEffect(() => {
        if (id) {
            getVehicleInfo();
            getVehicleInsuranceHistory();
        }
    }, []);

    const getVehicleInfo = useCallback(() => {
        getVehicleApi({id, navigation})
            .then((res) => {
                console.log('getVehicleInfo', res)
                if (res.getVehicle) {
                    setData(res.getVehicle);
                }
            })
    }, []);

    const getVehicleInsuranceHistory = useCallback(() => {
        console.log('getVehicleInsuranceHistory id', id);
        getVehicleInsuranceHistoryApi({id, navigation})
            .then((res) => {
                console.log('getVehicleInsuranceHistoryApi ', res);
                if (res?.getVehicleInsuranceHistory) setVehicleInsuranceHistory(res.getVehicleInsuranceHistory);
            });
    }, []);

    const TableRow = useCallback(({th, td, top}: ITableRow) => (
        <Tr row borderColor={theme.color.lineGray5} borderBottomWidth={1} borderTopWidth={top? 1 : 0}>
            <Th flexNum={1} padding={12} backgroundColor={theme.color.lineGray17} borderColor={theme.color.lineGray5} borderRightWidth={1}>
                <Txt size={'sm'} weight={'medium'}>{th}</Txt>
            </Th>
            <Td flexNum={2} h pr={12}>
                <Txt size={'sm'} weight={'medium'} textAlign={'right'}>{td || '-'}</Txt>
            </Td>
        </Tr>
    ), []);

    const InsuranceHistoryDom = useCallback(({title, count, end}: IInsuranceHistoryDom) => (
        <Wrapper row between padding={12} borderColor={theme.color.lineGray5} borderBottomWidth={end? 0 : 1}>
            <Txt size={'sm'} weight={'medium'}>{title}</Txt>
            <Wrapper row>
                <Txt size={'sm'} weight={'thick'} color={'primary'}>{count ? count + ' 회' : ' 없음'}</Txt>
            </Wrapper>
        </Wrapper>
    ), []);

    return (
        <>
            <Wrapper d paddingY={35} backgroundColor={'white'}>
                {data?.basicOption && <OptionTop data={data?.basicOption}/>}
                <ButtonNew title={'옵션정보 전체보기 >'} type={'line'} round thin mt={10} onPress={() => navigation.navigate('SearchDetailOptionScreen', {id: data?.id})} />
                <Wrapper mt={50}>
                    <PaymentTitle title={'기본정보'} />
                    <Wrapper mt={15}>
                        <TableRow th={'제시 신고번호'} td={'-'} top />
                        <TableRow th={'판매 종사원'} td={data?.partnerName && data?.partnerName + ' ' + data?.partnerNumber && data?.partnerNumber} />
                        <TableRow th={'연식'} td={data?.modelYear} />
                        <TableRow th={'유형'} td={data?.appearance} />
                        <TableRow th={'색상'} td={data?.color} />
                        <TableRow th={'승차정원'} td={data?.seat && `${data?.seat}명`} />
                        <TableRow th={'차량번호'} td={data?.number} />
                        <TableRow th={'연료'} td={data?.fuel} />
                        <TableRow th={'연비'} td={data?.fuelEconomy && `${data?.fuelEconomy}km/l`} />
                        <TableRow th={'배기량'} td={data?.engineDisplacement && `${numberComma(data?.engineDisplacement)}cc`} />
                        <TableRow th={'변속기'} td={data?.transmission} />
                        <TableRow th={'구동방식'} td={data?.wheelDrive} />
                    </Wrapper>
                </Wrapper>
                <Wrapper mt={50}>
                    <PaymentTitle title={'성능점검'} />
                    <ButtonNew title={'성능점검부 사진보기 >'} type={'line'} round thin mt={20} onPress={() => navigation.navigate('SearchDetailPerformanceScreen', {id: data?.id})} />
                </Wrapper>
                <Wrapper mt={50}>
                    <PaymentTitle title={'보험이력'} />
                    <Wrapper mt={10}>
                        <InsuranceHistoryDom title="내차 피해" count={vehicleInsuranceHistory?.selfAccidentCount} />
                        <InsuranceHistoryDom title="상대차 피해" count={vehicleInsuranceHistory?.otherAccidentCount} />
                        <InsuranceHistoryDom title="침수여부" count={vehicleInsuranceHistory?.floodedAccidentCount} />
                        <InsuranceHistoryDom title="전손" count={vehicleInsuranceHistory?.generalTotalLossAccidentCount} />
                        <InsuranceHistoryDom title="도난" count={vehicleInsuranceHistory?.theftTotalLossAccidentCount} end />
                    </Wrapper>
                    {vehicleInsuranceHistory && <ButtonNew title={'보험이력 전체보기 >'} type={'line'} round thin mt={20}
                                onPress={() => navigation.navigate('SearchDetailHistoryScreen', {id: data?.id})}/>}
                </Wrapper>
            </Wrapper>
        </>
    )
}
export default CarDetailInfo;

const Tr = styled(Wrapper)`
`;
const Th = styled(Wrapper)`
`;
const Td = styled(Wrapper)`
    
`;