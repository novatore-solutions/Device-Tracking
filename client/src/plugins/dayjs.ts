import Vue from 'vue';
import Dayjs from 'vue-dayjs';

Vue.use(Dayjs, {
    lang: 'en',
    filters: {
        format: 'format',
    },
    directives: {},
});
