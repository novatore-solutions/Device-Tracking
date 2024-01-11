import Vue from 'vue';
import { Swiper as SwiperClass, Pagination, Navigation, Mousewheel, Autoplay } from 'swiper';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';

SwiperClass.use([Pagination, Mousewheel, Navigation, Autoplay]);
Vue.use(getAwesomeSwiper(SwiperClass));

// const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);

import 'swiper/swiper-bundle.min.css';
