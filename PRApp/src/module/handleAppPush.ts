
// -- APP Push & Notification start --//
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import {setStorage} from "manageAsyncStorage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";


export  default  function handleAppPush() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });


    PushNotification.configure({
        // (optional) 토큰이 생성될 때 실행됨(토큰을 서버에 등록할 때 쓸 수 있음)
        onRegister: async function (token) {
            // console.log('token : ', token); // <- // TODO - 2. 서버에서 보낼 것 token
            await setStorage('appToken', token);
        },


        // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
        onNotification: function (notification) {
            console.log('NOTIFICATION:', notification); // 원하는 정보를 넣을 수 있음 제목, 내용, 데이터, URL
            const {data} = notification;
            // {
            // "channelId": "fcm_fallback_notification_channel",
            // "color": null,
            // "data": {},
            // "finish": [Function finish],
            // "foreground": true,
            // "id": "332378427",
            // "message": "오후 테스트",
            // "priority": "high",rr
            // "smallIcon": "ic_notification",
            // "sound": null,
            // "tag": "campaign_collapse_key_6275681157255636338",
            // "title": "오후 테스트",
            // "userInteraction": false,
            // "visibility": "private"
            // }

            // process the notification
            // if (notification.channelId === 'subscriberId') {
            //   if (notification.massage || notification.data.message) { // 푸시 내용
            //     console.log('푸시 내용');
            //   }
            // }
            // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행 (아이폰에서는 필요)
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) 등록한 액션을 누렀고 invokeApp이 false 상태일 때 실행됨, true면 onNotification이 실행됨 (Android)
        onAction: function (notification) {
            console.log('ACTION:', notification.action); // notification action 볼 것
            console.log('NOTIFICATION:', notification);

            // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function (err) {
            console.error(err.message, err);
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,

    });

// 채널이 중요함 - 여러개 만듦 가능
// TODO - 2. 서버에서 보낼 것 ChannelId
    PushNotification.createChannel(
        {
            channelId: 'subscriberId',
            channelName: '광고',
            channelDescription: '앱 실행하는 알림',
            soundName: 'default',
            importance: 4, // (optional) default: 4. Int value of the Android notification importanc정e
            vibrate: true
        },
        (created) => console.log(`createChennel subscriberId returend '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );

    PushNotification.createChannel(
        {
            channelId: 'notificationId',
            channelName: '공지사항용',
            channelDescription: '앱 실행하는 알림',
            soundName: 'default',
            importance: 3, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true
        },
        (created) => console.log(`createChennel notificationId returend '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.localNotification({
        channelId: 'subscriberId',
        message: 'noti message'
    })
// -- APP Push & Notification end --//

}
