import { UserInfo, AuthToken } from '../user-info';
import { Commit } from 'vuex';
import { DeviceInfo } from '../device-info';

export enum DeviceViewType {
    Carousel = 'carousel',
    Tiles = 'tiles',
    Grid = 'grid',
}

export enum AirboltsViewType {
    Combo = 'combo',
    Grid = 'grid',
    List = 'list',
}

export interface State {
    loading: boolean;
    loadingMessage?: string;

    user: UserInfo | null;
    token: AuthToken;

    viewType: AirboltsViewType;

    deviceView: DeviceViewType;

    device: DeviceInfo | null;
    devices: DeviceInfo[];
    devicesFetched: boolean;
    selectedDeviceType: string;
    allDevices: DeviceInfo[];
    searchName: string;
}

export interface ActionState {
    commit: Commit;
    state: State;
}
