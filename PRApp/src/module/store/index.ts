import React from 'react';
import toastStore from './toastStore';
import PaymentStore from "paymentStore";
import ShippingStore from "shippingStore";
import VehicleStore from "vehicleStore";
import UserStore from "userStore";
import NiceStore from "niceStore";
import RefundStore from "refundStore";
// import createShippingStore from './shippingStore';

class RootStore {
    toastStore: toastStore;
    paymentStore: PaymentStore;
    shippingStore: ShippingStore;
    vehicleStore: VehicleStore;
    userInfoStore: UserStore;
    niceStore: NiceStore;
    refundStore: RefundStore;
    constructor() {
        this.toastStore = new toastStore(this);
        this.paymentStore = new PaymentStore(this);
        this.shippingStore = new ShippingStore(this);
        this.vehicleStore = new VehicleStore(this);
        this.userInfoStore = new UserStore(this);
        this.niceStore = new NiceStore(this);
        this.refundStore = new RefundStore(this);
    }
}
const StoresContext = React.createContext(new RootStore());

export const useStores = () => React.useContext(StoresContext);

// export default {
//     shippingStore : createShippingStore(),
// }
