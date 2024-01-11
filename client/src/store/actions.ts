import Vue from 'vue';
import _get from 'lodash.get';
import { actions, mutations } from './types';
import { ActionState } from '@/types/store/state';
import router from '@/router';
import api from '@/modules/api';
import { DeviceInfo } from '@/types/device-info';
import { getErrorMessage } from '@/utils/common';

const loadDevices = async ({ state, commit }: ActionState) => {
    commit(mutations.LOADING, { loading: true });
    commit(mutations.SET_DEVICES_FETCHED, { devicesFetched: false });
    try {
        const devices = await api.loadDevices({ page: 0, perPage: 999 }, state.selectedDeviceType, state.searchName);

        // set selected device
        const { device } = state;
        const index = devices.findIndex((currentdevice) => currentdevice._id === device?._id);
        if (devices.length == 0) {
            commit(mutations.SET_CURRENT_DEVICE, { device: null });
        } else if (device === null || index === -1) {
            commit(mutations.SET_CURRENT_DEVICE, { device: devices[0] });
            router.push({ name: 'device-overview', params: { deviceUUID: devices[0].deviceUUID as string } });
        }

        commit(mutations.SET_DEVICES, { devices });
        // commit(mutations.SET_ALL_DEVICES, { allDevices: devices });
    } catch (error) {
        Vue.toasted.error(getErrorMessage(error, 'Unable to load devices'));
    } finally {
        commit(mutations.LOADING, { loading: false });
        commit(mutations.SET_DEVICES_FETCHED, { devicesFetched: true });
    }
};

const updateDevice = async (
    { commit, state }: ActionState,
    { device, message }: { device: Partial<DeviceInfo>; message: string | undefined },
): Promise<DeviceInfo | null> => {
    commit(mutations.LOADING, { loading: true, message });
    try {
        const updated = await api.updateDevice(device);

        // set selected device
        commit(mutations.SET_CURRENT_DEVICE, { device: updated });

        // set filtered devices
        const devices = [...state.devices];
        const index = devices.findIndex((device) => device._id === updated._id);
        devices.splice(index, 1, updated);
        commit(mutations.SET_DEVICES, { devices });

        Vue.toasted.success(`Saved successfully`);
        return updated;
    } catch (error) {
        console.error(_get(error, 'response'));
        Vue.toasted.error(`Unable to update device: ${_get(error, 'response.data.message', 'internal error')}`);
    } finally {
        commit(mutations.LOADING, { loading: false });
    }

    return null;
};

export default {
    [actions.LOAD_DEVICES]: loadDevices,
    [actions.UPDATE_DEVICE]: updateDevice,
};
