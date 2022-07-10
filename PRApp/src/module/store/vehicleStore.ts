import {makeAutoObservable} from "mobx";

class vehicleStore {
    vehicleId = '';
    vehicleInfo = '';
    vehicleIncidentalExpense = '';

    constructor() {
        makeAutoObservable(this);
    }

    setVehicleId = (_vehicleId: any) => {
        this.vehicleId = _vehicleId
    }

    setVehicleInfo = (_vehicleInfo: any) => {
        this.vehicleInfo = _vehicleInfo;
    }

    setVehicleIncidentalExpense = (_vehicleIncidentalExpense : any) => {
        this.vehicleIncidentalExpense = _vehicleIncidentalExpense;
    }
}

export default vehicleStore
