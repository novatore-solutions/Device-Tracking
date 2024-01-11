<template>
    <div>
        <v-menu bottom left offset-y class="DeviceOptionsMenu DeviceInfoOptions" close-on-click v-if="device">
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="default" small v-bind="attrs" v-on="on" depressed
                    :class="optionClasses ? 'btn-menu pl-0 pr-0 ' + optionClasses : 'btn-menu pl-0 pr-0 '">
                    <v-icon>$mdiDotsHorizontal</v-icon>
                </v-btn>
            </template>

            <v-list>
                <v-list-item :disabled="!validateRestricted()" dense v-if="has('getTemperature')">
                    <v-list-item-title class="Helvetica-family">Get temperature</v-list-item-title>
                </v-list-item>

                <v-list-item :disabled="!validateRestricted()" dense v-if="has('alarm')">
                    <v-list-item-title class="Helvetica-family">Turn {{ device.alarm === true ? 'off' : 'on' }}
                        alarm</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

    </div>
</template>

<style lang="scss" scoped>
.v-menu__content {
    margin-top: 8px;
    background: #ffffff;
    border: 0.5px solid #d8dde6;
    box-sizing: border-box;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { DeviceInfo, SharedDeviceInfo, getDefaultShareInfo } from '@/types/device-info';
import { Mutation } from 'vuex-class';
import { mutations } from '@/store/types';
import { SetDeviceMutationType, SetDevicesMutationType } from '@/types/store/mutations';
import { Action, State } from 'vuex-class';
import { LoadDevicesActionType, LoadDeviceActionType } from '@/types/store/actions';
import { actions } from '../../../store/types';
import { UserInfo } from '../../../types/user-info';
import { validatePrivilege } from '@/utils/devices';
import { DevicePrivileges } from '@/constants/device_privileges';

@Component({
    components: {
    },
})
export default class DeviceOptionsMenu extends Vue {
    protected shares: SharedDeviceInfo[] = [];
    protected share: SharedDeviceInfo | null = null;
    protected showFullForm = false;
    protected tableLoading = false;
    protected validatePrivilege = validatePrivilege;
    protected DevicePrivileges = DevicePrivileges;

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

    @Prop({
        default() {
            return [];
        },
    })
    hideOptions!: string[];

    @Prop({ required: true })
    device!: DeviceInfo;

    @Prop({ required: false })
    optionClasses!: string;

    validateAccess(privileges: number[] = []) {
        return this.validatePrivilege(this.device.privilege, privileges);
    }

    validateRestricted() {
        return this.validateAccess([DevicePrivileges.SuperOwner, DevicePrivileges.Owner]);
    }

    has(opt: string) {
        return !this.hideOptions.includes(opt);
    }

    async add() {
        this.share = getDefaultShareInfo({
            deviceUUID: this.device.deviceUUID,
        });
    }

    handleListEdit(share: SharedDeviceInfo) {
        this.showFullForm = true;
        this.share = { ...share };
    }
}
</script>
