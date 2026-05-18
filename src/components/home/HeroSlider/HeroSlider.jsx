import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
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

  const getBannerRoute = (ban) => {
  if (!ban) return null;

  const image = (ban.Imagen || "").toLowerCase();

  if (image.includes('wiese')) {
    return '/marca/wiese/aromatizantes-ambientales';
  }

  if (
    image.includes('nescafe') ||
    image.includes('coffee')
  ) {
    return '/categoria/cafeteria/cafe-y-complementos';
  }

  return null;
};

  if (isLoading || isError) {
    return (
      <section className="main-container skeleton-hero" aria-hidden="true">
        <div className="banners-container-skeleton"></div>
        <div className="slider-container-skeleton"></div>
      </section>
    );
  }

  if (!banners) return null;

  const renderBannerItem = (ban) => {


    console.log("BANNER:", ban);

    const route = getBannerRoute(ban); 

    return (
      <div className="banner-item" key={ban.EntityID}>
        <img 
          src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
          alt={ban.Titulo || "Promoción Disdel"} 
        />
        {/* 🚀 CORRECCIÓN 1: Usamos la variable 'route' en el 'to' */}
        {route && (
          <Link to={route} className="banner-view-btn">
            Ver productos
          </Link>
        )}
      </div>
    );
  };

  return (
    <section className="main-container" aria-label="Promociones principales">
      {isMobile ? (
        /* --- 📱 VISTA MÓVIL --- */
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
              {banners.sliderPrincipal.map((slide, index) => {
                const route = getBannerRoute(slide); // 🚀 Buscamos si el slide tiene link
                return (
                  <div key={slide.EntityID} className="mobile-slide-wrapper">
                    <img 
                      src={`${AppConfig.baseImageUrl}${slide.BannerImagenMovil || slide.Imagen}`} 
                      alt={slide.Titulo || "Suministros de limpieza Disdel"} 
                      fetchpriority={index === 0 ? "high" : "auto"}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    {/* Botón flotante sobre el slider móvil si coincide con Wiese/Nescafe */}
                    {route && (
                      <Link to={route} className="banner-view-btn-mini">
                        Ver
                      </Link>
                    )}
                  </div>
                );
              })}
            </Carousel>
          </div>

          <div className="banners-container">
            {/* Renderiza el primer banner lateral con botón si aplica */}
            {banners.lateralesPrincipal?.slice(0, 1).map(renderBannerItem)}
          </div>
        </>
      ) : (
        /* --- 💻 VISTA ESCRITORIO --- */
        <>
          <div className="banners-container">
            {/* Renderiza los dos banners laterales con botones si aplica */}
            {banners.lateralesPrincipal?.slice(0, 2).map(renderBannerItem)}
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
                  {banners.sliderPrincipal.map((slide, index) => {
                    const route = getBannerRoute(slide);
                    return (
                      <div key={slide.EntityID} style={{ position: 'relative', height: '100%' }}>
                        <img 
                          src={`${AppConfig.baseImageUrl}${slide.BannerImagenMovil}`} 
                          alt={slide.Titulo || "Catálogo Disdel"} 
                          fetchpriority={index === 0 ? "high" : "low"}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                        {/* Botón flotante para el slider de escritorio */}
                        {route && (
                          <Link to={route} className="banner-view-btn">
                            Ver productos
                          </Link>
                        )}
                      </div>
                    );
                  })}
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