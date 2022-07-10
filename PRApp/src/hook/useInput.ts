import {Dispatch, SetStateAction, useCallback, useState} from 'react';

export type IUseInput = {value: string; setValue: (val: string) => void; resetValue: () => void};

const useInput = (initialData?: string): IUseInput => {
  const [value, setValue] = useState(initialData || '');

  const _setValue = useCallback((val: string) => setValue(val), []);

  const resetValue = useCallback(() => {
    setValue('');
  }, []);

  const returnValue = {value, setValue: _setValue, resetValue};

  return returnValue;
};

export default useInput;
