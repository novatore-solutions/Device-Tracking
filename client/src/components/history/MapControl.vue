<template>
    <div class="MapControl">
        <l-map use-global-leaflet :style="styles" :zoom="zoom" :center="mapCenter" ref="lmap">
            <l-tile-layer :url="url"></l-tile-layer>

            <l-polyline v-if="perPage < 50" :lat-lngs="polyline" color="#0877DB"></l-polyline>

            <l-marker
                v-for="(location, index) in locations"
                :lat-lng="[location.latitude, location.longitude]"
                :key="index"
            >
                <l-popup>
                    <div class="marker-popup position-relative">
                        <h6 class="navy-color halventica-bold">
                            {{ location.address }}
                        </h6>
                        <span class="navy-color">
                            {{ `${getTimeStamp(location)}` }}
                        </span>
                    </div>
                </l-popup>

                <l-icon v-if="index == 0" class-name="ping-circle-main">
                    <div :class="`ping-circle ${fill(location, 'class')}`">
                        <span :style="`color: `">{{ index + 1 }}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            width="24"
                            height="43"
                            viewBox="0 0 40 40"
                            class="svg-ping"
                        >
                            <image
                                id="Vector_Smart_Object"
                                data-name="Vector Smart Object"
                                width="24"
                                height="43"
                                xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAaCAYAAABVX2cEAAAB20lEQVQ4jaWVvUuVcRTHv11vqKFRgpMaQkNGL67RHi4OjgqC4SBIi4t/QEPSCxJCba3RpkNLS2OJLxGiQ0M2tCQ6XHSovGofOfUVbg/P4/Pc64HDj3t+5/u55/fynJ+ANL8OPAEWgZ/8syqwAcwCfWm6ZKANeAX8MaACvAfmPVYcPwJeAK1ZsE5gzcmfgSGgnPizEjDo+bBV6/6DNQPLTphJgSS9CXjq/NiKllrYI088y4Ekfda6xyewbuA3sO4K64GVvTVxOF0lSeOSmiU9lLSv+uzQuvOSxs7FXkm6JqlD0lGdsLCypIqkT1HZDUlLDYLk6qKg/oBdkLTTIOjEtiRdClhVUvsZYaGvxp59caDvDLBglKKyjz6AngZBPdZ/CNiCgyMNwkY9zscy4458995d9ekUtbgWmx57o7IDSXOSrki6X2dVE9a9/MupaT07wA/gYsFPqR3Ytq4t2YIm/dHOFYQ9d/6DtH4WbWXJje9uDuiO81asS+20N90BNr2MrOV9BfaB/tPadvi0y3+TAXvt+em8NyA8rss7C6YSc1OOv3VeLiy8A/gGHAIDjt3z79iCy0Vep1q/DewBu8Cwx/BbWZq844+qDmrezaguM7/IfRoDfgGjp+aBjgHBQfuVekQbDgAAAABJRU5ErkJggg=="
                            />
                        </svg>
                        <div class="circle"></div>
                    </div>
                </l-icon>

                <l-icon v-else class-name="smallMarker">
                    <span :style="`color: ${fill(location)}`"> {{ index + 1 }}</span>
                    <svg width="22" height="32" viewBox="0 0 31 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="10" fill="white" />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.73963 26.593C6.23271 30.4118 10.0037 34.5474 15.0526 38.9999C20.1015 34.5474 23.8725 30.4118 26.3655 26.593C28.8586 22.7743 30.1052 19.2399 30.1052 15.9899C30.1052 11.115 28.5921 7.23123 25.5659 4.33874C22.5397 1.44624 19.0352 0 15.0526 0C11.0699 0 7.56549 1.44624 4.53929 4.33874C1.5131 7.23123 0 11.115 0 15.9899C0 19.2399 1.24654 22.7743 3.73963 26.593ZM15.0525 24.6314C20.3428 24.6314 24.6314 20.3428 24.6314 15.0525C24.6314 9.76223 20.3428 5.4736 15.0525 5.4736C9.76223 5.4736 5.4736 9.76223 5.4736 15.0525C5.4736 20.3428 9.76223 24.6314 15.0525 24.6314Z"
                            :fill="fill(location)"
                        />
                    </svg>
                </l-icon>
            </l-marker>

            <l-polygon v-if="device.mapBoundaryPoints" :lat-lngs="device.mapBoundaryPoints" color="green"></l-polygon>

            <l-control position="topright">
                <!-- <slot name="bottomleft"></slot> -->
                <span @click="showMapModal" class="map-expand-button"
                    ><v-icon size="15" color="#9eaab6">$mdiScanHelper</v-icon></span
                >
            </l-control>

            <!-- <l-feature-group ref="featureGroup"> </l-feature-group> -->
        </l-map>

        <map-modal
            :perPage="perPage"
            :zoom="zoom"
            :mapCenter="mapCenter"
            :url="url"
            :polyline="polyline"
            :locations="locations"
            v-model="isMapModal"
            :showModalMap="showModalMap"
            :device="device"
        />
    </div>
</template>

<style lang="scss" scoped>
.MapControl {
    flex-grow: 1;
}
.marker-popup h6 {
    font-size: 17px;
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Icon, LatLngBoundsExpression } from 'leaflet';
import { LMap, LTileLayer, LMarker, LControl, LPolyline, LIcon, LGeoJson, LPopup, LPolygon } from 'vue2-leaflet';
import { DeviceInfo } from '@/types/device-info';
import { HistoryData } from '@/types/history';
import { convertDateToReadable } from '@/utils/datetime';
import MapModal from '@/components/devices/popups/MapModal.vue';
import { fill } from '@/utils/location';

type D = Icon.Default & {
    _getIconUrl?: string;
};

delete (Icon.Default.prototype as D)._getIconUrl;
Icon.Default.mergeOptions({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
});

@Component({
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LControl,
        LPolyline,
        LIcon,
        LGeoJson,
        LPopup,
        'map-modal': MapModal,
        LPolygon,
    },
})
export default class MapControl extends Vue {
    url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    mapCenter: number[] = [-33.865143, 151.2099];
    polyline: LatLngBoundsExpression = [];
    convertDateToReadable = convertDateToReadable;
    isMapModal = false;
    showModalMap = false;
    fill = fill;
    // protected leafletObject= null

    @Prop({ required: true })
    device!: DeviceInfo;

    @Prop({ required: true, default: [] })
    locations!: HistoryData[];

    @Prop({ required: false, default: 8 })
    zoom!: number;

    @Prop({ required: true, default: 10 })
    perPage!: number;

    @Prop({ required: false, default: 'height: 350px; z-index: 0' })
    styles!: string;

    @Watch('locations', { immediate: true, deep: true })
    onLocationsChange(locations: HistoryData[]) {
        this.polyline = [];
        if (locations && locations.length) {
            // const lats = locations.map((l) => l.latitude);
            // const lons = locations.map((l) => l.longitude);

            // map focus
            // const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
            // const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2;
            // this.mapCenter = [centerLat, centerLon];
            this.mapCenter = [locations[locations.length - 1].latitude, locations[locations.length - 1].longitude];

            const locationsCorordinates: LatLngBoundsExpression = locations.map((l: HistoryData) => [
                l.latitude,
                l.longitude,
            ]);
            this.polyline = locationsCorordinates;
        }

        if (this.$refs.lmap) {
            const bounds: LatLngBoundsExpression = locations.map((l: HistoryData) => [l.latitude, l.longitude]);
            if (bounds.length > 0) (this.$refs.lmap as LMap).fitBounds(bounds);
        }
    }

    // addLayerToMapWithBindings(layer, linkedResource, resourceType) {
    //     layer.mapboardId = linkedResource.id;
    //     layer.resourceType = resourceType;
    //     layer.addTo(this.featureGroup.mapObject);
    //     this.bindTooltipAndEvents(layer, linkedResource, resourceType);
    // }

    //     async onLeafletReady() {
    //   await this.$nextTick();
    //   this.leafletObject = this.$refs.lmap.leafletObject;

    //   new L.Toolbar2.DrawToolbar({
    //     position: "topleft",
    //   }).addTo(this.leafletObject);
    // },

    showMapModal() {
        this.isMapModal = true;
        this.showModalMap = false;
        setTimeout(() => {
            this.showModalMap = true;
        }, 10);
    }

    getTimeStamp(location: HistoryData) {
        if (!location.timeCreated && !location.timestamp) return 'N/A';
        let dateVal = location.timeCreated ? location.timeCreated : new Date((location.timestamp as number) * 1000);
        return convertDateToReadable(dateVal);
    }
}
</script>
