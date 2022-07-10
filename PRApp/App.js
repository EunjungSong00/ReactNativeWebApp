import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import Layout from '@component/template/Layout';
import stores from './src/module/store';
import {observer, Provider} from 'mobx-react';
import usePushToken from './src/hook/usePushToken';
import AppNavigator from './src/component/template/AppNavigator';
import {ErrorBoundary} from 'react-error-boundary';
import ExceptionScreen from './screen/errorBoundary/ExceptionScreen';

// handleAppPush();
// 애뮬레이터 하단의 경고 및 에러박스 숨기기
LogBox.ignoreAllLogs();

const App = () => {
  // usePushToken();
  return (
    <ErrorHandler>
      <Provider {...stores}>
        <Layout>
          <AppNavigator />
        </Layout>
      </Provider>
    </ErrorHandler>
  );
};

export default observer(App);

const myErrorHandler = (error) => {
  console.log('Error handler', error);
};

const ErrorFallbackComponent = (props) => {
  console.log('Error component', props);
  return <ExceptionScreen />;
};

const ErrorHandler = ({children}) => (
  <ErrorBoundary FallbackComponent={ErrorFallbackComponent} onError={myErrorHandler}>
    {children}
  </ErrorBoundary>
);
