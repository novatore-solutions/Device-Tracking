import { QueryParams, axiosInstance } from './req';

export const getHistoryForMap = async (deviceUuid: string, { perPage }: QueryParams): Promise<any> => {
    return axiosInstance.get(`/api/device-history/${deviceUuid}`, { params: { perPage } }).then(({ data }) => data);
};

export const getDeviceHistory = async (deviceUuid: string, { page, perPage, filter }: QueryParams): Promise<any> => {
    return axiosInstance
        .get(`/api/find-device-history/${deviceUuid}`, { params: { page, perPage, filter } })
        .then(({ data }) => data);
};
