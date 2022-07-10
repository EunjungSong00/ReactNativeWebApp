import {makeAutoObservable} from "mobx";

class ShippingStore {
    zipcode = '';
    fullAddress = '';
    detailAddress = '';
    receiverName = '';
    receiverPhoneNumber = '';
    shippingId = '';
    shippingDate = '';

    constructor() {
        makeAutoObservable(this);
    }

    setZipcode = (_zipcode: string) => {
        this.zipcode = _zipcode;
    };
    setFullAddress = (_fullAddress: string) => {
        this.fullAddress = _fullAddress;
    };
    setDetailAddress = (_detailAddress: string) => {
        this.detailAddress = _detailAddress;
    };
    setReceiverName = (_receiverName: string) => {
        this.receiverName = _receiverName;
    };
    setReceiverPhoneNumber = (_receiverPhoneNumber:string) => {
        this.receiverPhoneNumber = _receiverPhoneNumber;
    };
    setShippingId = (_shippingId: any) => {
        this.shippingId = _shippingId;
    }
    setShippingDate = (_shippingDate: any) => {
        this.shippingDate = _shippingDate;
    }
}

export default ShippingStore
