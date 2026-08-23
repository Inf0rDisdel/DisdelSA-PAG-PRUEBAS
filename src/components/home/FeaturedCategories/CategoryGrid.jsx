import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

import { useMenu } from '../../../hooks/useMenu';
import { useBanners } from 'hooks/useBanners';
import Skeleton from 'components/ui/Skeleton/Skeleton';
import { createSlug } from 'utils/slugify';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';

const CategoryGrid = ({ isLoading: isLoadingProp }) => {
  const { data: menuData, isLoading: isLoadingMenu } = useMenu();
  const { data: bannerData, isLoading: isLoadingBanners } = useBanners();
  
  const loading = isLoadingProp || isLoadingMenu || isLoadingBanners;
  const categoryScrollerRef = useRef(null);

  const defaultImage = useMemo(() => {
    const imgDb = bannerData?.ImagenPredeterminado?.find (b=> b.Titulo === "ImagenDefault");
    return getDisdelImageUrl(imgDb?.Imagen);
  }, [bannerData]);

  const filteredCategories = useMemo(() => {
      if (!menuData) return [];
      const excludedBrands = ['KIMBERLY', '3M', 'WIESE', 'SILVER'];
      return menuData.filter(seg => 
          !excludedBrands.some(brand => seg.NombreSegmento.toUpperCase().includes(brand))
      );
  }, [menuData]);

  const scrollCategories = (direction) => {
    const scroller = categoryScrollerRef.current;
    if (!scroller) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.9,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  };
  
  if (loading) {
    return (
      <section className="cgs-section">
      <h2 className="cgs-title">Categorías Destacadas</h2>
      <div className="cgs-skeleton-grid"> 
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="cgs-item-skeleton">
              <Skeleton width="100%" className="cgs-image-skeleton" style={{ borderRadius: '20px' }} />
              <Skeleton width="60%" height="42px" className="cgs-text-skeleton" />
            </div>
          ))}
      </div>
    </section>
    );
  }

  if (!filteredCategories || filteredCategories.length === 0) return null;

  return (
    <section className="cgs-section">
      <h2 className="cgs-title">Categorías Destacadas</h2>
      <div className="cgs-slider-shell">
        <button type="button" className="cgs-scroll-button cgs-scroll-prev" onClick={() => scrollCategories(-1)} aria-label="Ver categorías anteriores">‹</button>
        <div className="cgs-slider" ref={categoryScrollerRef} role="list" aria-label="Categorías destacadas" tabIndex="0">
            {filteredCategories.map((category) => (
              <div key={category.IdSegmento} className="cgs-native-slide" role="listitem">
                <Link className="cgs-item" to={`/categoria/${createSlug(category.NombreSegmento)}`}>
                  <div className="cgs-image-wrapper">
                    <OptimizedImage
                      src={getDisdelImageUrl(category.Imagen) || defaultImage}
                      alt="" aria-hidden="true"
                      className="cgs-image" 
                      widths={[160, 240, 360]}
                      targetWidth={360}
                      quality={78}
                      sizes="(min-width: 1025px) 260px, (min-width: 481px) 24vw, 31vw"
                      width="240"
                      height="240"
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
                    />
                  </div>
                  <p>{category.NombreSegmento}</p>
                </Link>
              </div>
            ))}
        </div>
        <button type="button" className="cgs-scroll-button cgs-scroll-next" onClick={() => scrollCategories(1)} aria-label="Ver más categorías">›</button>
      </div>
    </section>
  );
};

export default CategoryGrid;
