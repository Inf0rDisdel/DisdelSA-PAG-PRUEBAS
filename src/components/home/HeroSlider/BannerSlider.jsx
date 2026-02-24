import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./BannerSlider.css"; 

// 1. Imports necesarios
import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';

const BannerSlider = () => {
  // 2. Traemos los datos
  const { data: banners, isLoading, isError } = useBanners();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  };

  // Si carga, falla o no hay banners tipo 4, no mostramos nada
  if (isLoading || isError || !banners.sliderMarcas?.length) return null;

  return (
    <div className="banner-slider-container">
      <Slider {...settings}>
        
        {/* 3. GENERAMOS LOS SLIDES DINÁMICAMENTE */}
        {banners.sliderMarcas.map((ban) => (
            <div key={ban.EntityID}>
                <img 
                    src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                    alt={ban.Titulo || "Promoción Disdelsa"} 
                    style={{ width: '100%', height: 'auto', display: 'block' }} // Estilos básicos para evitar saltos
                />
            </div>
        ))}

      </Slider>
    </div>
  );
};

export default BannerSlider;