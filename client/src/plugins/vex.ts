import Vue from 'vue';
import vex from 'vex-js';
import vexDialog from 'vex-dialog';

// Main css
import 'vex-js/dist/css/vex.css';

// Themes (Import all themes you want to use here)
import 'vex-js/dist/css/vex-theme-plain.css';

// Options
vex.defaultOptions = {
    ...(vex.defaultOptions || {}),
    className: 'vex-theme-plain',
};

// Register vex-dialog
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(vex as any).registerPlugin(vexDialog);

Vue.prototype.$vex = vex;
