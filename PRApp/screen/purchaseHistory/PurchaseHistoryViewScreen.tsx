import React from 'react';
import {ScrollView} from "react-native";
import {NavigationParams} from "react-navigation";
import theme from "../../public/theme";
import InstantLayout from "../../src/component/template/InstantLayout";
import PurchaseHistoryThumb from "PurchaseHistoryThumb";
import CarDetailInfo from "../order/CarDetailInfo";
import {INavigationRoute} from "../order/OrderStateScreen";
import Wrapper from "../../src/component/atom/Wrapper";

/*구매이력 상세*/
const PurchaseHistoryViewScreen = ({navigation, route}: INavigationRoute) => {
    const item: NavigationParams | undefined = route?.params?.item;

    return (
        <InstantLayout title={'내차 확인'}>
            <Wrapper flexNum={1} backgroundColor={theme.color.backgroundGray}>
                <ScrollView>
                    <>
                        <PurchaseHistoryThumb {...item}
                                              type={'purchaseView'}
                                              navigation={navigation} />
                        <CarDetailInfo id={item?.vehicleId} navigation={navigation} />
                    </>
                </ScrollView>
            </Wrapper>
        </InstantLayout>
    )
}
export default PurchaseHistoryViewScreen;
