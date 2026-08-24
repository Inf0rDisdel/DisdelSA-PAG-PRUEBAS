import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./BannerSlider.css"; 

// 1. Imports necesarios
import { useBanners } from '../../../hooks/useBanners';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';

const BannerSlider = () => {
  const { data: banners, isLoading, isError } = useBanners();
  const containerRef = useRef(null);
  const [slideState, setSlideState] = useState({
    activeIndex: 0,
    previousIndex: null,
    transitionId: 0
  });
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

  const { activeIndex, previousIndex, transitionId } = slideState;

  const showSlide = useCallback((nextIndexOrUpdater) => {
    setSlideState((current) => {
      const requestedIndex = typeof nextIndexOrUpdater === 'function'
        ? nextIndexOrUpdater(current.activeIndex)
        : nextIndexOrUpdater;
      const nextIndex = ((requestedIndex % displayBanners.length) + displayBanners.length) % displayBanners.length;

      if (nextIndex === current.activeIndex) return current;

      return {
        activeIndex: nextIndex,
        previousIndex: current.activeIndex,
        transitionId: current.transitionId + 1
      };
    });
  }, [displayBanners.length]);

  useEffect(() => {
    setSlideState({ activeIndex: 0, previousIndex: null, transitionId: 0 });
  }, [displayBanners]);

  useEffect(() => {
    if (previousIndex === null) return undefined;

    const cleanupTimer = window.setTimeout(() => {
      setSlideState((current) => (
        current.transitionId === transitionId
          ? { ...current, previousIndex: null }
          : current
      ));
    }, 650);

    return () => window.clearTimeout(cleanupTimer);
  }, [previousIndex, transitionId]);

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
        showSlide((current) => current + 1);
      }
    }, 6000);

    return () => window.clearInterval(timer);
  }, [displayBanners.length, isNearViewport, showSlide]);

  if (isLoading) {
    return (
      <div className="banner-slider-container" ref={containerRef}>
        <div className="skeleton-shimmer" style={{ width: '100%', height: isPhone ? '350px' : '270px', borderRadius: '15px' }}></div>
      </div>
    );
  }

  if (isError || displayBanners.length === 0) return null;

  const renderBanner = (banner) => {
    if (!banner) return null;

    const mobileImage = banner.ImagenMovil || banner.BannerImagenMovil;
    const mobileUrl = getDisdelImageUrl(mobileImage);
    const desktopUrl = getDisdelImageUrl(banner.Imagen);
    const finalUrl = isPhone ? (mobileUrl || desktopUrl) : (desktopUrl || mobileUrl);

    if (!finalUrl) return null;

    return (
      <div className="slider-item">
        <picture>
          <OptimizedImage
            src={finalUrl}
            alt={banner.Titulo || "Promoción Disdel"}
            className="banner-img"
            widths={[360, 480, 640, 768, 1024, 1400]}
            targetWidth={1400}
            quality={74}
            sizes="(min-width: 1400px) 1400px, 100vw"
            width={isPhone ? "480" : "1400"}
            height={isPhone ? "302" : "270"}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </picture>
      </div>
    );
  };

  const activeBanner = displayBanners[activeIndex] || displayBanners[0];
  if (!activeBanner) return null;

  return (
    <div className="banner-slider-container" ref={containerRef} aria-roledescription="carrusel" aria-label="Promociones de Disdel">
      <div className="banner-native-stage">
        {previousIndex !== null && previousIndex !== activeIndex && (
          <div
            className="banner-native-layer is-leaving"
            key={displayBanners[previousIndex]?.EntityID || `previous-${previousIndex}`}
            aria-hidden="true"
            inert=""
          >
            {renderBanner(displayBanners[previousIndex])}
          </div>
        )}
        <div
          className={`banner-native-layer${transitionId > 0 ? ' is-entering' : ' is-current'}`}
          key={activeBanner.EntityID || `active-${activeIndex}`}
        >
          {renderBanner(activeBanner)}
        </div>
      </div>

      {displayBanners.length > 1 && (
        <div className="banner-native-dots" aria-label="Seleccionar promoción">
          {displayBanners.map((banner, index) => (
            <button
              type="button"
              key={banner.EntityID || index}
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => showSlide(index)}
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
