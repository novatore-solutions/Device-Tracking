<template>
    <div>
        <v-dialog v-model="model" v-if="model" persistent width="100vw" style="padding: 20px 20px;">
            <v-card>
                <v-card-title>
                    Draw the Boundary
                    <span class="Modal-Close-icon" @click="model = false"> <v-icon>$mdiCloseCircle</v-icon></span>
                </v-card-title>
                <div style="height: 86vh">
                    <div id="map" style="height: 86vh; width: auto;"></div>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<style lang="scss" scoped>
.MapControl {
    flex-grow: 1;
}

.marker-popup h6 {
    font-size: 17px;
}

::v-deep .leaflet-touch .leaflet-draw-actions a {
    background: #f5fffe !important;
    border: 0.5px solid #8fe2db !important;
    color: #009688 !important;
    box-sizing: border-box;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.08) !important;
    border-color: rgba(0, 0, 0, 0.12) !important;
    height: 30px;
    line-height: 30px;
}

::v-deep .easy-button-button {
    background: #f5fffe !important;
    border: 0.5px solid #8fe2db !important;
    color: #009688 !important;
    box-sizing: border-box;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.08) !important;
    border-color: rgba(0, 0, 0, 0.12) !important;
    height: 30px;
    line-height: 30px;
    width: 50px;
}
</style>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { convertDateToReadable } from '@/utils/datetime';
import { fill } from '@/utils/location';
import ModelMixin from '@/mixins/ModelMixin';
import { HistoryData } from '@/types/history';
import { DeviceInfo } from '@/types/device-info';
import api from '@/modules/api';
import _get from 'lodash.get';
import LoadableMixin from '@/mixins/LoadableMixin';
import * as L from "leaflet";
import 'leaflet-draw';
import "leaflet-easybutton";
import { LatLngExpression } from 'leaflet';
import 'leaflet.path.drag';

interface Latlongg { lat: number, lng: number }

@Component({
    mixins: [ModelMixin, LoadableMixin],
})
export default class MapDrawerControler extends Mixins<LoadableMixin, ModelMixin<boolean>>(
    LoadableMixin,
    ModelMixin,
) {
    styles = 'height: 100%; z-index: 0';
    convertDateToReadable = convertDateToReadable;
    fill = fill;
    perPage = 10;

    pointToCheck = null;
    map: any;
    drawingManager: any;
    polygon: any = [];
    polyline: any = null;
    editableLayers: any;
    mapCenter: LatLngExpression = [-33.865143, 151.2099];
    layer: any;
    locations: HistoryData[] = [];

    @Prop({ required: true })
    device!: DeviceInfo;

    @Prop({ required: true })
    mapBoundaryPoints!: LatLngExpression[][];

    @Watch('locations', { immediate: true, deep: true })
    onLocationsChange(locations: HistoryData[]) {
        if (locations && locations.length) {
            this.mapCenter = [locations[locations.length - 1].latitude, locations[locations.length - 1].longitude];
        }
    }

    initMap() {
        setTimeout(() => {
            this.polygon = [];
            const mapDiv = L.map('map').setView(this.mapCenter, 17);
            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 24,
                }
            ).addTo(mapDiv);
            const options = {
                draw: {
                    polygon: {
                        allowIntersection: false, // Restricts shapes to simple polygons
                        drawError: {
                            color: 'red', // Color the shape will turn when intersects
                            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                        },
                        shapeOptions: {
                            color: '#009688'
                        }
                    },
                    polyline: false,
                    circle: false,
                    marker: false,
                    rectangle: false,
                    circlemarker: false
                },
            };

            const svgIcon = `
            <div class="ping-circle ${fill(this.locations[0], 'class')}">
                                <span>1</span>
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
                            </div>`

            const locationIcon = L.divIcon({
                className: 'ping-circle-main',
                html: svgIcon,
            });

            L.marker([this.locations[0].latitude, this.locations[0].longitude], { icon: locationIcon }).addTo(mapDiv);

            const drawControl = (L as any).Control.Draw;
            const Drawer = new drawControl(options);
            this.editableLayers = new L.FeatureGroup();
            mapDiv.addLayer(this.editableLayers);
            const saveButton = L.easyButton({
                states: [
                    {
                        stateName: "default",
                        icon: '<span>Save</span>',
                        title: "Save",
                        onClick: () => {
                            if (this.polygon.length) {
                                this.$emit('childEvent', this.polygon);
                                this.model = false;
                            }
                        },
                    },
                ],
            });
            saveButton.addTo(mapDiv);

            const deleteButton = L.easyButton({
                states: [
                    {
                        stateName: "default",
                        icon: '<span>Delete</span>',
                        title: "Delete",
                        onClick: () => {
                            this.editableLayers.removeLayer(this.layer);
                            this.polygon = [];
                            mapDiv.addControl(Drawer);
                        }
                    },
                ],
            });
            deleteButton.addTo(mapDiv);
            mapDiv.addControl(Drawer);

            if (this.mapBoundaryPoints && this.mapBoundaryPoints.length > 0) {
                const firstPoint = this.mapBoundaryPoints[0];
                this.mapBoundaryPoints.push(firstPoint);
                const drawPolygon = (L as any).polygon(this.mapBoundaryPoints, { color: "#009688", draggable: true }).addTo(mapDiv);
                drawPolygon.on('add', () => {
                    const dragging = new (L as any).Handler.PathDrag(drawPolygon);
                    dragging.enable()
                })
                this.editableLayers.addLayer(drawPolygon);
                this.layer = drawPolygon;
                this.layer.on('click', () => {
                    if (!this.layer.editing.enabled()) {
                        this.layer.editing.enable();
                    } else {
                        this.layer.editing.disable();
                    }
                });
                this.polygon = this.layer.getLatLngs()[0].map((latlong: Latlongg) => {
                    return [latlong.lat, latlong.lng];
                })

                this.layer.on('edit', (e: any) => {
                    this.polygon = e.target.getLatLngs()[0].map((latlong: Latlongg) => {
                        return [latlong.lat, latlong.lng];
                    });
                });
                this.layer.on('dragend', (e: any) => {
                    this.layer.editing.disable();
                    const updatedPoints = e.target.getLatLngs();
                    this.polygon = updatedPoints[0].map((latlong: Latlongg) => {
                        return [latlong.lat, latlong.lng];
                    });
                });
                mapDiv.removeControl(Drawer);
            }
            mapDiv.on("draw:created", (e) => {
                this.layer = e.layer;
                const area = L.GeometryUtil.geodesicArea(this.layer.getLatLngs()[0]);
                const areaInSquareMeters = Number(area * 0.0001);
                this.layer.on('add', () => {
                    const dragging = new (L as any).Handler.PathDrag(this.layer);
                    dragging.enable()
                })
                if (areaInSquareMeters < 0.6) {
                    this.$toasted.error(`The drawn boundary is too small.`);
                } else {
                    this.editableLayers.addLayer(this.layer);
                    this.layer.on('click', () => {
                        if (!this.layer.editing.enabled()) {
                            this.layer.editing.enable();
                        } else {
                            this.layer.editing.disable();
                        }
                    });
                    this.polygon = this.layer.getLatLngs()[0].map((latlong: Latlongg) => {
                        return [latlong.lat, latlong.lng];
                    })

                    this.layer.on('edit', (e: any) => {
                        this.polygon = e.target.getLatLngs()[0].map((latlong: Latlongg) => {
                            return [latlong.lat, latlong.lng];
                        });
                    });
                    this.layer.on('dragend', (e: any) => {
                        this.layer.editing.disable();
                        const updatedPoints = e.target.getLatLngs();
                        this.polygon = updatedPoints[0].map((latlong: Latlongg) => {
                            return [latlong.lat, latlong.lng];
                        });
                    });
                    mapDiv.removeControl(Drawer);
                }
            })
        }, 20)
    }
    @Watch('model', { immediate: true })
    onModelChange() {
        if (this.model) this.initMap()
    }

    async fetchLocation(device?: DeviceInfo) {
        device = device || this.device;
        if (!device) return;
        this.setLoading(true);
        try {
            const response = await api.getHistoryForMap(device.deviceUUID, { perPage: this.perPage });
            this.locations = response;
        } catch (error) {
            this.$toasted.error(`Unable to load history for device ${device.name}`);
        } finally {
            this.setLoading(false);
        }
    }

    @Watch('device', { immediate: true, deep: true })
    async onDeviceChange(device: DeviceInfo, prevDevice: DeviceInfo) {
        if (_get(device, '_id') !== _get(prevDevice, '_id')) {
            this.fetchLocation(device);
        }
    }
}
</script>
