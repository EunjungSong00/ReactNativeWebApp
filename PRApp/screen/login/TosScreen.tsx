import React from 'react';
import theme from "../../public/theme";
import InstantLayout from '../../src/component/template/InstantLayout';
import ScrollViewBetween from "../../src/component/template/ScrollViewBetween";
import {INavigationRoute} from "../order/OrderStateScreen";
import TOSPrivacy from "../signUp/TOS/TOSPrivacy";
import TOSThird from "../signUp/TOS/TOSThird";
import TOSCustomer from "../signUp/TOS/TOSCustomer";
import Wrapper from '../../src/component/atom/Wrapper';
import Txt from "../../src/component/atom/Txt";
import TOSPhone from "../signUp/TOS/TOSPhone";
import TOSPhoneCustomer from "../signUp/TOS/TOSPhoneCustomer";
import TOSPhoneUnique from "../signUp/TOS/TOSPhoneUnique";
import TOSPersonalInformation from "../signUp/TOS/TOSPersonalInformation";

export const TOSTitle = ({children}: any) => (
    <Txt weight={'bold'} mb={15} size={'sm'}>{children}</Txt>
)

export const TOSSubTitle = ({children}: any) => (
    <Txt weight={'medium'} mb={15} size={'sm'}>{children}</Txt>
)

export const TOSSubText = ({children, mt, mb}: {children: any, mt?: number, mb?: boolean}) => (
    <Txt size={'xs'} weight={'medium'} mt={mt} mb={mb? 4 : 1} lineHeight={16}>{children}</Txt>
)

export const TOSTableWrapper = ({children}: any) => (
    <Wrapper row borderColor={theme.color.lineGray5} borderBottomWidth={1}>
        {children}
    </Wrapper>
)

export const TOSTh = ({children, border, width}: {children: any, border?: boolean, width?: number | string}) => (
    <Wrapper w h flexNum={width? undefined : 1} padding={12} backgroundColor={theme.color.lineGray17} borderColor={theme.color.lineGray5} borderRightWidth={border? 1 : 0} width={width}>
        <Txt size={'xs'} weight={'bold'} textAlign={'center'}>{children}</Txt>
    </Wrapper>
)

export const TOSTd = ({children, border, borderTop, width, center}: {children: any, border?: boolean, borderTop?: boolean, width?: number | string, center?: boolean}) => (
    <Wrapper h w={center} flexNum={width? undefined : 1} padding={12} borderColor={theme.color.lineGray5} borderRightWidth={border? 1 : 0} borderTopWidth={borderTop? 1 : 0} width={width}>
        <Txt size={'xs'} weight={'medium'}>{children}</Txt>
    </Wrapper>
)

const TosScreen = ({route}: INavigationRoute) => {
  const type: string = route?.params?.type;
  const title: string = route?.params?.title;

  return (
    <Wrapper flex={1}>
        <InstantLayout title={title || '서비스 이용약관'}>
        <ScrollViewBetween>
        <Wrapper flexNum={1} backgroundColor={theme.color.white} d paddingY={20}>
            {type === 'privacy' && <TOSPrivacy />}
            {type === 'third' && <TOSThird />}
            {type === 'customer' && <TOSCustomer />}
            {type === 'phone' && <TOSPhone />}
            {type === 'phoneCustomer' && <TOSPhoneCustomer />}
            {type === 'phoneUnique' && <TOSPhoneUnique />}
            {type === 'personalInformation' && <TOSPersonalInformation />}
        </Wrapper>
        </ScrollViewBetween>
      </InstantLayout>
    </Wrapper>
  );
};
export default TosScreen;
