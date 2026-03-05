import React, { useEffect, useMemo, useState } from "react";
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

  const [isPhone, setIsPhone] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   const displayBanners = useMemo(() => {
    if (!banners?.Ubicaciones) return [];

    return banners.Ubicaciones.filter(ban =>
      ban.Titulo === "BannerKCP" ||
      ban.Titulo === "3m" ||
      ban.Titulo === "BannerWiese"
    );
  }, [banners]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false
  };

  if (isLoading || isError || displayBanners.length === 0) {
    return null; 
  }

  return (
    <div className="banner-slider-container">
      <Slider {...settings}>
        {displayBanners.map((ban) => (
            <div key={ban.EntityID || ban.IdBanner}>
                <img 
                    // Si es móvil, intentamos usar ImagenMovil, si no existe usamos Imagen
                    src={`${AppConfig.baseImageUrl}${isPhone && ban.ImagenMovil ? ban.ImagenMovil : ban.Imagen}`} 
                    alt={ban.Titulo || "Promoción Disdelsa"} 
                    className="banner-img"
                    // Cargamos con prioridad los banners del slider principal
                    fetchpriority="high"
                />
            </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;