import { mutations } from './types';
import { AirboltsViewType, State } from '@/types/store/state';
import { UserInfo } from '@/types/user-info';
import { DeviceInfo } from '@/types/device-info';

export default {
    [mutations.LOADING]: (state: State, { loading, message }: { loading: boolean; message?: string }) => {
        state.loading = loading;
        state.loadingMessage = message;
    },

    [mutations.SET_AUTH_TOKEN]: (state: State, { token }: { token: string | null }) => {
        state.token = token;
    },

    [mutations.SET_USER]: (state: State, { user }: { user: UserInfo | null }) => {
        state.user = user;
    },

    [mutations.SET_VIEW_TYPES]: (state: State, { type }: { type: AirboltsViewType }) => {
        state.viewType = type;
    },

    [mutations.SET_CURRENT_DEVICE]: (state: State, { device }: { device: DeviceInfo | null }) => {
        state.device = device;
    },

    [mutations.SET_DEVICES]: (state: State, { devices }: { devices: DeviceInfo[] }) => {
        state.devices = devices || [];
    },
    [mutations.SET_DEVICES_FETCHED]: (state: State, { devicesFetched }: { devicesFetched: boolean }) => {
        state.devicesFetched = devicesFetched;
    },
    [mutations.SET_SELECTED_DEVICE_TYPE]: (state: State, { selectedDeviceType }: { selectedDeviceType: string }) => {
        state.selectedDeviceType = selectedDeviceType;
    },
    [mutations.SET_ALL_DEVICES]: (state: State, { allDevices }: { allDevices: DeviceInfo[] }) => {
        state.allDevices = allDevices || [];
    },
    [mutations.SET_SEARCH_NAME]: (state: State, { searchName }: { searchName: string }) => {
        state.searchName = searchName;
    },
};
