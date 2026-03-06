import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';
import './HeroSlider.css';

const HeroSlider = () => {
  const { data: banners, isLoading, isError } = useBanners();
  const[isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading || isError || !banners) return null;

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
              {banners.sliderPrincipal.map((slide) => (
                <div key={slide.EntityID}>
                  <img 
                    src={`${AppConfig.baseImageUrl}${slide.BannerImagenMovil || slide.Imagen}`} 
                    alt={slide.Titulo || "Banner promocional"} 
                  />
                </div>
              ))}
            </Carousel>
          </div>

      {/* --- BANNERS LATERALES EN MÓVIL --- */}
          <div className="banners-container">
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