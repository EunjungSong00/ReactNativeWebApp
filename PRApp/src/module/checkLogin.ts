import {getStorage} from "manageAsyncStorage";

/* 로그인 체크 */
const checkLogin = async (e: any, navigation: any) => {
    const token = await getStorage('token');
    if (!token?.accessToken) {
        e.preventDefault();
        navigation.navigate('LoginScreen');
    }
}

export default checkLogin;