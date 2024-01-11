import { DeviceInfo } from '../device-info';
import { UserInfo } from '../user-info';

export type LoadDeviceActionType = ({ deviceUUID }: { deviceUUID: string }) => Promise<DeviceInfo>;
export type LoadDevicesActionType = () => Promise<DeviceInfo[]>;
export type UpdateDeviceActionType = ({ device }: { device: Partial<DeviceInfo> }) => Promise<DeviceInfo>;
export type UpdateUserActionType = ({ user }: { user: Partial<UserInfo> }) => Promise<boolean>;
