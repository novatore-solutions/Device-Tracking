<template>
    <div class="user-tabs" v-if="device">
        <top-nav-bar :title="`<b>${device.name}: Settings</b>`">
            <template slot="pre-toolbar">
                <v-btn icon @click="$router.back()">
                    <v-icon>$mdiArrowLeft</v-icon>
                </v-btn>
            </template>
        </top-nav-bar>

        <v-tabs v-model="currentTab" align-with-title>
            <v-tabs-slider></v-tabs-slider>

            <v-tab v-for="tab in availableTabs" :key="tab.value" :to="getTabPath(tab)">
                {{ tab.title }}
            </v-tab>
        </v-tabs>

        <router-view></router-view>
    </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TopNavBar from '@/components/app/TopNavBar.vue';
import { DeviceInfo, DeviceType } from '@/types/device-info';
import { State, Action } from 'vuex-class';
import { actions } from '@/store/types';
import { LoadDeviceActionType } from '@/types/store/actions';
import { validatePrivilege } from '@/utils/devices';
import { DevicePrivileges } from '@/constants/device_privileges';
import { UserInfo } from '@/types/user-info';

interface Tab {
    value: string;
    title: string;
    to: string;
    applicableToTypes: string[];
    permitted: boolean;
}

@Component({
    components: {
        TopNavBar,
    },
})
export default class DeviceSettings extends Vue {
    @State('device')
    device!: DeviceInfo;

    currentTab = 'basic';
    protected validatePrivilege = validatePrivilege;
    protected DevicePrivileges = DevicePrivileges;
    protected tabs: Tab[] = [];

    @State('user')
    user!: UserInfo;

    async mounted() {
        const { deviceUUID } = this.$route.params;

        if (!this.validatePrivilege(this.device.privilege, [DevicePrivileges.SuperOwner, DevicePrivileges.Owner])) {
            Vue.toasted.error('Permission denied');
            return this.$router.push({
                name: 'device-overview',
                params: { deviceUUID: this.device.deviceUUID as string },
            });
        }

        this.tabs = [
            {
                value: 'basic',
                title: 'Basic settings',
                to: 'basic',
                applicableToTypes: ['all'],
                permitted: true,
            },
            {
                value: 'alert',
                title: 'Alert & Reports',
                to: 'alert',
                applicableToTypes: [DeviceType.AirboltGps],
                permitted: true,
            },
            {
                value: 'security',
                title: 'Security',
                to: 'security',
                applicableToTypes: [DeviceType.AirboltGps],
                permitted: true,
            },
            {
                value: 'sharing',
                title: 'Sharing',
                to: 'sharing',
                applicableToTypes: ['all'],
                permitted: true,
            },
            {
                value: 'plans',
                title: 'Update Plan',
                to: 'plans',
                applicableToTypes: [DeviceType.AirboltGps],
                permitted: this.validatePrivilege(this.device?.privilege, [DevicePrivileges.SuperOwner]),
            },
        ];
    }

    getTabPath(tab: Tab) {
        return `/device/${this.device.deviceUUID}/settings/${tab.to}`;
    }

    get availableTabs() {
        return this.tabs
            .filter(tab => tab.permitted)
            .filter(tab =>
                tab.applicableToTypes.includes('all') ||
                tab.applicableToTypes.includes(this.device.deviceType)
            )
            .filter(tab =>
                !(this.user.roles.includes('k9') && tab.title === 'Update Plan')
            );
    }
}
</script>
