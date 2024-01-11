import { Dictionary } from '@/types/base';
import dayjs from 'dayjs';

export enum ProximityAlert {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export enum DeviceType {
    AirboltTravelLock = 'airbolt',
    AirboltCard = 'shield_card',
    AirboltGps = 'shield_gps',
}

export enum GPSReportModes {
    Once = 'once',
    Continuously = 'continuously',
}

// export interface ModemInfo {
//     voltage: number;
//     temperature: number;
//     modem_state: number;
//     timeCreated?: Date;
// }

export interface CommonAlertSettings {
    enable: boolean;
    sendLocation: boolean;
    reAlertDuration: number;
}

export interface geoFenceSetting {
    enable: boolean;
    liveTrackingUnable: boolean;
    trackingTime: number;
}
export interface AccelerometerInterface extends CommonAlertSettings {
    ultraPowerMode: boolean;
    sensitivity: number;
    duration: number;
}

export interface TemperatureInterface extends CommonAlertSettings {
    condition: string;
    level: number;
    unit: string;
}

export interface EsimInterface {
    _id?: string;
    iccid: string;
    eid: string;
    status: string;
    createdAt?: Date;
    updateAt?: Date;
}

export interface DeviceInfo {
    _id?: string;
    deviceUUID: string;
    imei?: string;
    deviceType: DeviceType;
    name: string;
    devicePicture: string;
    deleted: boolean;
    userId: string;
    timeCreated?: Date;
    lastSeenTime?: Date;
    alertLevel: number;
    tone: number;
    markAsLost: boolean;
    passcode: string;
    shares: SharedDeviceInfo[];
    proximity?: ProximityAlert;
    scheduleReportInterval?: number;
    listenToLock: boolean;
    locationUpdateNotification: boolean;
    sosAlertNotification: boolean;
    tsaAccessible: boolean;
    emergencyMode: boolean;
    share_count: number;
    isTrialAvailed: boolean;
    batteryLevel: string;
    color?: string;
    locationReportMode: string;
    scheduleReport?: string[];
    ledFlash?: boolean;
    temperature?: TemperatureInterface;
    accelerometer?: AccelerometerInterface;
    waterAlarm?: CommonAlertSettings;
    pushNotification?: boolean;
    emailAlerts?: boolean;
    notificationEmails?: string[];
    alarm?: boolean;
    modem_voltage?: number;
    modem_temperature?: number;
    modem_state?: number;
    // modemInfo?: ModemInfo;
    operatingMode?: string;
    subscription?: any;
    psm_tau?: number;
    psm_active_time?: number;
    gps_value?: number;
    edrx_ptw?: number;
    privilege: number;
    cellRequestsCount?: number;
    cellScanLimit?: string;
    mapBoundaryPoints?: number[][];
    geoFence?: geoFenceSetting;
}

export interface SharedDeviceInfo {
    _id?: string;
    timeCreated?: Date;
    userId: string;
    deviceUUID: string;
    masterKey: string;
    isOwnerFlag: number;
    accessRightsFlag: number;
    securityLevel: number;
    sharedUserWithEmail: string;
    sharerName: string;
    isAcceptedFlag: number;
    startDate: Date;
    expiryDate: Date;
    message?: string;
    createdAt?: Date;
    updateAt?: Date;
}

export const ACCESS_LEVEL_LIMITED = 2;
export const ACCESS_LEVEL_UNRESTRICTED = 1;

export const getDefaultShareInfo = (overloads: Dictionary = {}): SharedDeviceInfo => ({
    userId: '',
    deviceUUID: '',
    masterKey: '',
    isOwnerFlag: 0,
    accessRightsFlag: 1,
    securityLevel: 1,
    sharedUserWithEmail: '',
    sharerName: '',
    isAcceptedFlag: 0,
    startDate: new Date(),
    expiryDate: dayjs().add(1, 'month').toDate(),
    message: '',
    ...overloads,
});

export interface DeviceMapData {
    userId?: string;
    deviceUUID?: string;
    latLongs?: number[][];
    active?: boolean;
}
