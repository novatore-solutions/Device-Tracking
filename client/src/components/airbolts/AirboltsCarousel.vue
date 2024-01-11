<template>
    <div class="AirboltsCarousel">
        <swiper class="swiper" :spaceBetween="30" :options="swiperOption()">
            <swiper-slide v-for="(device, index) in devices" :key="index">
                <device-card
                    Cardclass="Slider-deviceCard"
                    :device="device"
                    @click.native="handleDeviceClick(device)"
                    :active="current ? device._id === current._id : false"
                ></device-card>
            </swiper-slide>
        </swiper>

        <div id="swiper-button-prev" class="swiper-custom-arrows swiper-button-prev swiper-button-prev-premium">
            <v-icon>$mdiChevronLeft</v-icon>
        </div>
        <div id="swiper-button-next" class="swiper-custom-arrows swiper-button-next swiper-button-next-premium">
            <v-icon>$mdiChevronRight</v-icon>
        </div>
        <div id="position-right" class="position-right" style="display: none"></div>
        <div id="position-left" class="position-left" style="display: none"></div>
        <div id="position-right-1" class="position-right-1" style="display: none"></div>
        <div id="position-left-1" class="position-left-1" style="display: none"></div>
    </div>
</template>

<style lang="scss" scoped>
.AirboltsCarousel {
    position: relative;
    min-height: 180px;
    padding-left: 38px;
    padding-right: 32px;
    max-width: 80vw;

    @media (max-width: 768px) {
        max-width: 100vw;
    }
    @media (min-width: 1410px) {
        max-width: 100vw;
    }

    ::v-deep {
        .swiper-container {
            min-height: 180px;
            width: 100%;
        }
        .swiper-slide {
            text-align: center;
            width: auto;
        }
        .slide-image {
            height: 400px;
            width: auto;
        }
        .my-gallery figure {
            margin: 0px;
        }
    }
}
.position-right {
    position: absolute;
    right: 3px;
    top: 0;
    width: 40px;
    border-radius: 99px;
    margin: 0 20px;
    min-height: 169px;
    background: transparent;
    border: 1px solid rgba(22, 50, 92, 0.08);
    z-index: 0;
}
.position-left {
    position: absolute;
    left: 10px;
    border: 1px solid rgba(22, 50, 92, 0.08);
    width: 40px;
    border-radius: 99px;
    margin: 0 20px;
    top: 0;
    min-height: 169px;
    background: transparent;
    z-index: 0;
}
.position-right-1 {
    position: absolute;
    right: -5px;
    top: 0;
    width: 40px;
    border-radius: 17px;
    margin: 0 20px;
    min-height: 169px;
    background: transparent;
    border: 1px solid rgba(22, 50, 92, 0.06);
    z-index: 0;
}
.position-left-1 {
    position: absolute;
    left: 2px;
    border: 1px solid rgba(22, 50, 92, 0.06);
    width: 40px;
    border-radius: 17px;
    margin: 0 20px;
    top: 0;
    min-height: 169px;
    background: transparent;
    z-index: 0;
}
</style>

<script lang="ts">
import { State, Mutation } from 'vuex-class';
import { DeviceInfo } from '@/types/device-info';
import { Component, Vue, Prop } from 'vue-property-decorator';
import DeviceCard from '@/components/devices/DeviceCard.vue';
import { mutations } from '@/store/types';
import { SetDeviceMutationType } from '@/types/store/mutations';

@Component({
    components: {
        DeviceCard,
    },
})
export default class AirboltsCarousel extends Vue {
    @State('devices')
    devices!: DeviceInfo[];

    @State('device')
    current!: DeviceInfo;

    @Mutation(mutations.SET_CURRENT_DEVICE)
    setCurrentDevice!: SetDeviceMutationType;

    handleDeviceClick(device: DeviceInfo) {
        if (device._id != this.current._id) {
            // this.setCurrentDevice({ device });
            this.$router.push({ name: 'device-overview', params: { deviceUUID: device.deviceUUID as string } });
        }
    }

    protected swiperOption() {
        return {
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                },
                730: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1000: {
                    slidesPerView: 3,
                },
                1400: {
                    slidesPerView: 3,
                },
                1600: {
                    slidesPerView: 3,
                },
                2100: {
                    slidesPerView: 3,
                },
            },
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            // slidesPerView: 'auto',
            // loop: true,
            centerInsufficientSlides: true,
            // centeredSlides: true
            allowTouchMove: false,
        };
    }

    mounted() {
        this.handleSAwiperAnimation();

        // Handle slider btn click
        let el = document.querySelectorAll(
            '.AirboltsCarousel .swiper-button-next, .AirboltsCarousel .swiper-button-prev',
        );
        for (var i = 0; i < el.length; i++) {
            el[i].addEventListener('click', () => {
                setTimeout(() => {
                    this.handleSAwiperAnimation();
                }, 200);
            });
        }
    }
    updated() {
        this.handleSAwiperAnimation();
    }

    handleSAwiperAnimation() {
        const nextBtn = document.getElementById('swiper-button-next') as HTMLElement;
        const prevBtn = document.getElementById('swiper-button-prev') as HTMLElement;
        let isNext = nextBtn.classList.contains('swiper-button-disabled') ? false : true;
        let isPrev = prevBtn.classList.contains('swiper-button-disabled') ? false : true;

        let right = document.getElementById('position-right') as HTMLElement;
        let right1 = document.getElementById('position-right-1') as HTMLElement;
        let left = document.getElementById('position-left') as HTMLElement;
        let left1 = document.getElementById('position-left-1') as HTMLElement;

        right.style.display = isNext ? 'block' : 'none';
        right1.style.display = isNext ? 'block' : 'none';
        left.style.display = isPrev ? 'block' : 'none';
        left1.style.display = isPrev ? 'block' : 'none';
    }
}
</script>
