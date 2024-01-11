import { axiosInstance, getUrl } from './req';
import { getHistoryForMap, getDeviceHistory } from './history-api';
import {
    loadDevices,
    updateDevice,
    updateGeoFence,
} from './devices-api';

export function setAuthToken(token: string | null) {
    axiosInstance.defaults.headers.common['Authorization'] = token || '';
}

export default {
    axiosInstance,
    getUrl,
    setAuthToken,

    getHistoryForMap,
    getDeviceHistory,
    loadDevices,
    updateDevice,

    updateGeoFence,
};
