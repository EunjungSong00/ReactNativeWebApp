import React from 'react';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import IRootStackParamList from "../../src/interface/IRootStackParamList";
import Wrapper from "../../src/component/atom/Wrapper";
import Text from "../../src/component/atom/Text";
import {SafeAreaView} from "react-native";

type HomeProps = NativeStackScreenProps<IRootStackParamList, 'HomeTest'>
const Home = ({navigation}: HomeProps) => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <Wrapper>
                <Text>홈화면</Text>
            </Wrapper>
        </SafeAreaView>
    )
};

export default Home;
