<template>
    <v-navigation-drawer
        class="sidebar-menu"
        v-bind:value="this.isDrawer"
        v-on:input="toggleDrawer($event)"
        app
        :permanent="this.permanent"
    >
        <!-- <drawer-account :ResetDevices="this.ResetDevices" /> -->
        <drawer-account :onLogoClick="this.onLogoClick" />

        <v-list nav dense>
            <v-subheader class="hover-a">AirBolts</v-subheader>
            <!-- <v-subheader class="cursor-pointer hover-a" @click.native="handleAirBoltsClick()">AirBolts</v-subheader> -->

            <v-list-item
                v-for="deviceType in deviceMenuOptions"
                :key="deviceType.value"
                link
                @click.native="handleDeviceTypeClick(deviceType.value)"
                :class="{ active: isActive(deviceType.value) }"
            >
                <!-- <v-list-item-icon class="mr-2 ml-2">
                    <v-icon>$mdiLockSmart</v-icon>
                </v-list-item-icon> -->
                <v-list-item-content>
                    <v-list-item-title v-text="deviceType.name"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>

        </v-list>
    </v-navigation-drawer>
</template>

<style lang="scss" scoped>
a {
    text-decoration: none;
}
.hover-a:hover {
    text-decoration: none !important;
}
.v-subheader {
    font-weight: 500;
    text-decoration: none !important;
    font-family: GT Walsheim Pro !important;
    color: #9397a7 !important;
}

.v-list {
    .v-list-item {
        &.active {
            background-color: white;
            color: #009688 !important;
        }

        .v-list-item__title {
            color: #9397a7;
            font-family: GT Walsheim Pro !important;
            font-size: 16px;
            font-weight: 400 !important;
            line-height: 18px !important;
        }
    }
}

.v-navigation-drawer {
    background: #f9f9fd !important;
}
.v-list .v-list-item--active .v-list-item__title {
    color: #009688 !important;
    font-family: GT Walsheim Pro !important;
}

.v-list .v-list-item.active .v-list-item__title {
    color: #009688 !important;
}

.sidebar-menu {
    padding-left: 11px;
    padding-right: 11px;
}
</style>

<script lang="ts">
// import _get from 'lodash.get';
import { mutations } from '@/store/types';
import { DeviceInfo } from '@/types/device-info';
import { SetDeviceMutationType } from '@/types/store/mutations';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import DrawerAccount from './DrawerAccount.vue';
import { helpAndSupportURL } from '@/constants/constants';
import { deviceMenuOptions } from '@/constants/sideBarDeviceOptions';
import api from '@/modules/api';
import { UserInfo } from '@/types/user-info';
import { getErrorMessage } from '@/utils/common';

@Component({
    components: {
        DrawerAccount,
    },
})
export default class SideMenuTemplateRendrer extends Vue {
    protected helpAndSupportURL = helpAndSupportURL;
    protected deviceMenuOptions = deviceMenuOptions;
    isUserK9 = false;

    @Prop({ required: true })
    permanent!: boolean;

    @Prop({ required: true })
    isDrawer!: boolean;

    @State('devices')
    devices!: DeviceInfo[];

    @State('allDevices')
    allDevices!: DeviceInfo[];

    @State('device')
    device!: DeviceInfo;

    @State('selectedDeviceType')
    selectedDeviceType!: string;

    @State('user')
    user!: UserInfo;

    @Prop({ required: true })
    toggleDrawer!: (val: boolean) => void;

    @Mutation(mutations.SET_CURRENT_DEVICE)
    setCurrentDevice!: SetDeviceMutationType;

    async handleDeviceTypeClick(deviceTypeValue: string) {
        this.toggleDrawer(false);
        this.$store.commit(mutations.SET_SELECTED_DEVICE_TYPE, { selectedDeviceType: deviceTypeValue });
        this.$store.commit(mutations.LOADING, { loading: true });
        this.$store.commit(mutations.SET_SEARCH_NAME, { searchName: '' });
        try {
            //filter devices by type
            const filteredDevices = await api.loadDevices(
                { page: 0, perPage: 999 },
                deviceTypeValue,
                '',
            );
            this.$store.commit(mutations.SET_DEVICES, { devices: filteredDevices });

            // set selected device
            const index = filteredDevices.findIndex((currentdevice) => currentdevice._id === this.device?._id);
            if (filteredDevices.length == 0) {
                this.setCurrentDevice({ device: null });
                this.handleNavigate('');
            } else if (this.device === null || index === -1) {
                this.setCurrentDevice({ device: filteredDevices[0] });
                this.handleNavigate(filteredDevices[0].deviceUUID as string);
            } else {
                this.handleNavigate(this.device?.deviceUUID as string);
            }
        } catch (error) {
            Vue.toasted.error(getErrorMessage(error));
        } finally {
            this.$store.commit(mutations.LOADING, { loading: false });
        }
    }

    handleMenuItemClick() {
        // this.$store.commit(mutations.SET_SELECTED_DEVICE_TYPE, { selectedDeviceType: '' });
        this.toggleDrawer(false);
        this.$store.commit(mutations.SET_SEARCH_NAME, { searchName: '' });
    }

    isActive(deviceTypeValue: string) {
        return deviceTypeValue === this.selectedDeviceType;
    }

    // isActive(device: DeviceInfo) {
    //     return device.deviceUUID === _get(this.$route, 'params.deviceUUID');
    // }

    isMoreActive(routeName: string[]) {
        let current: string = this.$route.name ? this.$route.name : '';
        return routeName.indexOf(current) > -1;
    }

    get mini() {
        return this.$vuetify.breakpoint.smAndDown;
    }

    ResetDevices() {
        this.setCurrentDevice({ device: null });
        this.toggleDrawer(false);
    }

    onLogoClick() {
        this.toggleDrawer(false);
        this.handleDeviceTypeClick('all');
    }

    handleAirBoltsClick() {
        if (this.device) {
            this.handleNavigate(this.device.deviceUUID as string);
        } else if (this.devices.length > 0) {
            this.handleNavigate(this.devices[0].deviceUUID as string);
        } else {
            this.handleNavigate('');
        }
    }

    handleNavigate(deviceUUID: string) {
        if (this.$route.path != `/device${deviceUUID ? `/${deviceUUID}` : ''}`) {
            this.$router.push({
                name: 'device-overview',
                params: deviceUUID ? { deviceUUID } : {},
            });
        }
    }
}
</script>
