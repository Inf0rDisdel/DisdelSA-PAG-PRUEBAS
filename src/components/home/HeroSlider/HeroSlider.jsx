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

  if (isLoading || isError) {
    return (
      <section className="main-container skeleton-hero" aria-hidden="true">
        <div className="banners-container-skeleton"></div>
        <div className="slider-container-skeleton"></div>
      </section>
    );
  }

  if (!banners) return null;

   return (
    <section className="main-container" aria-label="Promociones principales">
      {isMobile ? (
        <>
          <div className="mobile-hero-carousel">
            <Carousel
              showArrows={false}
              showThumbs={false}
              showStatus={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={3500}
              stopOnHover={false}
            >
              {banners.sliderPrincipal.map((slide, index) => (
                <div key={slide.EntityID}>
                  <img 
                    src={`${AppConfig.baseImageUrl}${slide.BannerImagenMovil || slide.Imagen}`} 
                    alt={slide.Titulo || "Suministros de limpieza Disdel"} 
                    // 🔥 SEO FIX 2 (LCP): Prioridad alta solo a la primera imagen
                    fetchpriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding={index === 0 ? "sync" : "async"}
                  />
                </div>
              ))}
            </Carousel>
          </div>


          <div className="banners-container">
            {banners.lateralesPrincipal?.slice(0, 1).map((ban) => (
              <div className="banner-item" key={ban.EntityID}>
                <img 
                  src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                  alt={ban.Titulo || "Distribuidor autorizado"} 
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="banners-container">
            {banners.lateralesPrincipal?.slice(0, 2).map((ban) => (
              <div className="banner-item" key={ban.EntityID}>
                <img 
                  src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                  alt={ban.Titulo || "Productos para empresas Guatemala"} 
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>

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
                  {banners.sliderPrincipal.map((slide, index) => (
                    <div key={slide.EntityID}>
                      <img 
                        src={`${AppConfig.baseImageUrl}${slide.BannerImagenMovil}`} 
                        alt={slide.Titulo || "Catálogo Disdel"} 
                        // 🔥 Optimización LCP Escritorio
                        fetchpriority={index === 0 ? "high" : "low"}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding={index === 0 ? "sync" : "async"}
                      />
                    </div>
                  ))}
                </Carousel>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;