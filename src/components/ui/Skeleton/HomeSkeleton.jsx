import React from 'react';
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';
import './HomeSkeleton.css';

export const HomeSkeleton = () => {
  const productCount = 5;
  const brandCount = 4;

  return (
    <div className="home-skeleton-wrapper" aria-hidden="true">
      
      {/* 1. HERO SLIDER (Banners Superiores) */}
      <div className="skeleton-container">
        <div className="skeleton-hero-grid">
          <div className="skeleton-banner-column">
            <div className="skeleton-box hero-banner-item"></div>
            <div className="skeleton-box hero-banner-item"></div>
          </div>
          <div className="skeleton-box hero-slider-main"></div>
        </div>
      </div>

      {/* 2. CATEGORÍAS DESTACADAS (5 Tarjetas) */}
      <div className="skeleton-container skeleton-categories-section">
        <div className="skeleton-title-pill"></div>
        <div className="skeleton-categories-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={`cat-sk-${i}`} className="skeleton-category-card">
              <div className="skeleton-box cat-img-sk"></div>
              <div className="skeleton-box cat-text-sk"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ALIADOS COMERCIALES (4 Marcas) */}
      <div className="skeleton-container skeleton-brands-section">
        <div className="skeleton-title-pill"></div>
        <div className="skeleton-brands-grid">
          {Array.from({ length: brandCount }).map((_, i) => (
            <div key={`brand-sk-${i}`} className="skeleton-box brand-card-sk"></div>
          ))}
        </div>
      </div>

      {/* 4. BANNER SANISOL (Ancho completo) */}
      <div className="skeleton-container">
        <div className="skeleton-box middle-banner-sk"></div>
      </div>

      {/* 5. CARRUSEL 1: LOS MÁS COTIZADOS */}
      <div className="skeleton-container">
        <div className="skeleton-title-pill"></div>
        <div className="skeleton-products-grid">
          {Array.from({ length: productCount }).map((_, i) => (
            <ProductCardSkeleton key={`p1-sk-${i}`} />
          ))}
        </div>
      </div>

      {/* 6. CARRUSEL 2: SOLUCIONES INTEGRALES DE HIGIENE (+ Botón Ver Todo) */}
      <div className="skeleton-container">
        <div className="skeleton-header-row">
          <div className="skeleton-title-pill"></div>
          <div className="skeleton-button-pill"></div>
        </div>
        <div className="skeleton-products-grid">
          {Array.from({ length: productCount }).map((_, i) => (
            <ProductCardSkeleton key={`p2-sk-${i}`} />
          ))}
        </div>
      </div>

      {/* 7. PROMO NESCAFÉ (2 Banners lado a lado) */}
      <div className="skeleton-container">
        <div className="skeleton-promo-grid">
          <div className="skeleton-box promo-item-sk"></div>
          <div className="skeleton-box promo-item-sk"></div>
        </div>
      </div>

      {/* 8. CARRUSEL 3: TODO PARA EL COFFEE BREAK (+ Botón Ver Todo) */}
      <div className="skeleton-container">
        <div className="skeleton-header-row">
          <div className="skeleton-title-pill"></div>
          <div className="skeleton-button-pill"></div>
        </div>
        <div className="skeleton-products-grid">
          {Array.from({ length: productCount }).map((_, i) => (
            <ProductCardSkeleton key={`p3-sk-${i}`} />
          ))}
        </div>
      </div>

      {/* 9. PROMO LAYOUT (Grid de 4 Categorías Inferiores) */}
      <div className="skeleton-container">
        <div className="skeleton-promo-layout-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={`promo-lay-${i}`} className="skeleton-box promo-category-card"></div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomeSkeleton;
