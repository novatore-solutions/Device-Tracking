<template>
    <span>
        <drawer :permanent="this.permanent" :isDrawer="this.isDrawer" :toggleDrawer="this.toggleDrawer" />
        <v-app-bar v-if="!hideControls" app color="white" elevation="0">
            <v-app-bar-nav-icon v-if="showExpnadbtn" @click="toggleDrawer(true)"></v-app-bar-nav-icon>
            <slot name="pre-toolbar"></slot>
            <div class="d-flex align-center">
                <div class="text-h5 top-page-title" v-html="title"></div>
            </div>

            <v-spacer></v-spacer>
            <slot name="toolbar"></slot>

            <top-account-menu></top-account-menu>
        </v-app-bar>
        <span class="small-medium-search">
            <slot name="searchField"></slot>
        </span>
    </span>
</template>

<style lang="scss">
.v-toolbar__content,
.v-toolbar__extension {
    padding-top: 15px !important;
    padding-right: 30px !important;
    padding-left: 44px !important;
}
.v-toolbar__content_1 {
    padding-top: 15px !important;
    padding-right: 24px !important;
    padding-left: 36px !important;
}
.v-toolbar__content_2 {
    padding-top: 15px !important;
    padding-right: 24px !important;
    padding-left: 36px !important;
}
.v-application .top-page-title {
    font-family: GT Walsheim Pro !important;
    font-style: normal;
    font-weight: bold;
    font-size: 28px !important;
}

@media (max-width: 576px) {
    .v-application .top-page-title {
        font-size: 17px !important;
        display: -webkit-box;
        max-width: 500px;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .v-toolbar__content,
    .v-toolbar__extension {
        padding-top: 15px !important;
        padding-right: 15px !important;
        padding-left: 15px !important;
    }
    .v-toolbar__content_1 {
        padding-top: 15px !important;
        padding-right: 23px !important;
        padding-left: 6px !important;
    }
    .v-toolbar__content_2 {
        padding-top: 15px !important;
        padding-right: 6px !important;
        padding-left: 6px !important;
    }
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import Drawer from '@/components/app/Drawer.vue';
import TopAccountMenu from '@/components/app/TopAccountMenu.vue';

@Component({
    components: {
        TopAccountMenu,
        Drawer,
    },
})
export default class TopNavBar extends Vue {
    @Prop({ type: String, required: true })
    title!: string;

    @Getter('isLoggedOn')
    readonly isLoggedOn!: boolean;

    protected isDrawer = false;
    protected permanent = true;
    protected showExpnadbtn = false;

    mounted() {
        let x = window.matchMedia('(max-width: 768px)');
        this.handleWindowWidth(x);
        x.addListener(this.handleWindowWidth);
    }

    handleWindowWidth(x: any) {
        if (x.matches) {
            this.permanent = false;
            this.showExpnadbtn = true;
        } else {
            this.permanent = true;
            this.showExpnadbtn = false;
        }
    }

    toggleDrawer(val: boolean) {
        this.isDrawer = val;
    }

    get hideControls() {
        return !this.isLoggedOn || (this.$route.name && this.$route.name.startsWith('account-'));
    }
}
</script>
