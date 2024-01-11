<template>
    <div class="DeviceOverviewInfoRow" v-if="show">
        <v-card v-if="title == 'Battery status'" elevation="0" style="position: relative">
            <v-card-text>
                <slot name="default">
                    <div class="info-caption accent--text Walsheim-Pro-family" v-html="title"></div>
                    <div v-if="loading">Loading...</div>
                    <div v-else class="info-value Helvetica-family">{{ value }}%</div>
                </slot>
            </v-card-text>

            <div v-if="!loading" class="battery" style="position: absolute; right: 14px; top: 0">
                <div
                    :class="
                        value < 15
                            ? 'battery-level battery-alert'
                            : value < 25
                            ? 'battery-level battery-warn'
                            : 'battery-level'
                    "
                    :style="{ height: value + '%' }"
                ></div>
            </div>
        </v-card>

        <v-card v-if="title != 'Battery status'" elevation="0">
            <v-card-text>
                <slot name="default">
                    <div class="info-caption accent--text Walsheim-Pro-family" v-html="title"></div>
                    <div v-if="loading">Loading...</div>
                    <div v-else class="info-value Helvetica-family" v-html="value"></div>
                </slot>
            </v-card-text>
        </v-card>
    </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class DeviceOverviewInfoRow extends Vue {
    @Prop({ required: false, default: '' })
    title!: string;

    @Prop({ required: false, default: '' })
    value!: string | number;

    @Prop({ required: false, default: false })
    show!: boolean;

    @Prop({ required: false, default: false })
    loading!: boolean;
}
</script>
