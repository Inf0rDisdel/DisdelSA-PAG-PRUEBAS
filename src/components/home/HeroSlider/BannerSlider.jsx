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
  const [isPhone, setIsPhone] = useState(typeof window !== 'undefined' ? window.innerWidth <= 480 : false);

  useEffect(() => {
    const handleResize = () => setIsPhone(typeof window !== 'undefined' ? window.innerWidth <= 480 : false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayBanners = useMemo(() => {
  const listado = banners?.BannersMarcasInternos || [];

    const desktopTitles = [
      "leoncito",
      "banner silver",
      "bannerguantes",
      "sanizol"
    ];

    const mobileTitles = [
      "banner kcp",
      "banner silver",
      "bannerguantes",
      "3m"
    ];

    const validTitles = isPhone ? mobileTitles : desktopTitles;

    return listado.filter(ban => {
      const tituloNormalizado = ban.Titulo?.toLowerCase().trim() || "";
      return validTitles.includes(tituloNormalizado);
    });
  }, [banners, isPhone]);

  useEffect(() => {
    if (displayBanners && displayBanners.length > 0) {
      const primerBanner = displayBanners[0];
      const imgMovil = primerBanner.ImagenMovil || primerBanner.BannerImagenMovil;
      const imgDesktop = primerBanner.Imagen;
      const rutaImagen = (isPhone && imgMovil) ? imgMovil : imgDesktop;

      if (rutaImagen) {
        const urlFinal = `${AppConfig.baseImageUrl}${rutaImagen}`;

        // Verificamos si ya existe el preload para no duplicarlo en el head
        const existePreload = document.querySelector(`link[rel="preload"][href="${urlFinal}"]`);
        if (!existePreload) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = urlFinal;
          document.head.appendChild(link);

          // Limpieza al desmontar el componente o cambiar de banner
          return () => {
            if (document.head.contains(link)) {
              document.head.removeChild(link);
            }
          };
        }
      }
    }
  }, [displayBanners, isPhone]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true, 
    pauseOnHover: false,
    lazyLoad: 'ondemand'
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
                  width="1400" 
                  height="270"
                  // SEO y Performance: El primero carga de una, los demás después
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding={index === 0 ? "sync" : "async"}
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