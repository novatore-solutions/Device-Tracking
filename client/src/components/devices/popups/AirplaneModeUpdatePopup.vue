<template>
    <v-dialog v-model="model" v-if="model" class="PasswordPopup" max-width="450px" top="20">
        <v-card>
            <v-card-title>
                Airplane Mode
                <span class="Modal-Close-icon" @click="model = false"><v-icon>$mdiCloseCircle</v-icon></span>
            </v-card-title>
            <v-card-text class="Modal-bg-color">
                <v-container>
                    <form>
                        <v-row>
                            <v-col cols="12">
                                <label class="Helvetica-font-normal">Duration</label>
                                <v-select
                                    class="no-message navy-color Helvetica-font-normal"
                                    v-model="duration"
                                    :items="airplaneModeDurations"
                                    outlined
                                    dense
                                    item-text="text"
                                ></v-select>
                            </v-col>

                            <v-col cols="12">
                                <button
                                    type="submit"
                                    class="btn btn-primary Modal-Primary-btn btn-block Helvetica-font-normal"
                                >
                                    Set
                                </button>
                            </v-col>
                        </v-row>
                    </form>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Mixins, Watch, Vue, Prop } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';
import ValidateableMixin from '@/mixins/ValidateableMixin';
import { DeviceInfo } from '@/types/device-info';
import { airplaneModeDurations, defaultAirplaneModeDuration } from '@/constants/options';

@Component({
    components: {},
    mixins: [ModelMixin, ValidateableMixin],
})
export default class AirplaneModeUpdatePopup extends Mixins<ValidateableMixin, ModelMixin<boolean>>(
    ValidateableMixin,
    ModelMixin,
) {
    airplaneModeDurations = airplaneModeDurations;
    duration = defaultAirplaneModeDuration;

    @Prop({ required: true })
    device!: DeviceInfo;

    @Watch('model', { immediate: true })
    onModelChange(newValue: boolean, oldValue: boolean) {
        if (newValue && !oldValue) this.duration = defaultAirplaneModeDuration;
    }
}
</script>
