<template>
    <!-- <v-row> -->
    <!-- <v-col> -->
    <!-- <v-card> -->
    <!-- <v-card-title>
                    <slot name="title">
                        {{ title }}
                    </slot>

                    <slot name="button-refresh">
                        <v-btn icon color="green" @click="handleRefresh">
                            <v-icon>$mdiCached</v-icon>
                        </v-btn>
                    </slot>

                    <slot name="button-add">
                        <v-btn icon color="info" v-if="newItemUrl" :to="newItemUrl">
                            <v-icon>$mdiPlus</v-icon>
                        </v-btn>
                    </slot>

                    <slot name="toolbar"></slot>

                    <v-spacer></v-spacer>

                    <slot name="search">
                        <v-text-field
                            class="search"
                            v-if="!disableSearch"
                            v-model="search"
                            append-icon="$mdiMagnify"
                            label="Search"
                            single-line
                            hide-details
                            @keyup="searchChanged"
                            @click:append="searchChanged"
                        ></v-text-field>
                    </slot>
                </v-card-title> -->
    <div>
        <!-- hide-default-header -->

        <v-data-table
            :headers="getHeaders"
            :items="items"
            :items-per-page="perPage"
            :class="getClass"
            :options.sync="options"
            :server-items-length="total"
            @click:row="handleRowClick"
            :page.sync="page"
            hide-default-footer
            @page-count="pageCount = $event"
        >
            <template v-for="(sl, index) in itemSlots" v-slot:[sl.name]="props">
                <div :key="index" v-html="sl.template(props)" />
            </template>
            <!-- Pass on all named slots -->
            <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" :props="props" />

            <!-- Pass on all scoped slots -->
            <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
                <slot :name="slot" v-bind="scope" />
            </template>
        </v-data-table>
        <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount" :total-visible="6"></v-pagination>
        </div>
    </div>
    <!-- </v-card> -->
    <!-- </v-col> -->
    <!-- </v-row> -->
</template>

<style lang="scss" scoped>
.row {
    align-self: start;

    ::v-deep tr {
        cursor: pointer;
    }
}
</style>

<script lang="ts">
import { Debounce } from '@/modules/decorators';
import { Dictionary } from '@/types/base';
import { DEFAULT_PAGE_SIZE } from '@/types/pagination';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { DataOptions, DataTableHeader } from 'vuetify';

export type TableHeader = string | DataTableHeader;

@Component({
    components: {},
})
export default class Table<T> extends Vue {
    pageCount = 0;

    @Prop({ default: '' })
    protected readonly title!: string;

    @Prop({ default: [] })
    readonly items!: T[];

    @Prop({ default: [], required: true })
    protected readonly headers!: TableHeader[];

    @Prop({ default: '' })
    protected readonly className!: string;

    @Prop({ default: 0 })
    readonly total!: number;

    @Prop({ default: DEFAULT_PAGE_SIZE })
    readonly perPage!: number;

    @Prop({ default: 1 })
    readonly page!: number;

    @Prop({ default: false })
    protected readonly loading!: boolean;

    @Prop({ default: 'Loading data...' })
    protected readonly loadingText!: string;

    @Prop({ default: false })
    protected readonly disableSearch!: boolean;

    @Prop({ default: '' })
    protected readonly newItemUrl?: string;

    @Prop({ type: Array, required: false, default: () => [] })
    readonly itemSlots!: Dictionary[];

    @Prop({ type: Function, required: true })
    onOptionsChange!: (options: DataOptions) => void;

    @Prop({ type: Function, required: false })
    onSearchChange!: (search: string) => void;

    @Prop({ type: Function, required: false })
    onRowClick!: (row: T) => void;

    @Prop({ type: Function, required: false })
    onRefresh!: () => void;

    options: DataOptions = {
        page: this.page,
        itemsPerPage: this.perPage,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
    };

    protected search = '';

    get getClass() {
        return `elevation-1 ${this.className || ''}`;
    }

    get getHeaders() {
        const defaultHeader = {
            align: 'start',
            sortable: false,
            filterable: false,
            groupable: false,
        };

        return this.headers.map((header) => {
            if (typeof header === 'string') {
                return {
                    ...defaultHeader,
                    text: header,
                    value: header,
                };
            }

            return {
                ...defaultHeader,
                ...header,
            };
        });
    }

    handleRowClick(row: T) {
        if (this.onRowClick) {
            this.onRowClick(row);
        }
    }

    handleRefresh() {
        if (this.onRefresh) {
            this.onRefresh();
        }
    }

    @Watch('options')
    protected optionsChanged() {
        this.onOptionsChange(this.options);
    }

    @Watch('search')
    @Debounce(500)
    protected searchChanged() {
        if (this.onSearchChange) {
            this.onSearchChange(this.search);
        }
    }
}
</script>
