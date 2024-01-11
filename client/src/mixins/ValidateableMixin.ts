import { Validateable } from '@/types/base';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ValidateableMixin extends Vue {
    protected formValid = true;

    public validate() {
        return (this.$refs.form as Validateable).validate();
    }

    public resetValidation() {
        return (this.$refs.form as Validateable).clear();
    }
}
