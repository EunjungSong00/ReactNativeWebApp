import {makeAutoObservable} from "mobx";

class RefundStore {
    orderId = '';
    address = {};
    reason = {};
    info = {};
    constructor() {
        makeAutoObservable(this);
    }

    setOrderId = (_orderId: any) => {
        this.orderId = _orderId;
    };
    setAddress = (_address: any) => {
        this.address = _address;
    };
    setReason = (_reason: any) => {
        this.reason = _reason;
    };
    setInfo = (_reason: any) => {
        this.reason = _reason;
    };
}

export default RefundStore;
