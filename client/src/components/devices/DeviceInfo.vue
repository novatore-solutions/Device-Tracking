<template>
    <div class="DeviceInfo">
        <v-app-bar flat elevation="0" height="45" color="transparent" class="pr-0 mb-2 top-dropdown user-main">
            <div>
                <div class="section-heading Walsheim-font-bold">Device info</div>
            </div>
            <v-spacer></v-spacer>

            <div class="navigation-actions">
                <button :disabled="!validateRestricted()" :class="alarmClass"
                    v-if="device.deviceType === DeviceTypeenum.AirboltGps">
                    <v-icon size="22" color="#102c4c">$mdiMusicNoteOutline</v-icon>
                </button>

                <button :disabled="!validateRestricted()" class="notify-btn"
                    v-if="device.deviceType === DeviceTypeenum.AirboltGps" @click="handleAirPlanMode">
                    <v-icon size="22" color="#102c4c">$mdiAirplane</v-icon>
                </button>

                <device-tracking-menu v-if="device.deviceType === DeviceTypeenum.AirboltGps" :device="device" />

                <device-options-menu :device="device" :hideOptions="device.deviceType === DeviceTypeenum.AirboltGps
                        ? ['Share', 'removeAll']
                        : device.deviceType === DeviceTypeenum.AirboltTravelLock
                            ? ['Share', 'removeAll', 'alarm', 'getTemperature', 'remove']
                            : ['Share', 'removeAll', 'alarm', 'getTemperature']
                    " optionClasses="InfoSection-optionsbtn"></device-options-menu>
            </div>
        </v-app-bar>

        <template v-if="device">
            <device-overview-info-row :show="device.deviceType === DeviceTypeenum.AirboltGps" title="Subscription status"
                :value="deviceSubscriptionStatus" />

            <div class="DeviceOverviewInfoRow" v-if="device.deviceType === DeviceTypeenum.AirboltGps">
                <v-card elevation="0">
                    <v-card-text>
                        <div class="info-caption accent--text Walsheim-Pro-family d-flex align-center mb-3">
                            Operating mode
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon small class="title-information-icon ModalTooltip" v-bind="attrs"
                                        v-on="on">$mdiInformation</v-icon>
                                </template>
                                <span class="Helvetica-font-normal">
                                    Optimize for Responsiveness: Perfect for pets, moving valuables or anything you
                                    might want to track more often. Allows you to change settings on the GPS more often
                                    but does impact battery life.<br />

                                    Optimize for Battery Life: Perfect for keeping an eye on valuables which are
                                    unlikely to move too much. You can only make changes to settings or request an adhoc
                                    location when the GPS wakes up (you can set the wake up interval via settings).<br />
                                </span>
                            </v-tooltip>
                        </div>
                        <div class="info-value Helvetica-family">
                            <v-select class="no-message navy-color Helvetica-font-normal" v-model="operatingMode"
                                :items="operatingModeOptions" outlined dense item-text="text"
                                :disabled="!validateRestricted()"></v-select>
                        </div>

                        <div v-if="validateAccess([DevicePrivileges.Unrestricted])">
                            <div class="info-caption accent--text Walsheim-Pro-family d-flex align-center mt-3">
                                Push notification
                            </div>
                            <div>
                                <v-btn-toggle v-model="pushNotification" dense mandatory>
                                    <v-btn :value="true" small>
                                        <span class="togglebnt-title Helvetica-family">On</span>
                                    </v-btn>

                                    <v-btn :value="false" small>
                                        <span class="togglebnt-title Helvetica-family">Off</span>
                                    </v-btn>
                                </v-btn-toggle>
                            </div>

                            <div class="info-caption accent--text Walsheim-Pro-family d-flex align-center mt-3">
                                Email Alerts
                            </div>
                            <div>
                                <v-btn-toggle v-model="emailAlerts" dense mandatory>
                                    <v-btn :value="true" small>
                                        <span class="togglebnt-title Helvetica-family">On</span>
                                    </v-btn>

                                    <v-btn :value="false" small>
                                        <span class="togglebnt-title Helvetica-family">Off</span>
                                    </v-btn>
                                </v-btn-toggle>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </div>

            <device-overview-info-row :show="device.deviceType === DeviceTypeenum.AirboltGps" title="Cellular pings used"
                :value="deviceCellularPings" />

            <device-overview-info-row :show="device.deviceType === DeviceTypeenum.AirboltGps" title="eSIM status"
                :value="simStatus" />
            <device-overview-info-row :show="device.deviceType === DeviceTypeenum.AirboltGps"
                :title="device.operatingMode === 'batteryLife' ? 'Battery Saving Mode' : 'Responsive Mode'"
                :value="get_operating_mode(device)" />
            <!-- <device-overview-info-row
                :show="device.deviceType === DeviceTypeenum.AirboltGps"
                title="edrx status"
                :value="get_edrx_status(device)"
            />
            <device-overview-info-row
                :show="device.deviceType === DeviceTypeenum.AirboltGps"
                title="PSM status"
                :value="get_psm_status(device)"
            /> -->
            <device-overview-info-row :show="device.deviceType === DeviceTypeenum.AirboltGps" title="Battery status"
                :value="voltage_to_capacity(device.modem_voltage ? device.modem_voltage : 0)" :loading="modemLoading" />
            <device-overview-info-row :show="device.deviceType === DeviceTypeenum.AirboltGps" title="Temperature"
                :value="deviceTemperature" :loading="modemLoading" />
            <device-overview-info-row :show="device.deviceType === DeviceTypeenum.AirboltGps" title="Geo Fence"
                :value="device.geoFence&&device.geoFence.enable ? 'On' : 'Off'" :loading="modemLoading" />
            <device-overview-info-row :show="device.deviceType === DeviceTypeenum.AirboltGps" :title="deviceIdtitle"
                :value="deviceId" />
            <device-overview-info-row :show="true" title="Serial Number" :value="device.deviceUUID" />
        </template>
        <airplane-mode-update-popup v-model="airplaneModeDialog" :device="device" />
    </div>
</template>

<style lang="scss" scoped>
.navigation-actions {
    display: flex;
}

@media (min-width: 768px) and (max-width: 1300px) {
    .DeviceInfo {
        .user-main {
            height: auto !important;
        }

        ::v-deep .v-toolbar__content {
            align-items: flex-start;
            flex-direction: column;
            height: auto !important;
            gap: 5px;
        }
    }

    .navigation-actions {
        justify-content: flex-end;
        width: 100%;
    }
}

@media (min-width: 320px) and (max-width: 390px) {
    .DeviceInfo {
        .user-main {
            height: auto !important;
        }

        ::v-deep .v-toolbar__content {
            align-items: flex-start;
            flex-direction: column;
            height: auto !important;
            gap: 5px;
        }
    }

    .navigation-actions {
        justify-content: flex-end;
        width: 100%;
    }
}

.section-heading {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    color: #0d2a48;
}

.DeviceInfo {
    ::v-deep .v-toolbar__content {
        padding-right: 0 !important;
        padding-left: 10px !important;
    }

    ::v-deep .v-card {
        margin-left: 8px;
        margin-bottom: 4px;
    }
}

.AddShareIconContainer {
    text-align: center;
}

.AddShareIcon {
    cursor: pointer;
    color: #0d2a48;
    /* font-size: 34px; */
    /* height: 34px; */
    border: 1px solid #0d2a48;
    border-radius: 50%;
}

.notify-btn {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    border-radius: 50%;
    border: 1px solid #000;
    color: rgb(16, 44, 76);
    background: #ffffff;
    border: 0.5px solid #d8dde6;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notify-btn.success-btn {
    background: #f5fffe;
    border: 1px solid #8fe2db;
}

.notify-btn.success-btn .v-icon {
    color: #009688 !important;
}

.tracking-btn {
    color: rgb(0, 123, 255);
    display: flex;
    align-items: center;
    gap: 5px;
}

.tracking-btn .v-icon {
    color: rgb(0, 123, 255) !important;
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { DeviceInfo, DeviceType, SharedDeviceInfo, getDefaultShareInfo } from '@/types/device-info';
import DeviceOverviewInfoRow from './DeviceOverviewInfoRow.vue';
import DeviceOptionsMenu from '@/components/devices/menus/DeviceOptionsMenu.vue';
import DeviceTrackingMenu from '@/components/devices/menus/DeviceTrackingMenu.vue';
import { Action, State } from 'vuex-class';
import { LoadDevicesActionType, LoadDeviceActionType } from '@/types/store/actions';
import { UserInfo } from '../../types/user-info';
import { actions, mutations } from '@/store/types';
import { voltage_to_capacity } from '@/utils/voltageToCapacity';
import LocateContinuesModal from '@/components/devices/popups/LocateContinuesModal.vue';
import { Mutation } from 'vuex-class';
import { SetDeviceMutationType, SetDevicesMutationType } from '@/types/store/mutations';
import { get_edrx_status, get_psm_status, get_operating_mode } from '@/utils/devices';
import { validatePrivilege } from '@/utils/devices';
import { DevicePrivileges } from '@/constants/device_privileges';
import { operatingModeOptions, defaultOperatingMode } from '@/constants/options';
import { handleTempUnit } from '@/utils/temperature';
import AirplaneModeUpdatePopup from '@/components/devices/popups/AirplaneModeUpdatePopup.vue';

@Component({
    components: {
        DeviceOverviewInfoRow,
        DeviceOptionsMenu,
        DeviceTrackingMenu,
        LocateContinuesModal,
        AirplaneModeUpdatePopup,
    },
})
export default class DeviceInfoComponent extends Vue {
    share: SharedDeviceInfo | null = null;
    ManageSharingTitle = 'Share';
    voltage_to_capacity = voltage_to_capacity;
    get_edrx_status = get_edrx_status;
    get_psm_status = get_psm_status;
    get_operating_mode = get_operating_mode;
    protected continues = false;
    protected locateContinueModalShow = false;
    protected validatePrivilege = validatePrivilege;
    protected handleTempUnit = handleTempUnit;
    DevicePrivileges = DevicePrivileges;
    operatingMode = defaultOperatingMode;
    operatingModeOptions = operatingModeOptions;
    protected defaultOperatingMode = defaultOperatingMode;
    pushNotification = false;
    emailAlerts = false;

    // protected modemInfo = null;
    modemLoading = false;

    @Action(actions.LOAD_DEVICES)
    loadDevices!: LoadDevicesActionType;

    @Mutation(mutations.SET_CURRENT_DEVICE)
    setCurrentDevice!: SetDeviceMutationType;

    @Mutation(mutations.SET_DEVICES)
    setDevices!: SetDevicesMutationType;

    @State('user')
    user!: UserInfo;

    @State('device')
    current!: DeviceInfo;

    @State('devices')
    devices!: DeviceInfo[];

    @State('subscriptions')
    userSubscriptions!: any;

    @Prop({ required: true })
    device!: DeviceInfo;

    DeviceTypeenum = DeviceType;
    airplaneModeDialog = false;

    handleAirPlanMode() {
        this.airplaneModeDialog = true;
    }

    validateAccess(privileges: number[] = []) {
        return this.validatePrivilege(this.device.privilege, privileges);
    }

    validateRestricted() {
        return this.validateAccess([DevicePrivileges.SuperOwner, DevicePrivileges.Owner]);
    }

    onCheckboxClick() {
        this.continues = !this.continues;
    }

    get alarmClass() {
        return `notify-btn ${this.device.alarm === true ? 'success-btn' : ''}`;
    }

    get deviceSubscriptionStatus() {
        return this.device?.subscription?.status ? this.device?.subscription?.status : 'N/A';
    }

    get deviceCellularPings() {
        return `${this.device?.cellRequestsCount || 0} / ${this.device.cellScanLimit}`;
    }

    get simStatus() {
        return 'Inactive';
    }

    get deviceId() {
        if (!this.device) return '';

        if (this.device.deviceType === DeviceType.AirboltGps) {
            if (!this.device.imei) return '';
            const parts = this.device.imei.match(/.{1,4}/g);
            return parts ? parts.join(':') : '';
        }

        return this.device.deviceUUID ?? '';
    }

    get deviceIdtitle() {
        return this.device.deviceType === DeviceType.AirboltGps ? 'eSIM ID' : 'Device UUID';
    }

    get deviceTemperature() {
        if (this.device.modem_temperature) {
            return `${this.device.modem_temperature} °${this.device.temperature?.unit?.toUpperCase() ?? 'C'}`;
            // return handleTempUnit(this.device.modem_temperature, this.device.temperature?.unit ?? 'c');
        }
        return 'N/A';
    }

    async add() {
        this.share = getDefaultShareInfo({
            deviceUUID: this.device.deviceUUID,
        });
    }

    handleSettingsClick(device: DeviceInfo) {
        this.$router
            .push({ name: 'device-settings', params: { deviceUUID: device.deviceUUID as string } })
            .catch((error) => error);
    }

    @Watch('device', { immediate: true, deep: true })
    onDeviceChanged(device: DeviceInfo) {
        if (device && device.deviceType === this.DeviceTypeenum.AirboltGps) {
            this.operatingMode = device.operatingMode ?? this.defaultOperatingMode;
            this.pushNotification = device.pushNotification ?? false;
            this.emailAlerts = device.emailAlerts ?? false;
        }
    }
}
</script>
