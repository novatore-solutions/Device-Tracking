<template>
    <v-overlay class="loading-indicator" :value="loading" z-index="999">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <div v-if="message" class="text-h5">{{ message }}</div>
    </v-overlay>
</template>

<style lang="scss">
.loading-indicator {
    .v-overlay__content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component({
    components: {},
})
export default class Loader extends Vue {
    @State('loading')
    readonly loading!: boolean;

    @State('loadingMessage')
    readonly message!: string;
}
</script>
