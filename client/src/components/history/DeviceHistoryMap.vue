<template>
    <div class="DeviceHistoryMap">
        <map-control :perPage="perPage" :device="device" :locations="locations" styles="height: 100%; z-index: 0;">
            <template v-slot:bottomleft>
                <button @click="expand" class="expand-button">
                    <v-icon>$mdiArrowExpandAll</v-icon>
                </button>
            </template>
        </map-control>

        <v-col cols="12" md="4" class="mt-2">
            <v-select
                class="no-message navy-color Helvetica-font-normal history-map-perPage"
                v-model="perPage"
                :items="perPageOptions"
                outlined
                dense
                item-text="text"
            >
            </v-select>
        </v-col>

        <v-dialog
            v-model="dialog"
            v-if="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            attach=".DeviceHistoryMap"
        >
            <v-card tile class="d-flex flex-column">
                <v-card-title class="v-toolbar primary pa-2 flex-grow-0">
                    <v-spacer></v-spacer>
                    <div class="toolbar-title">Location history</div>
                    <v-spacer></v-spacer>

                    <v-btn icon dark @click="dialog = false">
                        <v-icon>$mdiClose</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="d-flex flex-grow-1 pa-0">
                    <map-control
                        :perPage="perPage"
                        :device="device"
                        :locations="locations"
                        styles="width: 100%; height: 100%"
                        ref="dialogMap"
                    />
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<style lang="scss" scoped>
.DeviceHistoryMap {
    height: 100%;
    .toolbar-title {
        color: #f5fffe;
    }

    .expand-button {
        outline: none;
    }
}
.MapControl {
    height: 100%;
}
@media (max-width: 768px) {
    .MapControl {
        height: 400px;
    }
}
.history-map-perPage {
    max-width: 100px;
}
</style>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import { DeviceInfo } from '@/types/device-info';
import { HistoryData } from '@/types/history';
import MapControl from '@/components/history/MapControl.vue';
import api from '@/modules/api';
import _get from 'lodash.get';
import LoadableMixin from '@/mixins/LoadableMixin';

@Component({
    mixins: [LoadableMixin],
    components: {
        MapControl,
    },
})
export default class DeviceHistoryMap extends Mixins<LoadableMixin>(LoadableMixin) {
    dialog = false;
    protected popupMapStyles = '';
    locations: HistoryData[] = [];
    perPage = 10;
    perPageOptions = [
        {
            text: '10',
            value: 10,
        },
        {
            text: '20',
            value: 20,
        },
        {
            text: '30',
            value: 30,
        },
        {
            text: '40',
            value: 40,
        },
        {
            text: '50',
            value: 50,
        },
        {
            text: '75',
            value: 75,
        },
        {
            text: '100',
            value: 100,
        },
    ];
    protected mapInitialized = false;

    @Prop({ required: true })
    device!: DeviceInfo;

    @Prop({ default: false })
    expandable!: boolean;

    expand() {
        this.dialog = true;

        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.$refs.dialogMap as any).$refs.lmap.mapObject.invalidateSize();
        }, 50);
    }

    updateMapHistory(event: any) {
        const lastLocation: HistoryData = {
            latitude: event.detail.latitude,
            longitude: event.detail.longitude,
            timeCreated: event.detail.timeCreated,
            type: event.detail.type ?? null,
            address: event.detail.address,
            modem_temperature: event.detail.modem_temperature ?? null,
            modem_voltage: event.detail.modem_voltage ?? null,
            isLocked: false,
            unlockType: 0,
        };

        const prev = [...this.locations];

        // if prev is empty => insert
        if (prev.length === 0) {
            prev.push(lastLocation);
            this.locations = prev;
            return;
        }

        // if updated => insert at top and remove last index
        const prevLocation = prev[0];
        if (
            (prevLocation.latitude != lastLocation.latitude || prevLocation.longitude != lastLocation.longitude) &&
            (prevLocation.address == 'N/A' ||
                lastLocation.address == 'N/A' ||
                prevLocation.address != lastLocation.address)
        ) {
            prev.unshift(lastLocation);
            if (prev.length > this.perPage) prev.pop();
            this.locations = prev;
            return;
        }
        prev[0].timeCreated = lastLocation.timeCreated;
        this.locations = prev;

    }

    async fetchLocation(device?: DeviceInfo) {
        device = device || this.device;
        if (!device) return;
        this.setLoading(true);
        try {
            const response = await api.getHistoryForMap(device.deviceUUID, { perPage: this.perPage });
            this.locations = response;
        } catch (error) {
            this.$toasted.error(`Unable to load history for device ${device.name}`);
        } finally {
            this.setLoading(false);
        }
    }

    @Watch('device', { immediate: true, deep: true })
    async onDeviceChange(device: DeviceInfo, prevDevice: DeviceInfo) {
        if (_get(device, '_id') !== _get(prevDevice, '_id')) {
            this.fetchLocation(device);
            this.mapInitialized = true;
        }
    }

    @Watch('perPage')
    async onPerPageChange() {
        if (this.mapInitialized) this.fetchLocation(this.device);
    }
}
</script>
