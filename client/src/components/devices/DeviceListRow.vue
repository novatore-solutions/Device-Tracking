<template>
    <v-card class="DeviceListRow" :class="{ active: active }">
        <v-list-item>
            <v-list-item-avatar
                :style="{
                    padding: '2px',
                    border: '1px solid',
                    'border-color': device.color ? device.color : 'transparent',
                }"
                size="60"
                width="60"
            >
                <v-img :src="image" class="device-picture" />
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title class="mb-1 Card-title mb-1 Walsheim-font-bold">
                    {{ device.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="Card-subtitle Helvetica-font-normal">
                    <div class="d-flex list-card-sub-heading">
                        <div class="mr-4">
                            {{
                                deviceTypeEnum[device.deviceType]
                                    ? deviceTypeEnum[device.deviceType]
                                    : device.deviceType
                            }}
                        </div>
                        <div class="dot-before">
                            {{ `Last seen ${deviceLastSeen}` }}
                        </div>
                    </div>
                </v-list-item-subtitle>
            </v-list-item-content>
            <device-options-menu
                :device="device"
                :hideOptions="
                    device.deviceType === DeviceTypes.AirboltGps
                        ? ['Share', 'removeAll', 'getTemperature']
                        : device.deviceType === DeviceTypes.AirboltTravelLock
                        ? ['Share', 'removeAll', 'getTemperature', 'alarm', 'remove']
                        : ['Share', 'removeAll', 'getTemperature', 'alarm']
                "
            ></device-options-menu>
        </v-list-item>
    </v-card>
</template>

<style lang="scss" scoped>
.DeviceListRow {
    border: 1px solid rgba(22, 50, 92, 0.17);
    box-shadow: 0px 1px 0px rgb(0 0 0 / 7%) !important;
    border-radius: 20px !important;
    cursor: pointer;
    margin: 8px;
    height: auto;

    &.active {
        background-color: #f5fffe;
        border: 1px solid #8fe2db !important;
        box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.12) !important;
        .v-avatar.v-list-item__avatar {
            border: 2px solid #009688 !important;
        }
        .Card-title {
            color: #009688 !important;
        }
    }

    ::v-deep .v-list-item__content {
        display: block;
    }

    ::v-deep .v-avatar {
        margin-bottom: 8px;
    }
}
.device-picture {
    height: 54px;
}
.Card-title {
    text-align: left;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 27px;
    color: #0d2a48;
}
.Card-subtitle {
    text-align: left;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #9397a7 !important;
    line-height: 22px;
}

@media (max-width: 600px) {
    .list-card-sub-heading {
        width: 100%;
        flex-wrap: wrap;
        flex-direction: column;
    }
    .dot-before::before {
        display: none;
    }
    .DeviceListRow {
        height: auto;
    }
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { DeviceInfo, DeviceType } from '@/types/device-info';
import { deviceTypeEnum } from '@/constants/deviceType_enum';
import { getDatetimeDiff } from '@/utils/datetime';
import DeviceOptionsMenu from '@/components/devices/menus/DeviceOptionsMenu.vue';

// Airbolt default logo
import defaultAirboltLockImage from '@/assets/default-airboltLock-image.png';
import defaultCardImage from '@/assets/default-card-image.png';
import defaultGPSImage from '@/assets/default-gps-image.png';

@Component({
    components: { DeviceOptionsMenu },
})
export default class DeviceListRow extends Vue {
    @Prop({ required: true })
    device!: DeviceInfo;

    @Prop({ required: false, default: false })
    active!: boolean;

    deviceTypeEnum = deviceTypeEnum;
    getDatetimeDiff = getDatetimeDiff;
    DeviceTypes = DeviceType;
    deviceLastSeen = '';
    protected intervalSchedule: any = null;

    mounted() {
        this.intervalSchedule = setInterval(() => {
            this.updateDeviceTimeStamp();
        }, 600);
    }

    beforeDestroy() {
        if (this.intervalSchedule) this.resetInterval();
    }

    resetInterval() {
        clearInterval(this.intervalSchedule);
        this.intervalSchedule = null;
    }

    updateDeviceTimeStamp() {
        this.deviceLastSeen = this.device.lastSeenTime ? getDatetimeDiff(this.device.lastSeenTime) : 'N/A';
    }

    get image() {
        if (!this.device) return null;
        if (this.device?.devicePicture) return `data:image/png;base64,${this.device.devicePicture}`;
        if (this.device?.deviceType === DeviceType.AirboltTravelLock) return defaultAirboltLockImage;
        if (this.device?.deviceType === DeviceType.AirboltCard) return defaultCardImage;
        if (this.device?.deviceType === DeviceType.AirboltGps) return defaultGPSImage;
        return null;
    }

    @Watch('device', { immediate: true })
    async onDeviceChange() {
        this.updateDeviceTimeStamp();
    }
}
</script>
