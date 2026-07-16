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

  // 🚀 FALLBACK SEGURO: Evita el error "disdelsa.com/imagenes/undefined" de Google
  const defaultImageFallback = `${AppConfig.baseImageUrl}logo-disdel.png`;

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
    const validImg = ban?.Imagen && ban.Imagen.trim() !== "" ? ban.Imagen.trim() : null;
    const imgUrl = validImg ? `${AppConfig.baseImageUrl}${validImg}` : defaultImageFallback;

    const bannerContent = (
      <>
        <img 
          src={imgUrl} 
          alt={ban.Titulo || "Promoción Disdel"} 
          width="660" height="155"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {route && (
          // Cambiado de Link a span para evitar anidación de enlaces inválida en HTML
          <span className="banner-view-btn">
            Ver productos
          </span>
        )}
      </>
    );

    // Si tiene ruta configurada, todo el bloque se convierte en un Link clickeable
    if (route) {
      return (
        <Link to={route} className="banner-item" key={ban.EntityID} style={{ display: 'block', textDecoration: 'none' }}>
          {bannerContent}
        </Link>
      );
    }

    // Si no tiene ruta, se muestra como un div estático normal
    return (
      <div className="banner-item" key={ban.EntityID}>
        {bannerContent}
      </div>
    );
  };

  return (
    <section className="main-container" aria-label="Promociones principales">
      {isMobile ? (
        <>
          <div className="mobile-hero-carousel">
            <Carousel showArrows={false} showThumbs={false} showStatus={false}
              infiniteLoop={true} autoPlay={true} interval={4000} stopOnHover={false}>
              {banners.sliderPrincipal.map((slide, index) => {
                const route = getBannerRoute(slide);

                //SANEAMIENTO: Validación de imagen para moviles
                const slideImg = slide?.BannerImagenMovil || slide?.Imagen;
                const validImg = slideImg && slideImg.trim() !== "" ? slideImg.trim() : null;
                const imgUrl = validImg ? `${AppConfig.baseImageUrl}${validImg}` : defaultImageFallback;

                const slideContent = (
                  <>
                    <img 
                      src={imgUrl} 
                      alt={slide.Titulo || "Suministros de limpieza Disdel"} 
                      fetchpriority={index === 0 ? "high" : "auto"}
                    />
                    {route && (
                      <span className="banner-view-btn-mini">Ver</span>
                    )}
                  </>
                );

                if (route) {
                  return (
                    <Link key={slide.EntityID} to={route} className="mobile-slide-wrapper" style={{ display: 'block', textDecoration: 'none' }}>
                      {slideContent}
                    </Link>
                  );
                }

                return (
                  <div key={slide.EntityID} className="mobile-slide-wrapper">
                    {slideContent}
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
                <Carousel
                  showArrows={false} showThumbs={false} showStatus={false}
                  infiniteLoop={true} autoPlay={true} interval={4000} stopOnHover={true}
                >
                  {banners.sliderPrincipal.map((slide, index) => {
                    const route = getBannerRoute(slide);

                    //SANEAMIENTO: Validación de imagen para escritorio
                    const slideImg = slide?.Imagen || slide?.BannerImagenMovil;
                    const validImg = slideImg && slideImg.trim() !== "" ? slideImg.trim() : null;
                    const imgUrl = validImg ? `${AppConfig.baseImageUrl}${validImg}` : defaultImageFallback;

                    const slideContent = (
                      <>
                        <img 
                          src={imgUrl} 
                          alt={slide.Titulo || "Catálogo Disdel"} 
                          width="540" height="320" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          fetchpriority={index === 0 ? "high" : "low"}
                          loading={index === 0 ? "eager" : "lazy"}
                          decoding={index === 0 ? "sync" : "async"}
                        />
                        {route && (
                          <span className="banner-view-btn">Ver productos</span>
                        )}
                      </>
                    );

                    // 🚀 Slider de escritorio 100% clickeable
                    if (route) {
                      return (
                        <Link key={slide.EntityID} to={route} className="desktop-slide-wrapper" style={{ display: 'block', textDecoration: 'none' }}>
                          {slideContent}
                        </Link>
                      );
                    }

                    return (
                      <div key={slide.EntityID} className="desktop-slide-wrapper">
                        {slideContent}
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