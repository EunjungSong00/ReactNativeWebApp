import {makeAutoObservable} from "mobx";

interface IUserToken {
    accessToken: string;
    refreshToken: string;
}

class UserStore {
    userToken = {
        accessToken: '',
        refreshToken: '',
    };

    carmerceUser: any = {
        birthDate: '',
        id: '',
        email: '',
        name: '',
        phoneNumber: '',
    };

    carmercePhoneToken: any = '';

    constructor() {
        makeAutoObservable(this);
    };

    setUserToken = (_userToken: IUserToken) => {
        this.userToken = _userToken;
    };

    setCarmerceUser = (_carmerceUser: any) => {
        this.carmerceUser = _carmerceUser;
    };

    setCarmercePhoneToken = (_carmercePhoneToken : any) => {
        this.carmercePhoneToken = _carmercePhoneToken;
    };
}

export default UserStore;
