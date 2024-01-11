<template>
    <div class="DeviceHistoryGrid">
        <v-table
            title=""
            :headers="headers"
            :itemSlots="slots"
            :items="locations"
            :perPage="perPage"
            :page="page"
            :total="total"
            :loading="false"
            :onOptionsChange="handleTableChange"
        ></v-table>
    </div>
</template>

<style lang="scss" scoped>
.DeviceHistoryGrid tr:nth-child(odd) {
    background-color: #f9f9fd;
    border-radius: 10px !important;
}
.DeviceHistoryGrid tr {
    display: block;
    border-radius: 10px !important;
}
.DeviceHistoryGrid tr td {
    border-bottom: none !important;
}
.table-div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 10px;
}
.table-div .Helvetica-family {
    font-size: 14px;
    color: #0d2a48;
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import VTable from '@/components/Table.vue';
import { HistoryData } from '@/types/history';
import { DataOptions } from 'vuetify';
import dayjs from 'dayjs';
import { DeviceInfo, DeviceType } from '@/types/device-info';
import { fill } from '@/utils/location';
import { handleTempUnit } from '@/utils/temperature';

@Component({
    components: {
        VTable,
    },
})
export default class DeviceHistoryGrid extends Vue {

    protected defaultHeaders = [
        { text: 'Address', value: 'address' },
        { text: 'Created On', align: 'end', value: 'timeCreated' },
    ];

    @Prop({ required: true })
    device!: DeviceInfo;

    @Prop({ required: true, default: [] })
    locations!: HistoryData[];

    @Prop({ required: true, default: 20 })
    perPage!: number;

    @Prop({ required: true })
    total!: number;

    @Prop({ required: true, default: 1 })
    page!: number;

    @Prop({ required: true })
    onTableChange!: (page: number, itemsPerPage: number) => void;

    protected fill = fill;
    protected handleTempUnit = handleTempUnit;

    headers = [...this.defaultHeaders];

    mounted() {
        this.setHeaders();
    }

    @Watch('device')
    onDeviceChange() {
        this.setHeaders();
    }

    setHeaders() {
        this.headers =
            this.device.deviceType === DeviceType.AirboltGps
                ? [
                      { text: 'Address', value: 'address' },
                      //   { text: 'Locked', value: 'isLocked' },
                      { text: 'Temperature', value: 'modem_temperature' },
                      { text: 'Type', value: 'alertType' },
                      { text: 'Accuracy', value: 'type' },
                      { text: 'Created On', align: 'end', value: 'timeCreated' },
                  ]
                : [...this.defaultHeaders];
    }

    slots = [
        {
            name: 'item.address',
            template: ({ item }: { item: HistoryData }) =>
                `<span class="Helvetica-family table-div location-addres-coloumn">${
                    item.address ? item.address : 'N/A'
                }</span>`,
        },
        {
            name: 'item.modem_temperature',
            template: ({ item }: { item: HistoryData }) =>
                `<span class="Helvetica-family table-div">${
                    item.modem_temperature
                        ? `${item.modem_temperature} °${this.device.temperature?.unit?.toUpperCase() ?? 'C'}`
                        : 'N/A'
                }</span>`,
        },
        {
            name: 'item.alertType',
            template: ({ item }: { item: HistoryData }) =>
                `<span class="Helvetica-family table-div">${item.alertType || 'Location'}</span>`,
        },
        {
            name: 'item.type',
            template: ({ item }: { item: HistoryData }) =>
                `<span class="history-grid-location-type Helvetica-family table-div" style="background-color:${fill(
                    item,
                )}"></span>`,
        },
        {
            name: 'item.timeCreated',
            template: ({ item }: { item: HistoryData }) =>
                item.timeCreated || (item.timestamp && item.timestamp > 0)
                    ? `<div class="table-div Helvetica-family d-flex flex-wrap justify-content-end">
                                    <div>
                                        ${this.convertToReadable(
                                            item.timeCreated,
                                            item.timestamp as number,
                                            'DD MMM YY',
                                        )}
                                    </div>
                                    <div class="dot-before">
                                        ${this.convertToReadable(item.timeCreated, item.timestamp as number, 'hh:mmA')}
                                    </div>
                                </div>`
                    : `<div class="table-div Helvetica-family d-flex flex-wrap justify-content-end">
                            <div> N/A </div>
                        </div>`,
        },
    ];

    convertToReadable(timeCreated: Date, timestamp: number, formate: string) {
        if (!timeCreated && !timestamp) return 'N/A';
        let dateVal = timeCreated ? new Date(timeCreated) : new Date(timestamp * 1000);
        return dayjs(dateVal).format(formate);
    }

    handleTableChange(options: DataOptions) {
        const { page, itemsPerPage } = options;
        this.onTableChange(page, itemsPerPage);
    }
}
</script>
