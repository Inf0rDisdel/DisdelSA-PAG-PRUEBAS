import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useBanners } from '../../../hooks/useBanners';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';
import './HeroSlider.css';

const NativeHeroCarousel = ({ slides, renderSlide, pauseOnHover = false }) => {
  const [slideState, setSlideState] = useState({
    activeIndex: 0,
    previousIndex: null,
    transitionId: 0
  });
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = slides.length;
  const { activeIndex, previousIndex, transitionId } = slideState;

  const showSlide = useCallback((nextIndexOrUpdater) => {
    setSlideState((current) => {
      const requestedIndex = typeof nextIndexOrUpdater === 'function'
        ? nextIndexOrUpdater(current.activeIndex)
        : nextIndexOrUpdater;
      const nextIndex = ((requestedIndex % slideCount) + slideCount) % slideCount;

      if (nextIndex === current.activeIndex) return current;

      return {
        activeIndex: nextIndex,
        previousIndex: current.activeIndex,
        transitionId: current.transitionId + 1
      };
    });
  }, [slideCount]);

  useEffect(() => {
    setSlideState({ activeIndex: 0, previousIndex: null, transitionId: 0 });
  }, [slides]);

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
    if (slideCount < 2 || isPaused) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const timer = window.setInterval(() => {
      showSlide((currentIndex) => currentIndex + 1);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isPaused, showSlide, slideCount]);

  if (!slideCount) return null;

  const safeIndex = activeIndex < slideCount ? activeIndex : 0;

  return (
    <div
      className="hero-native-carousel"
      aria-roledescription="carrusel"
      aria-label="Promociones de Disdel"
      onMouseEnter={pauseOnHover ? () => setIsPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setIsPaused(false) : undefined}
    >
      <div className="hero-native-stage">
        {previousIndex !== null && previousIndex !== safeIndex && (
          <div
            className="hero-native-layer is-leaving"
            key={slides[previousIndex]?.EntityID || `previous-${previousIndex}`}
            aria-hidden="true"
            inert=""
          >
            {renderSlide(slides[previousIndex], previousIndex)}
          </div>
        )}
        <div
          className={`hero-native-layer${transitionId > 0 ? ' is-entering' : ' is-current'}`}
          key={slides[safeIndex]?.EntityID || `active-${safeIndex}`}
        >
          {renderSlide(slides[safeIndex], safeIndex)}
        </div>
      </div>

      {slideCount > 1 && (
        <div className="hero-native-dots" role="group" aria-label="Elegir promoción">
          {slides.map((slide, index) => {
            const isSelected = index === safeIndex;

            return (
              <button
                type="button"
                className={`hero-native-dot-button${isSelected ? ' is-selected' : ''}`}
                key={slide.EntityID || index}
                onClick={() => showSlide(index)}
                aria-label={`Ir a la promoción ${index + 1}`}
                aria-current={isSelected ? 'true' : undefined}
              >
                <span className="hero-native-dot" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const HeroSlider = () => {
  const { data: banners, isLoading, isError } = useBanners();
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 480px)').matches
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 480px)');
    const handleBreakpointChange = (event) => setIsMobile(event.matches);

    setIsMobile(mobileQuery.matches);
    mobileQuery.addEventListener('change', handleBreakpointChange);
    return () => mobileQuery.removeEventListener('change', handleBreakpointChange);
  }, []);

  // 🚀 FALLBACK SEGURO: Evita el error "disdelsa.com/imagenes/undefined" de Google
  const defaultImageFallback = useMemo(
    () => getDisdelImageUrl('logo-disdel.png'),
    []
  );

  const getBannerRoute = useCallback((ban) => {
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
  }, []);

  if (isLoading || isError) {
    if (isMobile) {
      return (
        <section className="main-container mobile-hero-skeleton" aria-hidden="true">
          <div className="mobile-carousel-skeleton"></div>
          <div className="mobile-side-banner-skeleton"></div>
        </section>
      );
    }

    return (
      <section className="main-container skeleton-hero" aria-hidden="true">
        <div className="banners-container-skeleton"></div>
        <div className="slider-container-skeleton"></div>
      </section>
    );
  }

  if (!banners) return null;

  const renderBannerItem = (ban, index) => {
    const route = getBannerRoute(ban);
    const validImg = ban?.Imagen && ban.Imagen.trim() !== "" ? ban.Imagen.trim() : null;
    const imgUrl = getDisdelImageUrl(validImg) || defaultImageFallback;

    const bannerContent = (
      <>
        <OptimizedImage
          src={imgUrl} 
          alt={ban.Titulo || "Promoción Disdel"} 
          className="hero-cover-image hero-side-image"
          widths={[360, 640, 800, 960, 1280]}
          targetWidth={960}
          quality={76}
          sizes="(min-width: 1400px) 760px, (min-width: 1025px) 55vw, (max-width: 480px) calc(100vw - 20px), 100vw"
          width="660" height="184"
          loading={!isMobile && index === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={!isMobile && index === 0 ? "auto" : "low"}
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

  const principalSlides = banners.sliderPrincipal || [];

  const renderPrincipalSlide = (slide, index) => {
    const route = getBannerRoute(slide);
    const slideImg = slide?.Imagen || slide?.BannerImagenMovil;
    const validImg = slideImg && slideImg.trim() !== "" ? slideImg.trim() : null;
    const imgUrl = getDisdelImageUrl(validImg) || defaultImageFallback;
    const mobileSlide = isMobile;

    const slideContent = (
      <>
        <OptimizedImage
          src={imgUrl}
          alt={slide.Titulo || (mobileSlide ? "Suministros de limpieza Disdel" : "Catálogo Disdel")}
          className="hero-cover-image hero-main-image"
          widths={mobileSlide ? [360, 480, 640, 800, 960] : [480, 640, 800, 960]}
          targetWidth={mobileSlide ? 640 : 800}
          quality={76}
          sizes={mobileSlide ? "calc(100vw - 20px)" : "(min-width: 1400px) 620px, 45vw"}
          width={mobileSlide ? "392" : "540"}
          height={mobileSlide ? "246" : "340"}
          fetchPriority={index === 0 ? "high" : "low"}
          loading={index === 0 ? "eager" : "lazy"}
          decoding={index === 0 ? "sync" : "async"}
        />
        {route && (
          <span className={mobileSlide ? "banner-view-btn-mini" : "banner-view-btn"}>
            {mobileSlide ? "Ver" : "Ver productos"}
          </span>
        )}
      </>
    );
    const wrapperClass = mobileSlide ? "mobile-slide-wrapper" : "desktop-slide-wrapper";

    if (route) {
      return (
        <Link
          key={slide.EntityID}
          to={route}
          className={wrapperClass}
          style={{ display: 'block', textDecoration: 'none' }}
        >
          {slideContent}
        </Link>
      );
    }

    return (
      <div key={slide.EntityID} className={wrapperClass}>
        {slideContent}
      </div>
    );
  };

  return (
    <section className="main-container" aria-label="Promociones principales">
      {isMobile ? (
        <>
          <div className="mobile-hero-carousel">
            <NativeHeroCarousel
              slides={principalSlides}
              renderSlide={renderPrincipalSlide}
            />
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
            <div className="hero-carousel-wrapper">
              <NativeHeroCarousel
                slides={principalSlides}
                renderSlide={renderPrincipalSlide}
                pauseOnHover
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;
