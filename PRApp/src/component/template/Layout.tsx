import React, {ReactElement, useEffect, useRef} from 'react';
import {KeyboardAvoidingView, Platform, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStores} from '../../module/store';
import Toast from '../atom/Toast';
import {observer} from 'mobx-react';
import PaymentTypePopup from '../../../screen/payment/PaymentTypePopup';

const Layout = ({children, keyboardView}: {children: ReactElement; keyboardView?: boolean}) => {
  const toastRef = useRef<any>(null);
  const {toastStore} = useStores();
  useEffect(() => {
    if (toastStore.message) {
      toastRef.current.show(toastStore.message);
      setTimeout(() => {
        toastStore.setToastMessage('');
      }, 2000);
    }
  }, [toastStore.message]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {keyboardView ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}} keyboardVerticalOffset={0}>
          <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} translucent={false} hidden={false} />
          {children}
          <Toast ref={toastRef} />
        </KeyboardAvoidingView>
      ) : (
        <>
          <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} translucent={false} hidden={false} />
          {children}
          <Toast ref={toastRef} />
        </>
      )}
    </SafeAreaView>
  );
};

export default observer(Layout);
