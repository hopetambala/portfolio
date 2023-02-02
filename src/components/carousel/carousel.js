import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./carousel.module.css";

export const Carousel = ({ items }) => {
  return (
    <Swiper
      navigation={true}
      draggable={true}
      pagination={true}
      modules={[Navigation, Pagination]}
    >
      {items && items.map((item, i) => <SwiperSlide>{item}</SwiperSlide>)}
    </Swiper>
  );
};
