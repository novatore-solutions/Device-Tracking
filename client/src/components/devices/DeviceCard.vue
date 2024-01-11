<template>
    <v-card :class="[Cardclass, { active: active, 'blue-grey lighten-4': device && device.deleted }]">
        <v-list-item>
            <v-list-item-content>
                <div class="d-flex deviceCard-Header">
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
                    <v-spacer></v-spacer>
                    <device-options-menu
                        :device="device"
                        :hideOptions="
                            device.deviceType === DeviceTypeenum.AirboltGps
                                ? ['Share', 'removeAll', 'getTemperature']
                                : device.deviceType === DeviceTypeenum.AirboltTravelLock
                                ? ['Share', 'removeAll', 'getTemperature', 'alarm', 'remove']
                                : ['Share', 'removeAll', 'getTemperature', 'alarm']
                        "
                    ></device-options-menu>
                </div>

                <v-list-item-title class="Card-title mb-1 Walsheim-font-bold"
                    ><p class="word-eclipse">{{ device.name }}</p></v-list-item-title
                >
                <v-list-item-subtitle class="Card-subtitle Helvetica-font-normal">{{
                    deviceTypeEnum[device.deviceType] ? deviceTypeEnum[device.deviceType] : device.deviceType
                }}</v-list-item-subtitle>
                <v-list-item-subtitle class="Card-subtitle Helvetica-font-normal">{{
                    `Last seen ${deviceLastSeen}`
                }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
    </v-card>
</template>

<style lang="scss" scoped>
.v-list-item__content {
    padding: 8px 0;
}
.DeviceCard {
    cursor: pointer;
    margin: 8px;
    min-width: 315px;
    width: 315px;
    height: auto;
    border: 1px solid rgba(22, 50, 92, 0.17);
    // min-height: 170px;
    box-sizing: border-box;
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.07) !important;
    border-radius: 20px !important;

    @media (max-width: 600px) {
        width: 200px;
        min-width: 200px;
    }

    @media (max-width: 400px) {
        width: 190px;
        min-width: 190px;
    }

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

    ::v-deep .v-avatar {
        margin-bottom: 6px;
        margin-top: 5px;
    }
}

.Slider-deviceCard {
    cursor: pointer;
    // margin: 8px;
    // min-width: 315px;
    // width: 325px;
    height: auto;
    border: 1px solid rgba(22, 50, 92, 0.17);
    // min-height: 270px;
    box-sizing: border-box;
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.07) !important;
    border-radius: 20px !important;

    @media (max-width: 600px) {
        // width: 200px;
        // min-width: 200px;
    }

    @media (max-width: 400px) {
        // width: 190px;
        // min-width: 190px;
    }

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

    ::v-deep .v-avatar {
        margin-bottom: 6px;
        margin-top: 5px;
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
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { DeviceInfo, DeviceType } from '@/types/device-info';
import DeviceOptionsMenu from '@/components/devices/menus/DeviceOptionsMenu.vue';
import { deviceTypeEnum } from '@/constants/deviceType_enum';
import { getDatetimeDiff } from '@/utils/datetime';

// Airbolt default logo
import defaultAirboltLockImage from '@/assets/default-airboltLock-image.png';
import defaultCardImage from '@/assets/default-card-image.png';
import defaultGPSImage from '@/assets/default-gps-image.png';

@Component({
    components: {
        DeviceOptionsMenu,
    },
})
export default class DeviceCard extends Vue {
    @Prop({ required: true })
    device!: DeviceInfo;

    @Prop({ required: false, default: false })
    active!: boolean;

    @Prop({ required: false, default: false })
    Cardclass!: string;

    deviceTypeEnum = deviceTypeEnum;
    getDatetimeDiff = getDatetimeDiff;
    DeviceTypeenum = DeviceType;
    deviceLastSeen = '';
    protected intervalSchedule: any = null;

    mounted() {
        this.intervalSchedule = setInterval(() => {
            this.updateDeviceTimeStamp();
        }, 60000);
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
