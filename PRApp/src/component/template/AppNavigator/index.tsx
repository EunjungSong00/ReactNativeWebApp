import React, {useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../../../../screen/splash/SplashScreen';
import Gnb from './Gnb';
import {defaultNavOption} from './resource';
import screenStack from './resource/screenStack';
import useErrorPopupEl from '../../../hook/useErrorPopupEl';

const AppNavigator = () => {
  const AppContainer = createNativeStackNavigator();
  const errorPopup = useErrorPopupEl();
  const listeners = useCallback(
    ({route, navigation}): any => {
      // console.log('route', route);
      route && route.params && route.params.errorMessage ? errorPopup.handlePopupWithNavigation(route, navigation) : null;
    },
    [errorPopup.errorMessage]
  );

  const {MainScreen, SearchScreen, HotDealScreen, CartScreen, MyPageScreen, ...notGnbScreens} = screenStack;

  return (
    <>
      <NavigationContainer>
        <AppContainer.Navigator initialRouteName="SplashScreen">
          <AppContainer.Screen name="SplashScreen" component={SplashScreen} options={defaultNavOption} listeners={listeners} />
          <AppContainer.Screen name="Gnb" component={Gnb} options={defaultNavOption} listeners={listeners} />
          {Object.entries(notGnbScreens).map(([screenName, screenComponent], key) => (
            <AppContainer.Screen name={screenName} component={screenComponent} options={defaultNavOption} key={key} listeners={listeners} />
          ))}
        </AppContainer.Navigator>
      </NavigationContainer>
      <errorPopup.Element />
    </>
  );
};

export default AppNavigator;
