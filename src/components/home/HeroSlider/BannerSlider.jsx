import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./BannerSlider.css"; 

// 1. Imports necesarios
import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';

const BannerSlider = () => {
  const { data: banners, isLoading, isError } = useBanners();
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayBanners = useMemo(() => {
  const listado = banners?.BannersMarcasInternos || [];

    const validTitles = [
      "banner kcp", 
      "banner silver", 
      "bannerguantes", 
      "3m"
    ];

    return listado.filter(ban => {
      const tituloNormalizado = ban.Titulo?.toLowerCase().trim() || "";
      return validTitles.includes(tituloNormalizado);
    });
  }, [banners]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    fade: true, 
    pauseOnHover: false
  };

  if (isLoading) {
    return (
      <div className="banner-slider-container">
        <div className="skeleton-shimmer" style={{ width: '100%', height: isPhone ? '350px' : '270px', borderRadius: '15px' }}></div>
      </div>
    );
  }

  if (isError || displayBanners.length === 0) return null;

  return (
    <div className="banner-slider-container">
      <Slider {...settings}>
        {displayBanners.map((ban, index) => {
          // 3. Selección inteligente de imagen (Escritorio vs Móvil)
          const imgMovil = ban.ImagenMovil || ban.BannerImagenMovil;
          const imgDesktop = ban.Imagen;

          const rutaFinal = (isPhone && imgMovil) ? imgMovil : imgDesktop;

           return (
            <div key={ban.IdBanner || index} className="slider-item">
              <picture>
                {/* Esto ayuda al navegador a elegir la imagen antes de renderizar */}
                {imgMovil && <source media="(max-width: 480px)" srcSet={`${AppConfig.baseImageUrl}${imgMovil}`} />}
                <img 
                  src={`${AppConfig.baseImageUrl}${rutaFinal}`} 
                  alt={ban.Titulo || "Promoción Disdel"} 
                  className="banner-img"
                  // SEO y Performance: El primero carga de una, los demás después
                  fetchpriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </picture>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default BannerSlider;