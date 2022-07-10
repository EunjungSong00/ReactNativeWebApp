import Wrapper from "../src/component/atom/Wrapper";
import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context?.req?.headers?.cookie;

  console.log(
    "JSON.parse(context.req.headers.cookie)",
    context.req.headers.cookie && JSON.parse(context.req.headers.cookie)
  );
  return { props: { response: "hello", cookies } };
};

const Home = ({ response, cookies }: any) => {
  const [cookie, setCookie] = useState<any>();

  useEffect(() => {
    const cookies = parseCookies();
    console.log("cookies", cookies);
    setCookie(cookies);
  }, []);

  return (
    <Wrapper w h height={300}>
      {"cookie: " + JSON.stringify(cookie)}
      <br />
      <br />
      {"response: " + JSON.stringify(response)}
      <br />
      {"cookies: " + cookies}
      <br />
    </Wrapper>
  );
};

export default Home;
