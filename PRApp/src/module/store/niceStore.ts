import {makeAutoObservable} from "mobx";

class NiceStore {
    email = '';
    encodeData = '';
    fail = false;
    constructor() {
        makeAutoObservable(this);
    }

    setNiceEmail = (_email: string) => {
        this.email = _email;
    };
    setNiceEncodeData = (_encodeData: string) => {
        this.encodeData = _encodeData;
    };
    setNiceFail = (_fail: boolean) => {
        this.fail = _fail;
    };
}

export default NiceStore;
