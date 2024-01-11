import { QueryParams, axiosInstance } from './req';

export const getHistoryForMap = async (deviceUuid: string, { perPage }: QueryParams): Promise<any> => {
    return axiosInstance.get(`/api/history/map/${deviceUuid}`, { params: { perPage } }).then(({ data }) => data);
};

export const getDeviceHistory = async (deviceUuid: string, { page, perPage, filter }: QueryParams): Promise<any> => {
    return axiosInstance
        .get(`/api/history/find/device/${deviceUuid}`, { params: { page, perPage, filter } })
        .then(({ data }) => data);
};
