declare module 'vue-gravatar';
declare module 'vue-dayjs';
declare module 'vex-dialog';

declare module '*.svg' {
    import Vue, { VueConstructor } from 'vue';
    const content: VueConstructor<Vue>;
    export default content;
}

declare module '*.png' {
    import Vue, { VueConstructor } from 'vue';
    const content: VueConstructor<Vue>;
    export default content;
}
