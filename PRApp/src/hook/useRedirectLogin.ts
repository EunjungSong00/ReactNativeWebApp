import {activateErrorPopup} from '../module/formatter';
import {useEffect} from 'react';
import {getStorage} from '../module/manageAsyncStorage';
import {StackNavigationProp} from 'react-navigation-stack/src/vendor/types';

const checkLogin = async (): Promise<boolean> => !!(await getStorage('carmerceUser'));

const useRidirectLogin = (navigation: StackNavigationProp): void => {
  useEffect(() => {
    // navigation && activateErrorPopup(navigation, '로그인 화면으로 이동합니다.', () => navigation.replace('LoginScreen'));
    // checkLogin().then((isLogin: boolean) => {
    //   console.log('isLogin', isLogin);
    //   !isLogin && navigation && activateErrorPopup(navigation, '로그인 화면으로 이동합니다.', () => navigation.replace('LoginScreen'));
    // });
  }, []);
};
export default useRidirectLogin;
