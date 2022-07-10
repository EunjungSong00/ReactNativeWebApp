import Line from '../../../component/atom/Line';
import Wrapper from '../../../component/atom/Wrapper';
import React, {Ref, useRef, Dispatch, ReactElement, SetStateAction, useCallback, useEffect, useState, Fragment} from 'react';
import {FilterLayoutWrapper} from '../style/filter';
import Button from '../../../component/atom/Button';
import theme, {primary, whiteBlue} from '../../../../public/theme';
import SwipeBox from '../../../component/molecule/SwipeBox';
import Input from '../../../component/atom/Input';
import useInput from 'src/hook/useInput';
import useCheckBoxEl from 'src/hook/useCheckBoxEl';
import Txt from '../../../component/atom/Txt';
import Text from '../../../component/atom/Text';
import {requestAxiosGet} from '../../../module/requestAxios';
import ICommonStyle from '../../../interface/ICommonStyle';
import {getCommas} from '../../../module/formatter';
import {} from 'react';
import MultipleRange from '../../../component/atom/MultipleRange';
import vehicleTree from '../../../../public/json/vehicle-tree.json';
import {minHeight} from 'styled-system';

export const Filter = ({nowTab, setNowTab}: {nowTab: NavigateTabType; setNowTab: Dispatch<SetStateAction<NavigateTabType>>}) => {
  const tabs = ['브랜드/모델', '외형', '상세필터'];
  const checkBoxElHyundai = useCheckBoxEl();
  const checkBoxElGenesis = useCheckBoxEl();
  const checkBoxElKia = useCheckBoxEl();
  const checkBoxElChevrolet = useCheckBoxEl();
  const checkBoxElSamsung = useCheckBoxEl();
  const checkBoxElSSangyong = useCheckBoxEl();
  const checkBoxElBenz = useCheckBoxEl();
  const checkBoxElBmw = useCheckBoxEl();
  const requestBrands = {현대: checkBoxElHyundai.value, 제네시스: checkBoxElGenesis.value};
  const brandModelInput = useInput('');
  const testRef = useRef(null);
  const testRef2 = useRef(null);
  const nowYear = new Date().getFullYear();
  const priceMin = useInput(450);
  const priceMax = useInput(10000);
  const yearMin = useInput(2000);
  const yearMax = useInput(nowYear);
  const mileageMin = useInput(1000);
  const mileageMax = useInput(150000);
  const [brandModelList, setBrandModelList] = useState<any>();

  const getVehicleListApi = useCallback(async () => {
    const response = await requestAxiosGet('search/list');

    console.log('vehicleTree', vehicleTree);
    setBrandModelList(vehicleTree);
  }, []);

  useEffect(() => {
    getVehicleListApi();
  }, []);

  const getBrandsQuery = useCallback((brands: any) => {
    const isFilteredBrand = JSON.stringify(brands).includes('true');
    const _brandsQuery = isFilteredBrand
      ? `brand=${Object.entries(brands)
          .filter((el) => el[1])
          .map((el) => el[0])
          .toString()
          .replace(/,/gi, '&brand=')}`
      : '';
    return _brandsQuery;
  }, []);

  const getBrandFilterApi = useCallback(async (brands: any) => {
    const _brandsQuery = getBrandsQuery(brands);
    // console.log('_brandsQuery', _brandsQuery);
    const response = _brandsQuery && (await requestAxiosGet('search/list', _brandsQuery));
    // console.log('response', response);
    return response;
  }, []);

  useEffect(() => {
    getBrandFilterApi(requestBrands);
  }, [checkBoxElHyundai.value, checkBoxElGenesis.value]);

  return nowTab ? (
    <FilterLayout setNowTab={setNowTab}>
      <SwipeBox
        w
        h
        style={{height: '100%', width: '100%'}}
        children={[
          <FilterContentLayout>
            <>
              <Input placeholder="브랜드 또는 모델명을 검색해주세요" className="swiper-no-swiping" hook={brandModelInput} mb={10} whcbr={['100%', 50, whiteBlue]} />
              {brandModelList.brandList.map((brand: any, key: number) => {
                return (
                  <Fragment key={key}>
                    <BrandRow label={brand.brandName} subItem={brand.modelList} logo={brand.brand} visible={true} />
                    {/* {brand.modelList.map((model: any, key: number) => {
                      return (
                        <Fragment key={key}>
                          <ModelRow label={model.modelName} visible={true} onClick={() => console.log(model.modelName)} />
                          {model.modelDetailList.map((modelDetail: string, key: number) => {
                            return <ModelDetailRow label={modelDetail} visible={true} onClick={() => console.log(modelDetail)} key={key} />;
                          })}
                        </Fragment>
                      );
                    })} */}
                  </Fragment>
                );
              })}
            </>
          </FilterContentLayout>,
          <FilterContentLayout>
            <>
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'경차'} count={1004} onClick={() => console.log('BMW')} />
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'세단'} count={1004} onClick={() => console.log('BMW')} />
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'SUVㆍRV'} count={1004} onClick={() => console.log('BMW')} />
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'트럭'} count={1004} onClick={() => console.log('BMW')} />
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'승합ㆍ버스'} count={1004} onClick={() => console.log('BMW')} />
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'친환경'} count={1004} onClick={() => console.log('BMW')} />
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'연비최상'} count={1004} onClick={() => console.log('BMW')} />
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'초보운전'} count={1004} onClick={() => console.log('BMW')} />
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'오픈카'} count={1004} onClick={() => console.log('BMW')} />
              <BodyRow checkBoxEl={checkBoxElBmw.Element} label={'신차급'} count={1004} onClick={() => console.log('BMW')} />
            </>
          </FilterContentLayout>,
          <FilterContentLayout>
            <>
              <Wrapper width={375} h minHeight={515} mt={10} column>
                <MultipleRangeLayout title="가격" min={'0원'} max={'1억원이상'}>
                  <MultipleRange
                    height={70}
                    min={0}
                    max={10000}
                    hook={[
                      [priceMin.value as number, priceMax.value as number],
                      [priceMin.setValue, priceMax.setValue]
                    ]}
                    type="box"
                    formatter={(val: number) => (val < 10000 ? `${getCommas(val)}만원` : '1억원')}
                    className={{track: 'swiper-no-swiping', thumb: 'swiper-no-swiping'}}
                    plus
                  />
                </MultipleRangeLayout>
                <MultipleRangeLayout title="연식" min={'2,000년'} max={`${getCommas(nowYear)}년`} mt={46}>
                  <MultipleRange
                    height={70}
                    min={2000}
                    max={nowYear}
                    hook={[
                      [yearMin.value as number, yearMax.value as number],
                      [yearMin.setValue, yearMax.setValue]
                    ]}
                    type="box"
                    formatter={(val: number) => `${getCommas(val)}년`}
                    className={{track: 'swiper-no-swiping', thumb: 'swiper-no-swiping'}}
                  />
                </MultipleRangeLayout>
                <MultipleRangeLayout title="주행거리" min={'0km'} max={'15만km이상'} mt={46}>
                  <MultipleRange
                    height={70}
                    min={0}
                    max={150000}
                    hook={[
                      [mileageMin.value as number, mileageMax.value as number],
                      [mileageMin.setValue, mileageMax.setValue]
                    ]}
                    type="box"
                    formatter={(val: number) => `${getCommas(val)}km`}
                    className={{track: 'swiper-no-swiping', thumb: 'swiper-no-swiping'}}
                    plus
                  />
                </MultipleRangeLayout>
              </Wrapper>
              <Seperator />
              <Wrapper size={375} minHeight={1012} flex>
                <Wrapper style={{background: 'red'}} size="50px"></Wrapper>
                <Wrapper style={{background: 'blue', flexGrow: 1}} size="50px" overflowX>
                  <Wrapper size={[1000, '100%']} />
                </Wrapper>
                <Wrapper style={{background: 'green'}} size="50px"></Wrapper>
              </Wrapper>
            </>
          </FilterContentLayout>
        ]}
        initialSlide={tabs.findIndex((tab) => tab === nowTab)}
        pagination={{
          type: 'bullets',
          clickable: true,
          renderBullet: (index: number, className: string) => `<div class='${className} bullet-${index}'>${tabs[index]}</div>`,
          el: '.swiper-pagination'
        }}
      />
    </FilterLayout>
  ) : (
    <></>
  );
};

function FilterContentLayout({children}: {children: ReactElement}) {
  return (
    <Wrapper padding={'0px 20px 20px'} h column height="calc(100vh - 135px)" overflowY>
      {children}
    </Wrapper>
  );
}

function Seperator() {
  return <Wrapper width={'calc(100% + 40px)'} minHeight={10} background={theme.color.backgroundGray} />;
}

function DownArrow({onClick}: {onClick: () => void}) {
  return (
    <Wrapper style={{flexGrow: 1}} onClick={onClick}>
      <img src="/image/search/filter-brand-down.svg" style={{float: 'right'}} />
    </Wrapper>
  );
}

type BrandModelRowLayoutType = BrandModelRowType & {
  depth: 0 | 1 | 2;
  onClick: () => void;
};

type BrandModelRowType = {
  logo?: string;
  label: string;
  visible?: boolean;
  subItem?: any;
};

function BrandModelRowLayout(props: BrandModelRowLayoutType) {
  const [isCheck, setIsCheck] = useState(false);

  return (
    <Wrapper width="100%" height={'100%'} minHeight={60 - 5 * props.depth}>
      <Wrapper h size={'100%'} borderBottom={`1px solid ${theme.color.lineGray}${props.depth === 2 ? '55' : ''}`} pointer>
        <CheckBox isCheck={isCheck} onClick={() => setIsCheck((val) => !val)} children={<Label logo={props.logo} label={props.label} />} depth={props.depth} />
        {props.depth !== 2 && <DownArrow onClick={props.onClick} />}
      </Wrapper>
    </Wrapper>
  );
}

type CheckBoxType = {isCheck: boolean; children: ReactElement; depth: 0 | 1 | 2; onClick: () => void};

function CheckBox({isCheck, children, depth, onClick}: CheckBoxType) {
  return (
    <Wrapper h height={'100%'} pl={depth * 22} onClick={onClick}>
      <Wrapper minWidth={20} minHeight={20} borderRadius="4px" mr={12} style={isCheck ? {border: 'solid 1.3px #06f', background: '#f3fcff'} : {border: 'solid 1.3px #d0d0d0'}} />
      {children}
    </Wrapper>
  );
}

type LabelType = {
  logo?: string;
  label: string;
};

function Label({logo, label}: LabelType) {
  return (
    <Wrapper h size={'100%'}>
      {logo && <img src={`/image/search/filter-brand-${logo}.svg`} style={{marginRight: 12}} />}
      <Text children={label} />
    </Wrapper>
  );
}

function BrandRow({...props}: BrandModelRowType) {
  // let subItemCheck = {};
  // props.subItem.forEach((brand: any, key: number) => Object.assign(subItemCheck, {key: false}));
  const subItemCheck = props.subItem.map((brand: any) => [brand.modelName, false]);
  const [subItem, setSubItem] = useState(subItemCheck);
  const [activeSubItem, setActiveSubItem] = useState(false);

  return (
    <Wrapper width="100%">
      <BrandModelRowLayout depth={0} onClick={() => console.log(subItem)} {...props} />
      {/* {activeSubItem ?  : <></>} */}
    </Wrapper>
  );
}

function ModelRow({...props}: BrandModelRowType) {
  return <BrandModelRowLayout depth={1} {...props} />;
}

function ModelDetailRow({...props}: BrandModelRowType) {
  return <BrandModelRowLayout depth={2} {...props} />;
}

type BodyRowType = {
  checkBoxEl: (el: any) => ReactElement;
  label: string;
  count: number;
  onClick: () => void;
};

function BodyRow({checkBoxEl, label, count, onClick}: BodyRowType) {
  const CheckBox = checkBoxEl;

  return (
    <Wrapper size={['100%', 60]}>
      <Wrapper h size={'100%'} onClick={onClick} borderBottom={`1px solid ${theme.color.lineGray}`} pointer>
        <CheckBox />
        <Text children={label} />
        <Text children={getCommas(count)} color={'#666666'} ml="auto" mr={0} />
      </Wrapper>
    </Wrapper>
  );
}

type MultipleRangeLayoutType = ICommonStyle & {
  title: string;
  max: string;
  min: string;
  children: ReactElement;
};

function MultipleRangeLayout({title, max, min, children, ...props}: MultipleRangeLayoutType) {
  return (
    <Wrapper column w h {...props} width="325px">
      <Text weight="bold" margin="0px auto 22px 0px">
        {title}
      </Text>
      {children}
      <Wrapper w between width={'100%'} mt="9px">
        <Text size="13px">{min}</Text>
        <Text size="13px">{max}</Text>
      </Wrapper>
    </Wrapper>
  );
}

export type NavigateTabType = '브랜드/모델' | '외형' | '상세필터' | undefined;

function NavigateTabs({setNowTab}: {setNowTab: Dispatch<SetStateAction<NavigateTabType>>}) {
  return (
    <Wrapper>
      <Wrapper flex>
        <Wrapper className="swiper-pagination" />
        <img src={'/image/icon/icon-filter-close.svg'} style={{width: 15, height: 15, margin: '0 0 0 auto', cursor: 'pointer'}} onClick={() => setNowTab(undefined)} />
      </Wrapper>
    </Wrapper>
  );
}

function FilterLayout({children, setNowTab}: {children: ReactElement; setNowTab: Dispatch<SetStateAction<NavigateTabType>>}) {
  return (
    <FilterLayoutWrapper>
      <Wrapper padding={'25px 20px 0px 20px'} size={['100%', 70]}>
        <NavigateTabs setNowTab={setNowTab} />
      </Wrapper>
      <Line mt={-9} mb={9} />
      <Wrapper size={['100%', 660]} style={{flexGrow: 1}}>
        {children}
      </Wrapper>
      <Wrapper flex size={['100%', 75]} padding="13px 15px" style={{boxShadow: '0 -3px 5px 0 rgba(0, 0, 0, 0.05)'}}>
        <Button whcbr={['20%', 50, '#f0f2f4', 'none', 6]} color="#06f" children={'초기화'} style={{minWidth: 84}} />
        <Button whcbr={['80%', 50, primary, 6]} style={{flexGrow: 1}} ml="10px" children={'결과보기'} />
      </Wrapper>
    </FilterLayoutWrapper>
  );
}
