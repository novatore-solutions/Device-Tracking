import { Vue, Component, Prop } from 'vue-property-decorator';
import { Changeable } from '@/types/base';

@Component
export default class ModelMixin<T> extends Vue {
    @Prop({ required: true })
    readonly value!: T;

    get model() {
        return this.value;
    }

    set model(newModel) {
        const asChangeable = this.model as Changeable;

        if (asChangeable && Object.prototype.hasOwnProperty.call(asChangeable, 'changed')) {
            asChangeable.changed = true;
        }

        this.$emit('input', newModel);
    }
}
