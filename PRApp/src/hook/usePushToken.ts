import {useEffect} from "react";
import messaging from "@react-native-firebase/messaging";
import {useStores} from "../module/store";

export  default  function usePushToken() {
    const {userInfoStore} = useStores();
    // -- APP Push & Notification start --//
    // TODO - 1- 2. 서버에서 보낼 token
    useEffect(() => {
        async function getToken() {
            try {
                if (!messaging().isDeviceRegisteredForRemoteMessages) {
                    // await messaging().registerDeviceForRemoteMessages();
                }
                const token = await messaging().getToken();
                console.log('phone token:', token);
                // await setStorage('phoneToken', token);
                userInfoStore.setCarmercePhoneToken(token);
                // return axios.post(`${Config.API_URL}/phonetoken`, {token});

            } catch(error) {
                console.error(error);
            }
        }
        getToken();
    }, []);
    // -- APP Push & Notification end --//
}
