import { DeviceInfo } from '@/types/device-info';

export const filterDevicesByType = (devices: DeviceInfo[], deviceType: string): DeviceInfo[] => {
    return deviceType === '' || deviceType === 'all'
        ? devices
        : devices.filter((device) => device.deviceType === deviceType);
};

export const get_edrx_status = (device: DeviceInfo) => {
    return device?.gps_value && device?.edrx_ptw
        ? device?.gps_value > 0 && device?.edrx_ptw > 0
            ? `On - ${device?.gps_value}`
            : 'Off'
        : 'N/A';
};

export const get_psm_status = (device: DeviceInfo) => {
    return device?.psm_tau && device?.psm_active_time
        ? device?.psm_tau > 0 && device?.psm_active_time > 0
            ? `On - ${device?.psm_tau}`
            : 'Off'
        : 'N/A';
};

export const get_operating_mode = (device: DeviceInfo) => {
    if (device.operatingMode === 'batteryLife') {
        return device?.psm_tau && device?.psm_active_time
            ? device?.psm_tau > 0 && device?.psm_active_time > 0
                ? 'Available / On'
                : 'Available / Off'
            : 'Unavailable in your region';
    } else {
        return device?.gps_value && device?.edrx_ptw
            ? device?.gps_value > 0 && device?.edrx_ptw > 0
                ? 'Available / On '
                : 'Available / Off'
            : 'Unavailable in your region';
    }
};

export const validatePrivilege = (privilege: number, privileges: number[] = []) => {
    if (privileges.length === 0) return true;
    return privileges.includes(privilege);
};
