import { AirboltsViewType, DeviceViewType, State } from '@/types/store/state';

export const state: State = {
    loading: false,
    loadingMessage: '',

    user: null,
    token: null,

    viewType: AirboltsViewType.Combo,

    deviceView: DeviceViewType.Carousel,

    device: null,
    devices: [],

    devicesFetched: false,
    selectedDeviceType: 'all',
    allDevices: [],
    searchName: '',
};
