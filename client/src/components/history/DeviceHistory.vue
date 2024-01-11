<template>
    <div class="DeviceHistory">
        <v-app-bar flat elevation="0" height="45" color="transparent" class="mb-4">
            <div class="section-heading Walsheim-font-bold">Location history</div>

            <v-spacer></v-spacer>

            <v-btn-toggle v-model="historyViewType" dense mandatory>
                <v-btn value="map" small>
                    <span class="togglebnt-title Helvetica-family">Map</span>
                    <!-- <v-icon right>$mdiMap</v-icon> -->
                </v-btn>

                <v-btn value="grid" small>
                    <span class="togglebnt-title Helvetica-family">Grid</span>
                    <!-- <v-icon right>$mdiGrid</v-icon> -->
                </v-btn>
            </v-btn-toggle>

            <v-menu bottom left offset-y close-on-click small class="history-options">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" small depressed class="ml-2 InfoSection-optionsbtn">
                        <v-icon>$mdiDotsHorizontal</v-icon>
                    </v-btn>
                </template>

                <v-list style="margin-top: 6px">
                    <span v-if="historyViewType === 'map' && device.deviceType === DeviceTypeenum.AirboltGps">
                        <p class="Helvetica-family menu-group-label navy-color">Geo fence</p>

                        <v-list-item :disabled="!validateRestricted()" dense @click="showMapModal()">
                            <v-list-item-title>{{
                                device.mapBoundaryPoints && device.mapBoundaryPoints.length ? 'Update' : 'Create'
                            }}</v-list-item-title>
                        </v-list-item>

                        <v-list-item
                            v-if="device.mapBoundaryPoints && device.mapBoundaryPoints.length"
                            dense
                        >
                            <v-list-item-title :class="validateRestricted() ? 'red--text' : ''"
                                >Delete</v-list-item-title
                            >
                        </v-list-item>

                        <p class="Helvetica-family menu-group-label mt-2 navy-color">History</p>
                    </span>

                    <v-list-item
                        v-if="historyViewType === 'grid'"
                        :disabled="!validateRestricted()"
                        dense
                    >
                        <v-list-item-title>Export CSV</v-list-item-title>
                    </v-list-item>

                    <v-list-item :disabled="!validateRestricted()" dense>
                        <v-list-item-title :class="validateRestricted() ? 'red--text' : ''"
                            >Clear history</v-list-item-title
                        >
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <device-history-map
            v-if="historyViewType === 'map'"
            :device="device"
            :expandable="true"
        />

        <device-history-grid
            v-if="historyViewType === 'grid'"
            :device="device"
            :locations="locations"
            :perPage="perPage"
            :page="page"
            :total="total"
            :onTableChange="onTableChange"
        />
        <device-map-drawer
            v-model="isMapModal"
            :device="device"
            @childEvent="setValueOfPolyline"
            :mapBoundaryPoints="device.mapBoundaryPoints"
        />
    </div>
</template>

<style lang="scss" scoped>
.section-heading {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    color: #0d2a48;
}
.DeviceHistory {
    height: 100%;
    ::v-deep .v-toolbar__content {
        padding-right: 0 !important;
        padding-left: 0px !important;
    }
}
.v-menu__content {
    margin-top: 8px;
    background: #ffffff;
    border: 0.5px solid #d8dde6;
    box-sizing: border-box;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}
.menu-group-label {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 0px;
    padding-inline: 5px;
}
</style>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import LoadableMixin from '@/mixins/LoadableMixin';
import DeviceHistoryGrid from './DeviceHistoryGrid.vue';
import DeviceHistoryMap from './DeviceHistoryMap.vue';
import api from '@/modules/api';
import { DeviceInfo, DeviceType, DeviceMapData } from '@/types/device-info';
import { HistoryData } from '@/types/history';
import _get from 'lodash.get';
import { mutations } from '@/store/types';
import { UpdateDeviceActionType } from '@/types/store/actions';
import { actions } from '../../store/types';
import { Action, Mutation } from 'vuex-class';
import { validatePrivilege } from '@/utils/devices';
import { DevicePrivileges } from '@/constants/device_privileges';
import DeviceMapDrawer from '../geo-fence/DeviceMapDrawer.vue';
import { SetDeviceMutationType } from '@/types/store/mutations';
// import { LMap } from 'vue2-leaflet';

@Component({
    mixins: [LoadableMixin],

    components: {
        DeviceHistoryGrid,
        DeviceHistoryMap,
        DeviceMapDrawer,
    },
})
export default class DeviceHistory extends Mixins<LoadableMixin>(LoadableMixin) {
    locations: HistoryData[] = [];
    historyViewType = 'map'; // map | grid
    drawMapArea = true;
    page = 1;
    perPage = 10;
    total = 0;
    isMapModal = false;
    isTrigger = false;
    protected validatePrivilege = validatePrivilege;
    protected DevicePrivileges = DevicePrivileges;

    deviceMapData: DeviceMapData = {};

    @Prop({ required: true })
    device!: DeviceInfo;

    @Action(actions.UPDATE_DEVICE)
    updateDevice!: UpdateDeviceActionType;

    @Mutation(mutations.SET_CURRENT_DEVICE)
    setCurrentDevice!: SetDeviceMutationType;

    DeviceTypeenum = DeviceType;

    showMapModal() {
        this.isMapModal = true;
    }
    validateRestricted() {
        return this.validatePrivilege(this.device.privilege, [DevicePrivileges.SuperOwner, DevicePrivileges.Owner]);
    }

    async setValueOfPolyline(childData: []) {
        this.device.mapBoundaryPoints = childData;
        this.drawMapArea = false;
        if (childData.length) {
            await this.updateDevice({
                device: {
                    _id: this.device._id,
                    mapBoundaryPoints: childData,
                },
            });
        }
    }

    @Watch('device', { immediate: true, deep: true })
    async onDeviceChange(device: DeviceInfo, prevDevice: DeviceInfo) {
        if (_get(device, '_id') !== _get(prevDevice, '_id')) {
            this.page = 1;
            this.perPage = 10;
            this.total = 0;
            if (this.historyViewType === 'grid') {
                this.fetchLocation(device);
            }
        }
    }

    async fetchLocation(device?: DeviceInfo) {
        device = device || this.device;
        if (!device) return;

        this.setLoading(true);
        try {
            const response = await api.getDeviceHistory(device.deviceUUID, { page: this.page, perPage: this.perPage });
            this.locations = response.data;

            this.total = response.pagination.total;
        } catch (error) {
            this.$toasted.error(`Unable to load history for device ${device.name}`);
        } finally {
            this.setLoading(false);
        }
    }

    onTableChange(page: number, itemsPerPage: number) {
        this.page = page;
        this.perPage = itemsPerPage;
        this.fetchLocation(this.device);
    }
}
</script>
