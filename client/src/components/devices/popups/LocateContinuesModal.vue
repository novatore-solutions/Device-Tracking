<template>
    <v-dialog v-model="model" v-if="model" class="PauseSubscriptionPopup" max-width="450px" top="20">
        <v-card>
            <v-card-title>
                Locate Device
                <span class="Modal-Close-icon" @click="model = false"><v-icon>$mdiCloseCircle</v-icon></span>
            </v-card-title>
            <v-card-text class="Modal-bg-color locate-device-modal">
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-checkbox v-model="continues" @click="onCheckboxClick">
                                <template class="mb-0" v-slot:label>
                                    <div class="Helvetica-font-normal hidden-tooltip">
                                        <div class="bottom">
                                            <template> Continues </template>
                                        </div>
                                    </div>
                                </template>
                            </v-checkbox>
                        </v-col>

                        <v-col cols="12">
                            <button
                                @click="onContinue"
                                type="button"
                                class="btn btn-primary Modal-Primary-btn btn-block Helvetica-font-normal"
                            >
                                Continue
                            </button>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';
import ValidateableMixin from '@/mixins/ValidateableMixin';

@Component({
    components: {},
    mixins: [ModelMixin, ValidateableMixin],
})
export default class LocateContinuesModal extends Mixins<ValidateableMixin, ModelMixin<boolean>>(
    ValidateableMixin,
    ModelMixin,
) {
    @Prop({ required: true })
    continues!: boolean;

    @Prop({ required: true })
    onContinue!: () => void;

    @Prop({ required: true })
    onCheckboxClick!: () => void;

    onClose() {
        this.model = false;
    }
}
</script>
