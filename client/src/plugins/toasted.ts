import Vue from 'vue';
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
    duration: 4000,
    keepOnHover: true,
    position: 'top-center',
    fullWidth: false,
    className:"customeAlertClass",
    // action : {
    //     text : 'x',
    //     onClick : (e, toastObject) => {
    //         toastObject.goAway(0);
    //     }
    // },
});
