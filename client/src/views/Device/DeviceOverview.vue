<template>
    <div class="DeviceOverview">
        <top-nav-bar title="My AirBolts">
            <template slot="searchField">
                <div class="expand-search-box">
                    <input
                        :class="
                            expandRestricted || expandSearch
                                ? 'expand-search-input navy-color expanded'
                                : 'expand-search-input navy-color'
                        "
                        :value="searchName"
                        type="search"
                        placeholder="Search"
                        @keyup="(event) => debounce(event.target.value)"
                    />
                    <div
                        :class="expandRestricted || expandSearch ? 'expand-search-icon expanded' : 'expand-search-icon'"
                        @click="toggleExpandSearch"
                    >
                        <v-icon size="27" color="#009688">$mdiMagnify</v-icon>
                    </div>
                </div>
            </template>

        </top-nav-bar>

        <div class="mt-6" v-if="devices && devices.length > 0">
            <airbolts-carousel v-if="viewType === AirboltsViewType.Combo"></airbolts-carousel>

            <div class="container-fluid v-toolbar-content" v-if="current">
                <v-row class="DeviceDetailContainer">
                    <v-col cols="12" md="4">
                        <device-info :device="current" />
                    </v-col>

                    <v-col cols="12" md="8">
                        <device-history :device="current" />
                    </v-col>
                </v-row>
            </div>
        </div>

        <div v-if="devicesFetched && devices.length == 0" class="content">
            <h3 class="text-center" style="color: #0d2a48">Welcome to The AirBolt Web Platform</h3>
            <p class="main-descript mt-3 text-center">
                From here you can manage and view all your existing devices. To add your first AirBolt, please download
                the iOS or Android app, and follow the instructions there
            </p>
            <div class="img-links ml-auto mr-auto">
                <div class="img-link-1">
                    <a target="_blank" href="https://itunes.apple.com/us/app/airbolt/id1085408200?mt=8">
                        <img src="@/assets/icons/app_store.png" alt="App Store" class="app-store-img" />
                    </a>
                </div>
                <div class="img-link-1">
                    <a
                        target="_blank"
                        href="https://play.google.com/store/apps/details?id=com.Airbolt.TheAirBolt&amp;hl=en"
                    >
                        <img
                            src="@/assets/icons/get-it-on-google-play-badge.png"
                            alt="Play Store"
                            class="play-store-img"
                        />
                    </a>
                </div>
            </div>
            <div class="mt-10 text-center">
                <a
                    :href="helpAndSupportURL"
                    target="_blank"
                    class="router-link-exact-active router-link-active"
                    style="color: #007bff"
                    >Help and Support</a
                >
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.content {
    width: 50vw;
    height: 85vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: center; */
    margin: auto;
}
h2.main_head {
    font-size: 45px;
    font-weight: 600;
    margin-bottom: 0px;
}
p.main-descript {
    font-size: 16px;
    font-weight: 400;
    color: #0d2a48;
    margin-bottom: 50px;
}
p.main_description__2 {
    font-size: 18px;
    font-weight: 400;
    color: #0d2a48;
}
.img-links {
    display: flex;
    max-width: 400px;
}
img.app-store-img {
    width: 150px;
}
img.play-store-img {
    width: 168px;
    margin-left: 10px;
}
@media (max-width: 600px) {
    .content {
        width: 100vw;
        height: 80vh;
        display: flex;
        flex-wrap: wrap;
        padding: 0px 15px;
        flex-direction: column;
        justify-content: center;
        margin: auto;
    }
}
</style>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import { State, Action, Mutation } from 'vuex-class';
import TopNavBar from '@/components/app/TopNavBar.vue';
import AirboltsCarousel from '@/components/airbolts/AirboltsCarousel.vue';
import DeviceHistory from '@/components/history/DeviceHistory.vue';
import { UserInfo } from '@/types/user-info';
import { DeviceInfo, SharedDeviceInfo } from '@/types/device-info';
import { AirboltsViewType } from '@/types/store/state';
import DeviceInfoComponent from '@/components/devices/DeviceInfo.vue';
import { mutations } from '@/store/types';
import { SetDeviceMutationType } from '@/types/store/mutations';
import { helpAndSupportURL } from '@/constants/constants';
import api from '@/modules/api';
import { getErrorMessage } from '@/utils/common';

@Component({
    components: {
        TopNavBar,
        AirboltsCarousel,
        DeviceHistory,
        'device-info': DeviceInfoComponent,
    },
})
export default class DeviceOverview extends Vue {
    AirboltsViewType = AirboltsViewType;
    helpAndSupportURL = helpAndSupportURL;
    protected shares: SharedDeviceInfo[] = [];
    expandSearch = false;
    expandRestricted = false;
    private debounceSearch: any = null;

    @State('viewType')
    viewType!: AirboltsViewType;

    @State('user')
    user!: UserInfo;

    @State('device')
    current!: DeviceInfo;

    @State('devices')
    devices!: DeviceInfo[];

    @State('devicesFetched')
    devicesFetched!: boolean;

    @State('searchName')
    searchName!: boolean;

    @State('selectedDeviceType')
    selectedDeviceType!: string;

    @Mutation(mutations.SET_CURRENT_DEVICE)
    setCurrentDevice!: SetDeviceMutationType;

    debounce(val: string) {
        if (this.debounceSearch) {
            clearTimeout(this.debounceSearch);
            this.debounceSearch = null;
        }
        this.debounceSearch = setTimeout(() => {
            this.onSearchChange(val);
        }, 500);
    }

    async onSearchChange(value: string) {
        this.$store.commit(mutations.SET_SEARCH_NAME, { searchName: value == null ? '' : value });
        this.$store.commit(mutations.LOADING, { loading: true });
        try {
            //filter devices by type
            const filteredDevices = await api.loadDevices(
                { page: 0, perPage: 999 },
                this.selectedDeviceType,
                value,
            );
            this.$store.commit(mutations.SET_DEVICES, { devices: filteredDevices });

            // set selected device
            const index = filteredDevices.findIndex((currentdevice) => currentdevice._id === this.current?._id);
            if (filteredDevices.length == 0) {
                this.setCurrentDevice({ device: null });
                this.handleNavigate('');
            } else if (this.current === null || index === -1) {
                this.setCurrentDevice({ device: filteredDevices[0] });
                this.handleNavigate(filteredDevices[0].deviceUUID as string);
            } else {
                this.handleNavigate(this.current?.deviceUUID as string);
            }
        } catch (error) {
            Vue.toasted.error(getErrorMessage(error));
        } finally {
            this.$store.commit(mutations.LOADING, { loading: false });
        }
    }

    toggleExpandSearch() {
        this.expandSearch = !this.expandSearch;
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
