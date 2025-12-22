import React from "react";
import Slider from "react-slick";
import "./BannerSlider.css"; 

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import ban1 from 'assets/images/banners/BANNERS-WIESE.jpg';
import ban2 from 'assets/images/banners/banners_LEONCITO-1.jpg';
import ban3 from 'assets/images/banners/banners_sanisol.jpg';
import ban4 from 'assets/images/banners/banners_silver-2.jpg';


const BannerSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows:false
  };

  return (
    <div className="banner-slider-container">
      <Slider {...settings}>
        <div>
          <img src={ban1} alt="Banner 1" />
        </div>
        <div>
          <img src={ban2} alt="Banner 2" />
        </div>
        <div>
          <img src={ban3} alt="Banner 3" />
        </div>
        <div>
          <img src={ban4} alt="Banner 4" />
        </div>
      </Slider>
    </div>
  );
};

export default BannerSlider;