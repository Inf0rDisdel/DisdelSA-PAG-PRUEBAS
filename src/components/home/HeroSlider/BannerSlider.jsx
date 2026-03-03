import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./BannerSlider.css"; 

// 1. Imports necesarios
import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';

import bannerMovil1 from 'assets/images/BannersMarcasMovil/Adaptacion-banner-KC.webp';
import bannerMovil2 from 'assets/images/BannersMarcasMovil/Adaptacion--banner-3M.webp';
import bannerMovil3 from 'assets/images/BannersMarcasMovil/Adaptacion--banner-wiese-copia.webp';

const BannerSlider = () => {
  // 2. Traemos los datos
  const { data: banners, isLoading, isError } = useBanners();

  const [isPhone, setIsPhone] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const bannersLocales = [
    { EntityID: 'm-local-1', ImagenLocal: bannerMovil1, Titulo: 'Promo 1' },
    { EntityID: 'm-local-2', ImagenLocal: bannerMovil2, Titulo: 'Promo 2' },
    { EntityID: 'm-local-3', ImagenLocal: bannerMovil3, Titulo: 'Promo 3' },
  ];

// Si es phone, usa SOLO los locales. Si no, usa SOLO los de la API.
  const displayBanners = isPhone ? bannersLocales : (banners?.sliderMarcas || []);

  // Modificamos el condicional: Si es móvil y tenemos banners locales, mostramos.
  // Si es escritorio, esperamos a que cargue la API.
  if (!isPhone && (isLoading || isError || !banners?.sliderMarcas?.length)) return null;
  if (isPhone && displayBanners.length === 0) return null;

  return (
    <div className="banner-slider-container">
      <Slider {...settings}>
        {displayBanners.map((ban) => (
            <div key={ban.EntityID}>
                <img 
                    // 🔥 Si tiene ImagenLocal la usa directamente, si no usa la URL de la API
                    src={ban.ImagenLocal ? ban.ImagenLocal : `${AppConfig.baseImageUrl}${ban.Imagen}`} 
                    alt={ban.Titulo || "Promoción Disdelsa"} 
                    className="banner-img"
                />
            </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;