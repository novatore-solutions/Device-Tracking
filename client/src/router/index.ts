import Vue from 'vue';
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router';

import DeviceOverview from '../views/Device/DeviceOverview.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    // General
    {
        path: '/',
        name: 'device-overview',
        component: DeviceOverview,
        meta: {
            title: 'AirBolts',
            docTitle: 'Device overview',
        },
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(async (to: Route, from: Route, next: NavigationGuardNext) => {
    return next();
});

export default router;
