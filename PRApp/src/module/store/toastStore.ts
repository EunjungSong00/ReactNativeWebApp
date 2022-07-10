import {makeAutoObservable} from "mobx";

class ToastStore {
    message = '';
    constructor() {
        makeAutoObservable(this);
    }

    setToastMessage = (_message: string) => {
        this.message = _message;
    };
}

export default ToastStore
