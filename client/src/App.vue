<template>
    <v-app>
        <!-- <drawer v-if="!hideControls" /> -->

        <v-main>
            <router-view></router-view>
        </v-main>

        <!-- <loader></loader> -->
    </v-app>
</template>

<style lang="scss">
@import '../node_modules/typeface-roboto/index.css';
@import '../node_modules/leaflet/dist/leaflet.css';
@import './scss/app.scss';

.v-menu__content {
    z-index: 9999 !important;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action, Getter, State, Mutation } from 'vuex-class';
import TopNavBar from '@/components/app/TopNavBar.vue';
import Loader from '@/components/Loader.vue';
// import Drawer from '@/components/app/Drawer.vue';
import { actions, mutations } from './store/types';
import { LoadDevicesActionType } from './types/store/actions';
import { UserInfo } from './types/user-info';
import { DeviceInfo, DeviceType } from '@/types/device-info';
import { SetDeviceMutationType, SetDevicesMutationType } from '@/types/store/mutations';

@Component({
    components: {
        Loader,
        // Drawer,
        TopNavBar,
    },
})
export default class App extends Vue {
    @Getter('isLoggedOn')
    readonly isLoggedOn!: boolean;

    @State('devices')
    devices!: DeviceInfo[];

    @State('user')
    user!: UserInfo;

    @State('device')
    current!: DeviceInfo;

    @Action(actions.LOAD_DEVICES)
    loadDevices!: LoadDevicesActionType;

    @Mutation(mutations.SET_CURRENT_DEVICE)
    setCurrentDevice!: SetDeviceMutationType;

    @Mutation(mutations.SET_DEVICES)
    setDevices!: SetDevicesMutationType;

    protected socket: any = null;
    protected reconnectSchedule: any = null;
    DeviceTypeenum = DeviceType;


    UpdateDeviceDetails(data: DeviceInfo) {
        const updatedDevices = this.devices.map((item) => {
            if (item.imei && item.imei === data.imei)
                return {
                    ...item,
                    lastSeenTime: data.lastSeenTime,
                    modem_state: data.modem_state,
                    modem_temperature: data.modem_temperature,
                    modem_voltage: data.modem_voltage,
                    psm_tau: data.psm_tau,
                    psm_active_time: data.psm_active_time,
                    gps_value: data.gps_value,
                    edrx_ptw: data.edrx_ptw,
                };
            return item;
        });
        this.setDevices({ devices: updatedDevices });

        if (this.current.imei && data.imei === this.current.imei)
            this.setCurrentDevice({
                device: {
                    ...this.current,
                    lastSeenTime: data.lastSeenTime,
                    modem_state: data.modem_state,
                    modem_temperature: data.modem_temperature,
                    modem_voltage: data.modem_voltage,
                    psm_tau: data.psm_tau,
                    psm_active_time: data.psm_active_time,
                    gps_value: data.gps_value,
                    edrx_ptw: data.edrx_ptw,
                },
            });
    }

    getGPSDevicesIMEI = (devicesList: DeviceInfo[]) => {
        const list: string[] = [];
        devicesList.map((item: DeviceInfo) => {
            if (item.deviceType === this.DeviceTypeenum.AirboltGps && item.imei) list.push(item.imei);
        });
        return list;
    };

    resetInterval() {
        clearInterval(this.reconnectSchedule);
        this.reconnectSchedule = null;
    }

    mounted(){
        this.loadDevices();        
    }

    @Watch('devices', { immediate: true })
    async onDevicesChange(current: DeviceInfo[] | [], prev: DeviceInfo[] | []) {
        if (this.socket && this.socket.connected) {
            let prevDevices: string[] = prev && prev.length > 0 ? this.getGPSDevicesIMEI(prev as DeviceInfo[]) : [];

            let currentDevices: string[] =
                current && current.length > 0 ? this.getGPSDevicesIMEI(current as DeviceInfo[]) : [];
        }
    }
}
</script>
