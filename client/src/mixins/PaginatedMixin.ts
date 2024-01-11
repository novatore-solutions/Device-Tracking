import { DEFAULT_PAGE_SIZE, Paginated } from '@/types/pagination';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class PaginatedMixin<T> extends Vue {
    protected pagination = {
        lastPage: 1,
        page: 0,
        prev: 0,
        next: 0,
        perPage: DEFAULT_PAGE_SIZE,
        total: 0,
        hasNext: false,
        hasPrev: false,
        filter: '',
    };

    protected items: T[] = [];

    updatePagination(paginated: Paginated<T>) {
        this.pagination.page = paginated.pagination.page;
        this.pagination.prev = paginated.pagination.prev;
        this.pagination.next = paginated.pagination.next;
        this.pagination.perPage = paginated.pagination.perPage;
        this.pagination.total = paginated.pagination.total;
        this.pagination.hasPrev = paginated.pagination.hasPrev;
        this.pagination.hasNext = paginated.pagination.hasNext;
        this.pagination.lastPage = Math.floor(paginated.pagination.total / this.pagination.perPage);

        this.items = paginated.data;
    }
}
