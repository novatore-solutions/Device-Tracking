import { QueryParams, axiosInstance } from './req';
import { DeviceInfo } from '@/types/device-info';

export const loadDevices = async (
    { page, perPage, filter }: QueryParams,
    deviceType: string,
    name: string,
): Promise<DeviceInfo[]> => {
    let url = `/api/get-devices`;
    if (deviceType && deviceType != 'all') {
        url = `${url}?type=${deviceType}${name ? `&name=${name}` : ''}`;
    } else if (name) {
        url = `${url}?name=${name}`;
    }
    return axiosInstance.get(url, { params: { page, perPage, filter } }).then(({ data }) => data);
};

export const updateDevice = async (device: Partial<DeviceInfo>): Promise<DeviceInfo> => {
    return axiosInstance.put(`/api/update-devices/${device._id}`, device).then(({ data }) => data);
};

export const updateGeoFence = async (deviceUUID: string, value: string) => {
    return axiosInstance.put(`/api/devices/geo-fence/${deviceUUID}/${value}`).then(({ data }) => data);
};

export const deleteGeoFence = async (deviceUUID: string) => {
    return axiosInstance.delete(`/api/delete-devices/geo-fence/${deviceUUID}`).then(({ data }) => data);
};
