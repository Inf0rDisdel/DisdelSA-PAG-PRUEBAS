import React, { useEffect, useMemo, useRef, useState } from "react";
import "./BannerSlider.css"; 

// 1. Imports necesarios
import { useBanners } from '../../../hooks/useBanners';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';

const BannerSlider = () => {
  const { data: banners, isLoading, isError } = useBanners();
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 480px)').matches
  );

  useEffect(() => {
    const phoneQuery = window.matchMedia('(max-width: 480px)');
    const handleBreakpointChange = (event) => setIsPhone(event.matches);

    setIsPhone(phoneQuery.matches);
    phoneQuery.addEventListener('change', handleBreakpointChange);
    return () => phoneQuery.removeEventListener('change', handleBreakpointChange);
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
    setActiveIndex(0);
  }, [displayBanners]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !('IntersectionObserver' in window)) {
      setIsNearViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsNearViewport(entry.isIntersecting);
    }, { rootMargin: '200px 0px' });

    observer.observe(container);
    return () => observer.disconnect();
  }, [isLoading]);

  useEffect(() => {
    if (!isNearViewport || displayBanners.length < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActiveIndex((current) => (current + 1) % displayBanners.length);
      }
    }, 6000);

    return () => window.clearInterval(timer);
  }, [displayBanners.length, isNearViewport]);

  if (isLoading) {
    return (
      <div className="banner-slider-container" ref={containerRef}>
        <div className="skeleton-shimmer" style={{ width: '100%', height: isPhone ? '350px' : '270px', borderRadius: '15px' }}></div>
      </div>
    );
  }

  if (isError || displayBanners.length === 0) return null;

  const activeBanner = displayBanners[activeIndex] || displayBanners[0];
  const mobileImage = activeBanner?.ImagenMovil || activeBanner?.BannerImagenMovil;
  const mobileUrl = getDisdelImageUrl(mobileImage);
  const desktopUrl = getDisdelImageUrl(activeBanner?.Imagen);
  const finalUrl = isPhone ? (mobileUrl || desktopUrl) : (desktopUrl || mobileUrl);

  if (!finalUrl) return null;

  return (
    <div className="banner-slider-container" ref={containerRef} aria-roledescription="carrusel" aria-label="Promociones de Disdel">
      <div className="banner-native-stage" key={activeBanner.EntityID || activeIndex}>
        <div className="slider-item">
          <picture>
            {mobileUrl && <source media="(max-width: 480px)" srcSet={mobileUrl} />}
            <OptimizedImage
              src={finalUrl}
              alt={activeBanner.Titulo || "Promoción Disdel"}
              className="banner-img"
              widths={[480, 768, 1024, 1400]}
              targetWidth={1400}
              quality={74}
              sizes="(min-width: 1400px) 1400px, 100vw"
              width="1400"
              height="270"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </picture>
        </div>
      </div>

      {displayBanners.length > 1 && (
        <div className="banner-native-dots" aria-label="Seleccionar promoción">
          {displayBanners.map((banner, index) => (
            <button
              type="button"
              key={banner.EntityID || index}
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver promoción ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
