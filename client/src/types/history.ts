import { locationType } from '@/constants/locationHistory';

export interface HistoryData {
    latitude: number;
    longitude: number;
    address: string;
    timeCreated: Date;
    isLocked: boolean;
    unlockType: number;
    timestamp?: number;
    type?: locationType;
    modem_temperature?: number;
    modem_temperature_f?: number;
    modem_temperature_c?: number;
    modem_voltage?: number;
    alertType?: string;
    duration?: number;
}
