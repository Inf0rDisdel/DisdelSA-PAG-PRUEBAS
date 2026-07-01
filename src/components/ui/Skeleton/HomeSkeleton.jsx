import React from 'react';
import Skeleton from './Skeleton'; // 🚀 Importación relativa correcta al componente base

export const HomeSkeleton = () => {

  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 480 : false;
  // Reutilizamos tus clases CSS existentes para garantizar acoplamiento del 100% en anchos y alturas
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* 1. MOCK DEL HERO SLIDER */}
      <section className="main-container skeleton-hero" aria-hidden="true">
        <div className="banners-container-skeleton skeleton-animation"></div>
        <div className="slider-container-skeleton skeleton-animation"></div>
      </section>

      {/* 2. MOCK DE CATEGORÍAS */}
      <section className="cgs-section" aria-hidden="true">
        <div style={{ marginBottom: '12px' }}>
          <Skeleton width="220px" height="42px" style={{ borderRadius: '18px' }} />
        </div>

        <div className="cgs-skeleton-grid"> 
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="cgs-item-skeleton" style={{ textAlign: 'center' }}>
              <Skeleton width="100%" height="240px" style={{ borderRadius: '20px' }} className="skeleton-animation" />
              <Skeleton width="60%" height="20px" style={{ marginTop: '16px', margin: '16px auto 0' }} className="skeleton-animation" />
            </div>
          ))}
        </div>
      </section>

      {/* 🚀 3. MOCK DE ALIADOS COMERCIALES (Reutiliza tus clases de FeaturedBrands.css) */}
      <section className="featured-brands-section" aria-hidden="true" style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '12px', padding: '0 20px' }}>
          <Skeleton width="220px" height="42px" style={{ borderRadius: '18px' }} />
        </div>
        <div className="brands-container-skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="brand-item-skeleton skeleton-animation" 
              style={{ height: isMobile ? '140px' : '250px', borderRadius: isMobile ? '0' : '35px' }}
            ></div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomeSkeleton;