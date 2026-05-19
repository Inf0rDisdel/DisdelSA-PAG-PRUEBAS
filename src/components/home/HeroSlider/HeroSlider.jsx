import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';
import './HeroSlider.css';

const HeroSlider = () => {
  const { data: banners, isLoading, isError } = useBanners();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBannerRoute = (ban) => {
    if (!ban) return null;
    const id = String(ban.EntityID);
    const titulo = (ban.Titulo || "").toLowerCase();
    const imagen = (ban.Imagen || "").toLowerCase();

    // 🚀 SENIOR TIP: Usamos IDs fijos porque los nombres en DB pueden cambiar
    // Wiese (Lateral Superior)
    if (id === "3238" || titulo.includes('wiese') || imagen.includes('wiese')) {
      return '/marca/wiese/aromatizantes-ambientales';
    }

    // Nescafe (Lateral Inferior)
    if (id === "3239" || titulo.includes('nescafe') || titulo.includes('coffee')) {
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
    const route = getBannerRoute(ban);
    return (
      <div className="banner-item" key={ban.EntityID}>
        <img 
          src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
          alt={ban.Titulo || "Promoción Disdel"} 
        />
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
        <>
          <div className="mobile-hero-carousel">
            <Carousel showArrows={false} showThumbs={false} showStatus={false} infiniteLoop autoPlay interval={3500}>
              {banners.sliderPrincipal.map((slide, index) => {
                const route = getBannerRoute(slide);
                return (
                  <div key={slide.EntityID} className="mobile-slide-wrapper">
                    <img 
                      src={`${AppConfig.baseImageUrl}${slide.BannerImagenMovil || slide.Imagen}`} 
                      alt={slide.Titulo} 
                      fetchpriority={index === 0 ? "high" : "auto"}
                    />
                    {route && (
                      <Link to={route} className="banner-view-btn-mini">Ver</Link>
                    )}
                  </div>
                );
              })}
            </Carousel>
          </div>
          <div className="banners-container">
            {banners.lateralesPrincipal?.slice(0, 1).map(renderBannerItem)}
          </div>
        </>
      ) : (
        <>
          <div className="banners-container">
            {/* Aquí se renderizan Wiese y Nescafe en escritorio */}
            {banners.lateralesPrincipal?.slice(0, 2).map(renderBannerItem)}
          </div>

          <div className="slider-container">
            <div className="carousel-wrapper">
              {banners.sliderPrincipal?.length > 0 && (
                <Carousel showArrows={false} showThumbs={false} showStatus={false} infiniteLoop autoPlay interval={4000}>
                  {banners.sliderPrincipal.map((slide) => {
                    const route = getBannerRoute(slide);
                    return (
                      <div key={slide.EntityID} className="desktop-slide-wrapper">
                        <img 
                          src={`${AppConfig.baseImageUrl}${slide.Imagen || slide.BannerImagenMovil}`} 
                          alt={slide.Titulo} 
                        />
                        {route && (
                          <Link to={route} className="banner-view-btn">Ver productos</Link>
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