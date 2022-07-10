import {Dispatch, SetStateAction, useCallback, useState, ChangeEvent} from 'react';

export type UseInputType<T> = {value: T | ''; onChange: (e: ChangeEvent<HTMLInputElement>) => void; setValue: Dispatch<SetStateAction<T>>};

const useInput = <T>(initialData: T): UseInputType<T> => {
  const [value, setValue] = useState(initialData);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);
  return {value: value ?? '', onChange, setValue}; // input의 value에 undefined가 들어가면 error가 발생함.
};

export default useInput;
