import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

// 1. Importamos tu Configuración Global
import { AppConfig } from '../../../config/AppConfig';
// 2. Importamos Hooks y Estilos
import { useBanners } from '../../../hooks/useBanners';
import './HeroSlider.css';

import bannerMovil1 from 'assets/images/banners/Adaptacion--banner-disdel-movil.png';
import bannerMovil2 from 'assets/images/banners/Adaptacion--banner-Disdel.png';
import bannerMovil3 from 'assets/images/banners/BANNER-PROMOCIONAL-NESCAFE-PROPUEST2.jpg';


const HeroSlider = () => {
  const { data: banners, isLoading, isError } = useBanners();
  const[isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading || isError) return null;

  const bannersLocales = [bannerMovil1, bannerMovil2, bannerMovil3];

  return (
    <div className="main-container">

      {isMobile ? (
        <>
          {/* NUEVO CARRUSEL EXCLUSIVO MÓVIL */}
          <div className="mobile-hero-carousel">
            <Carousel
              showArrows={false}
              showThumbs={false}
              showStatus={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={3000}
            >
              {bannersLocales.map((img, index) => (
                <div key={index}>
                  <img src={img} alt={`Banner promocional ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          </div>

      {/* --- BANNERS LATERALES EN MÓVIL --- */}
          <div className="banners-container">
            {/* 🔥 CAMBIO AQUÍ: .slice(0, 1) para que SOLO salga el de Glade/Wiese */}
            {banners.lateralesPrincipal?.slice(0, 1).map((ban) => (
              <div className="banner-item" key={ban.EntityID}>
                <img 
                  src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                  alt={ban.Titulo} 
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
        {/* --- VISTA ESCRITORIO --- */}
          <div className="banners-container">
            {/* Aquí mantenemos 2 para que en PC se vean ambos */}
            {banners.lateralesPrincipal?.slice(0, 2).map((ban) => (
              <div className="banner-item" key={ban.EntityID}>
                <img 
                  src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                  alt={ban.Titulo} 
                />
              </div>
            ))}
          </div>
            {/* --- SLIDER PRINCIPAL (Tipo 3) --- */}
            <div className="slider-container">
              <div className="carousel-wrapper">
                
                {banners.sliderPrincipal?.length > 0 && (
                  <Carousel
                      showArrows={false}
                      showThumbs={false}
                      showStatus={false}
                      infiniteLoop={true}
                      autoPlay={true}
                      interval={4000}
                      stopOnHover={true}
                  >
                      {banners.sliderPrincipal.map((slide) => (
                          <div key={slide.EntityID}>
                              <img 
                                  // 🔥 USAMOS AppConfig AQUÍ TAMBIÉN
                                  src={`${AppConfig.baseImageUrl}${slide.BannerImagenMovil}`} 
                                  alt={slide.Titulo || "Promoción Principal"} 
                              />
                          </div>
                      ))}
                  </Carousel>
                )}

              </div>
            </div>
          </>
      )}

    </div>
  );
};

export default HeroSlider;