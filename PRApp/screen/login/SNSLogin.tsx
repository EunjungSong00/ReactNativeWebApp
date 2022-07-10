import React from 'react';
import Img from "../../src/component/atom/Img";
import Wrapper from "../../src/component/atom/Wrapper";
import styled from "@emotion/native";
import {Pressable, View} from "react-native";
import theme_new from "../../public/theme_new";

const SNSLogin = () => (
    <>
        <SnsView>
            <SnsBtnNaver>
                <Img src={require('../../public/image/login/icon-sns-login-naver-d.png')} width={75} height={75} />
            </SnsBtnNaver>
        </SnsView>
        <SnsView>
            <SnsBtnKakao>
                <Img src={require('../../public/image/login/icon-sns-login-kakao-d.png')} width={75} height={75} />
            </SnsBtnKakao>
        </SnsView>
        <SnsView>
            <SnsBtnApple>
                <Img src={require('../../public/image/login/icon-sns-login-google-d.png')} width={75} height={75} />
            </SnsBtnApple>
        </SnsView>
    </>
);

export default SNSLogin;

const SnsView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SnsBtnNaver = styled(Pressable)`
  width: 75px;
  height: 75px;
  border-radius: 38px;
  background-color: ${theme_new.colors.sns.naver};
  justify-content: center;
  align-items: center;
`;

const SnsBtnKakao = styled(SnsBtnNaver)`
  background-color: ${theme_new.colors.sns.kakao};
`;

const SnsBtnApple = styled(SnsBtnNaver)`
  background-color: ${theme_new.colors.sns.apple};
`;
