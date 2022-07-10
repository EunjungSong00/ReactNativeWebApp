import Wrapper from '../../component/atom/Wrapper';
import styled from '@emotion/styled';
import ICommonStyle from '../../interface/ICommonStyle';
import {useState, useCallback, ReactText, ReactElement, Dispatch, SetStateAction} from 'react';

const useCheckBoxEl = (initialValue?: boolean) => {
  const [check, setCheck] = useState(!!initialValue);

  const handleCheck = useCallback(() => {
    setCheck((val) => !val);
  }, []);

  interface ICheckBoxEl extends ICommonStyle {
    label?: ReactText;
  }

  const CheckBoxEl = useCallback(
    ({label, ...props}: ICheckBoxEl): ReactElement => (
      <Wrapper h onClick={handleCheck} style={{cursor: 'pointer'}} {...props}>
        <input type="checkbox" checked={check} onChange={handleCheck} style={{display: 'none', cursor: 'pointer'}} />
        <Icon checked={check} style={{cursor: 'pointer'}} />
        {label && typeof label === 'string' ? <label children={label} style={{cursor: 'pointer'}} /> : label}
      </Wrapper>
    ),
    [check]
  );

  return {Element: CheckBoxEl, value: check, setValue: setCheck};
};

export default useCheckBoxEl;

const Icon = styled.div<any>`
  display: inline-block;
  min-width: 20px;
  min-height: 20px;
  background: ${({checked}) => (checked ? "url('/image/component/ic-after.svg') no-repeat 0 0" : "url('/image/component/n.svg') no-repeat 0 0")};
  background-size: contain;
  margin-right: 13px;
  vertical-align: bottom;
`;
