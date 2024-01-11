<template>
    <v-menu
        v-if="device.locationReportMode !== GPSReportModes.Continuously"
        bottom
        left
        offset-y
        close-on-click
    >
        <template v-slot:activator="{ on, attrs }">
            <button :disabled="!validateRestricted()" v-bind="attrs" v-on="on" class="Locate-btn mr-2">
                <v-icon size="27" color="#102c4c">$mdiCrosshairsGps</v-icon>
                <span class="Helvetica-family">Locate</span>
            </button>
        </template>

        <v-list>
            <v-list-item :disabled="!validateRestricted()" dense>
                <v-list-item-title>Once</v-list-item-title>
            </v-list-item>
            <v-list-item :disabled="!validateRestricted()" dense>
                <v-list-item-title>Continuously</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>

    <button
        v-else
        :disabled="!validateRestricted()"
        class="Locate-btn stop-tracking-btn mr-2 success-btn"
    >
        <v-icon size="24" class="location-icon" color="#102c4c">$mdiCrosshairsGps</v-icon>
        <span class="Helvetica-family">Stop tracking</span>
    </button>
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
.v-btn {
    color: #9ba6b5;
}
.Locate-btn.success-btn {
    background: #f5fffe;
    border: 1px solid #8fe2db;
}
.Locate-btn.success-btn .v-icon {
    color: #009688 !important;
}
.stop-tracking-btn {
    width: 120px;
}
.stop-tracking-btn > span {
    padding-left: 6px;
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { DeviceInfo, DeviceType, GPSReportModes } from '@/types/device-info';
import { validatePrivilege } from '@/utils/devices';
import { DevicePrivileges } from '@/constants/device_privileges';

@Component({
    components: {},
})
export default class DeviceTrackingMenu extends Vue {
    @Prop({ required: true })
    device!: DeviceInfo;

    DeviceTypeenum = DeviceType;
    protected GPSReportModes = GPSReportModes;
    protected validatePrivilege = validatePrivilege;
    protected DevicePrivileges = DevicePrivileges;

    validateRestricted() {
        return this.validatePrivilege(this.device.privilege, [DevicePrivileges.SuperOwner, DevicePrivileges.Owner]);
    }
}
</script>
