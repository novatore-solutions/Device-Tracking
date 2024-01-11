import { Vue, Component } from 'vue-property-decorator';
import { mutations } from '@/store/types';

@Component
export default class LoadableMixin extends Vue {
    setLoading(loading: boolean) {
        this.$store.commit(mutations.LOADING, { loading });
    }
}
