import React, {useCallback, useEffect} from 'react';
import {SafeAreaView, Linking, Platform, BackHandler} from 'react-native';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import VersionCheck from 'react-native-version-check';
import SafariView from 'react-native-safari-view';
import {activateErrorPopup} from "../../src/module/formatter";
import Wrapper from '../../src/component/atom/Wrapper';
import Text from '../../src/component/atom/Text';
import Img from '../../src/component/atom/Img';

const currentVersion = VersionCheck.getCurrentVersion().trim();

const SplashScreen = ({navigation}: NavigationStackScreenProps) => {
  useEffect(() => {
    setTimeout(() => {
      getAvailablePartnersAppVersions();
    }, 550);
  }, []);

  const getAvailablePartnersAppVersions = useCallback(() => {
    fetch('https://storage.googleapis.com/handle-common-code/carmerce-customers-app-version.json')
        .then((res) => res.json())
        .then((res) => {
          if (res) {
            let version;
            if (Platform.OS === 'android') {
              version = res?.availableAndroidVersion;
            } else {
              version = res?.availableIosVersion;
            }
            version ? updateAlert(version) : passStore();
          }
        })
        .catch((err) => {
          console.log(err);
          passStore();
        });
  }, []);

  const updateAlert = useCallback((version: string) => {
    VersionCheck.needUpdate({
      currentVersion: currentVersion,
      latestVersion: version
    }).then((res) => {
      if (res?.isNeeded) {
        activateErrorPopup(navigation, '필수 업데이트가 있습니다. 업데이트하세요.', () => goStore());
      } else {
        void passStore();
      }
    });
  }, []);

  const goStore = useCallback(() => {
    BackHandler.exitApp(); // 앱 종료
    if (Platform.OS === 'android') {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.carmerce.carmerceUser');
    } else {
      void SafariView.show({url: 'https://apps.apple.com/us/app/doorhub-driver/1616804096'});
    }
  }, []);

  const passStore = useCallback(() => {
    navigation.replace('Gnb');
  }, []);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', position: 'relative', backgroundColor: '#007bff'}}>
      <Wrapper w flex={1}>
        <Wrapper w h flex={5} mt={80}>
          <Img src={require('../../public/image/logo/ic_launcher.png')} />
          <Text mt={20} size={13} weight="thick" letterSpacing={3} color="white" mb={100}>
            CARMERCE
          </Text>
        </Wrapper>
        <Wrapper w flex={1}>
          <Text size={11} weight="bold" color="#c0c7d9" mb={60} mt="auto">
            ver. {currentVersion}
          </Text>
        </Wrapper>
      </Wrapper>
    </SafeAreaView>
  );
};

export default SplashScreen;
