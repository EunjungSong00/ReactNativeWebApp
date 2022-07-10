import {makeAutoObservable} from "mobx";
import {EPurpose} from "../../api/payment/upsertJointOwnershipApi";

interface IDeliveryPrice {
    distance: string; //거리
    price: string; //예상비용
    additionalPrice: string; //예상 추가비용
    startLat: string; //시작위치 위도
    startLon: string; //시작위치 경도
    endLat: string; //도착위치 위도
    endLon: string; //도착위치 경도
    deliveryAddressStart: string; //출발 주소
    deliveryAddressEnd: string; //도착 주소
}

interface IDriverLicense {
    name?: string; // 이름
    driversLicenseNumber?: string; // 운전면허번호
    residentRegistrationNumber?: string; // 주민등록번호
    fullAddress?: string; //주소
    issueDate?: string; // 발급일자
}

interface IAuthentication {
    name?: string;
    phoneNumber?: string;
    residentRegistrationNumber7?: string;
}

export interface IJointOwnership {
    name?: string; // 공동명의자
    phoneNumber?: string; // 휴대폰번호
    residentRegistrationNumber?: string; // 주민등록번호
    shareRatioOwner?: string; // 지분율-명의자
    shareRatioJointOwner?: string; // 지분율-공동명의자
    purpose?: EPurpose | string; // 공동명의목적
    purposeEtc?: string; // 기타일때 목적 text
}

export interface IRefundAccount {
    accountNumber?: string; // 계좌번호
    bankCode?: string; // 은행코드
    name?: string; // 이름
}

interface ILoanAdditionalInfo { // 대출추가정보
    annualIncome?: string; //연소득
    housingType?: string; //주거형태
    isOwnACar?: string; //차량소유여부
    typeHomeOwnership?: string; //주택소유형태
}

interface ILoanInfo {
    loanAmount?: string; // 대출금액
    loanTerm?: string; // 대출기간
    vehicleId?: string; // 차량 아이디
    loanBankCode?: string; // 대출은행
    loanProductId?: string; // 대출상품 아이디
}

interface ILoanPersonalInfo {
    isLocalYn?: 'Y' | 'N'; // 내국인여부 Y/N
    isOwnDriverLicenseYn?: 'Y' | 'N'; // 운전면허소지여부 Y/N
    isPersonalYn?: string; // 개인여부 Y/N
    name?: string; // 이름
    phoneNumber?: string; // 휴대폰번호
}

class PaymentStore {
    select = ''; // 현금, 현대, 대출
    orderId = ''; // 구매하기 클릭시 받는 id
    typeName = ''; // 개인, 개인사업자, 법인
    typePublic = false; // 공동명의
    carmerceUser = {
        name: ''
    };
    deliveryPrice = {
        price: '',
        distance: '',
        addressEnd: '',
        desiredTime: '',
        recipientName: '',
        recipientPhoneNumber: '',
        zipCode: '',
        detailAddress: '',
        deliveryPriceNo: '',
        vAmount: ''
    };
    driverLicense = {
        name: '',
        driversLicenseNumber: '',
        residentRegistrationNumber: '',
        fullAddress: '',
        issueDate: ''
    };
    authentication = {};
    jointOwnership = {
        name: '',
        phoneNumber: '',
        residentRegistrationNumber: '',
        shareRatioOwner: '',
        shareRatioJointOwner: '',
        purpose: '',
        purposeEtc: '',
    };
    refundAccount = {
        accountNumber: '',
        bankCode: '',
        name: ''
    };
    loanAdditionalInfo = {};
    loanInfo = {};
    loanPersonalInfo = {};
    constructor() {
        makeAutoObservable(this);
    }

    setPaymentSelect = (_select: string) => {
        this.select = _select;
    };
    setPaymentOrderId = (_orderId: string) => {
        this.orderId = _orderId;
    };
    setPaymentTypeName = (_typeName: string) => {
        this.typeName = _typeName;
    };
    setPaymentTypePublic = (_typePublic: boolean) => {
        this.typePublic = _typePublic;
    };
    setCarmerceUser = (_carmerceUser: any) => {
        this.carmerceUser = _carmerceUser;
    };
    setPaymentDeliveryPrice = (_deliveryPrice: IDeliveryPrice) => {
        this.deliveryPrice = _deliveryPrice;
    };
    setPaymentDriverLicense = (_driverLicense: IDriverLicense) => {
        this.driverLicense = _driverLicense;
    };
    setPaymentAuthentication = (_authentication: IAuthentication) => {
        this.authentication = _authentication;
    };
    setJointOwnership = (_jointOwnership: IJointOwnership) => {
        this.jointOwnership = _jointOwnership;
    };
    setRefundAccount = (_refundAccount: IRefundAccount) => {
        this.refundAccount = _refundAccount;
    };
    setPaymentLoanInfo = (_loanInfo: ILoanInfo) => {
        this.loanInfo = _loanInfo;
    };
    setPaymentLoanAdditionalInfo = (_loanAdditionalInfo: ILoanAdditionalInfo) => {
        this.loanAdditionalInfo = _loanAdditionalInfo;
    };
    setPaymentLoanPersonalInfo = (_loanPersonalInfo: ILoanPersonalInfo) => {
        this.loanPersonalInfo = _loanPersonalInfo;
    };
    setPaymentReset = () => {
        this.carmerceUser = {};
        this.driverLicense = {};
        this.authentication = {};
        this.jointOwnership = {};
        this.refundAccount = {};
        this.loanInfo = {};
        this.loanAdditionalInfo = {};
        this.loanPersonalInfo = {};
    }
}

export default PaymentStore
