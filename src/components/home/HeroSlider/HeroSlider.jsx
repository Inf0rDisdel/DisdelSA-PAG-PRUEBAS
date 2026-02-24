import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

// 1. Importamos tu Configuración Global
import { AppConfig } from '../../../config/AppConfig';

// 2. Importamos Hooks y Estilos
import { useBanners } from '../../../hooks/useBanners';
import './HeroSlider.css';

const HeroSlider = () => {
  const { data: banners, isLoading, isError } = useBanners();

  if (isLoading || isError) return null;

  return (
    <div className="main-container">

      {/* --- BANNERS LATERALES (Tipo 26) --- */}
      <div className="banners-container">
        {banners.lateralesPrincipal?.slice(0, 2).map((ban) => (
            <div className="banner-item" key={ban.EntityID}>
                <img 
                    // 🔥 USAMOS AppConfig AQUÍ
                    src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                    alt={ban.Titulo || "Disdelsa, distribucion y comercializacion de productos de limpieza"} 
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

    </div>
  );
};

export default HeroSlider;