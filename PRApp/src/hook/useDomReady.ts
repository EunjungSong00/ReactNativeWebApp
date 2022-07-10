import {useEffect, useState} from 'react';

const useDomReady = (): boolean => {
  const [domReady, setDomReady] = useState<boolean>(false);

  useEffect(() => {
    setDomReady(true);
  }, []);

  return domReady;
};

export default useDomReady;
