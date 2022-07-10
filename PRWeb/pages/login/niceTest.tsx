import {useEffect, memo} from 'react';
import {useRouter} from 'next/router';
import {GetServerSideProps} from 'next';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  console.log('context.query', context.query);
  const response = {props: {query: context.query}};
  return response;
};

const niceTest = (pageProps: any) => {
  useEffect(() => {
    alert('pageProps ' + JSON.stringify(pageProps.query));
  }, []);
  return <>나이스 본인인증 모듈 연동2</>;
};

export default memo(niceTest);
