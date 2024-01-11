import { DeviceInfo } from '../device-info';
import { AirboltsViewType } from './state';

export type LoadingMutationType = ({ loading, message }: { loading: boolean; message?: string }) => void;
export type SetViewTypeMutationType = ({ type }: { type: AirboltsViewType }) => void;
export type SetDeviceMutationType = ({ device }: { device: DeviceInfo | null }) => void;
export type SetDevicesMutationType = ({ devices }: { devices: DeviceInfo[] }) => void;
