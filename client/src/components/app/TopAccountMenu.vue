<template>
    <div class="TopAccountMenu">
        <v-menu class="DeviceOptionsMenu" bottom left offset-y close-on-click v-if="user" attach=".TopAccountMenu">
            <!-- user icon -->
            <template v-slot:activator="{ on, attrs }">
                <v-badge bordered top color="#E91E63" dot offset-x="10" offset-y="10" :value="hasNewNotifications">
                    <v-avatar size="40" v-bind="attrs" v-on="on">
                        <v-img v-if="user.profilePicture" :src="image" class="user-picture" />
                        <v-img v-else src="@/assets/logoRound.png" class="user-picture" />
                        <!-- <gravatar :email="user ? user.email : 'nosuchip@gmail.com'" defaultImage="mp" :size="100" /> -->
                    </v-avatar>
                </v-badge>
            </template>

            <v-list class="user-menu-dropdown">
                <v-list-item dense>
                    <v-list-item-content>
                        <v-list-item-title class="title" style="font-size: 15px !important; font-weight: bold"
                            >Notifications
                            <span class="notifications-count">{{ notifications.length }}</span>
                            <span class="float-right blue-link-label" style="padding-right: 5px">Mark all as read</span>
                        </v-list-item-title>
                        <!-- <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle> -->
                    </v-list-item-content>
                </v-list-item>

                <div v-if="notifications.length > 0" class="notification-list-container custome-scroller">
                    <v-list-item v-for="item in notifications" :key="item.title">
                        <v-badge
                            v-if="item.online == true"
                            bordered
                            top
                            color="#E91E63"
                            dot
                            offset-x="17"
                            offset-y="10"
                        >
                            <v-list-item-avatar class="custome-list-item-avatar">
                                <v-img :src="item.avatar"></v-img>
                            </v-list-item-avatar>
                        </v-badge>

                        <v-list-item-avatar v-if="item.online == false" class="custome-list-item-avatar">
                            <v-img :src="item.avatar"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-html="item.title"></v-list-item-title>
                            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </div>
                <div v-else class="d-flex justify-content-center py-3 Helvetica-font-normal navy-color">
                    No notification found
                </div>

                <div class="wrap-div">
                    <v-list-item dense class="bg-gray" :to="{ name: 'user-settings' }">
                        <v-list-item-title>Account settings</v-list-item-title>
                    </v-list-item>
                    <v-list-item dense class="bg-gray sign-out">
                        <v-list-item-title class="red--text">Sign out</v-list-item-title>
                    </v-list-item>
                </div>
            </v-list>
        </v-menu>
    </div>
</template>

<style lang="scss" scoped>
.TopAccountMenu {
    ::v-deep .bg-gray {
        background-color: #f9f9fd;
    }

    .v-list {
        padding-bottom: 0 !important;

        .v-list-item__avatar {
            margin-right: 8px;
        }

        .v-list-item__title {
            line-height: 16px;
            font-size: 13px !important;
            margin-bottom: 0px;
        }

        .v-list-item__subtitle {
            line-height: 15px;
            font-size: 12px;
            color: #bbb;
        }
    }
}
.wrap-div {
    display: flex;
    background: #f9f9fd;
    flex-direction: column;
    padding: 8px 0;
}
.wrap-div .bg-gray {
    padding: 2px 16px;
}
.notifications-count {
    color: #bbb;
    font-weight: 100;
    font-size: 12px;
    padding-left: 7px;
}
.v-menu__content {
    top: 65px !important;
    background: #ffffff;
    border: 0.5px solid #d8dde6;
    box-sizing: border-box;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}
.user-menu-dropdown {
    max-width: 300px;
    min-width: 300px;
}
.notification-list-container {
    max-height: 300px;
    overflow-y: auto;
    margin-right: 5px;
}

.v-list-item__title,
.v-list-item__subtitle {
    text-overflow: initial !important;
    white-space: pre-wrap !important;
}
.v-list-item__avatar {
    margin-left: 0px !important;
    margin-top: 0px !important;
}
@media (max-width: 576px) {
    .user-menu-dropdown {
        max-width: 100%;
        min-width: 100%;
    }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Gravatar from 'vue-gravatar';
import { Action, State } from 'vuex-class';
import { UserInfo } from '@/types/user-info';
import { actions } from '@/store/types';

@Component({
    components: { Gravatar },
})
export default class TopAccountMenu extends Vue {
    @State('user')
    user!: UserInfo | null;

    get image() {
        return this.user?.profilePicture ? `data:image/png;base64,${this.user?.profilePicture}` : null;
    }

    get notifications() {
        return [
            // {
            //     avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            //     title: '<b>User Unknown</b> accepted your <b>Sharing invite</b>',
            //     subtitle: '2h ago',
            //     online: true,
            // },
            // {
            //     avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            //     title: '<b>Greg Campbell</b> added you as owner to Wolf’s bracelet <b>AirBolt</b>',
            //     subtitle: '4h ago',
            //     online: true,
            // },
            // {
            //     avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            //     title: 'Your trial ends on August 24, 2020. Add your billing info to keep AirBolt Pro plan.',
            //     subtitle: '1d ago',
            //     online: false,
            // },
        ];
    }

    get hasNewNotifications() {
        return true;
    }
}
</script>
