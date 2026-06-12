import React from 'react';
import Skeleton from 'components/ui/Skeleton/Skeleton';

export const ProductDetailSkeleton = () => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 468 : false;

  return (
    <div className="pdp-container pdp-skeleton-active" style={{ padding: isMobile ? '10px' : '20px', maxWidth: 'var(--site-max-width)', margin: '0 auto', boxSizing: 'border-box' }}>
      {/* Esqueleto del botón volver */}
      <Skeleton width="150px" height="20px" style={{ marginBottom: '25px' }} />
      
      <div className="pdp-main-grid" style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '15px' : '40px' }}>
        
        {/* Esqueleto de la Galería (Debe medir exactamente 600px de alto en escritorio para evitar CLS) */}
        <div className="pdp-gallery-wrapper" style={{ display: 'flex', gap: '15px' }}>
          {!isMobile && (
            <div className="pdp-thumbnails-vertical" style={{ width: '75px' }}>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} width="75px" height="75px" style={{ marginBottom: '12px' }} />
              ))}
            </div>
          )}
          <div style={{ flex: 1, height: isMobile ? '300px' : '600px' }}>
            <Skeleton width="100%" height="100%" style={{ borderRadius: '15px' }} className="skeleton-animation" />
          </div>
        </div>
        
        {/* Esqueleto de la Info Técnica */}
        <div className="pdp-info-section" style={{ marginTop: isMobile ? '20px' : '0' }}>
          <Skeleton width="30%" height="20px" style={{ marginBottom: '15px' }} className="skeleton-animation" />
          <Skeleton width="85%" height="45px" style={{ marginBottom: '15px' }} className="skeleton-animation" />
          <Skeleton width="40%" height="20px" style={{ marginBottom: '25px' }} className="skeleton-animation" />
          
          {/* Tarjeta comercial */}
          <Skeleton width="100%" height="120px" style={{ borderRadius: '12px', marginBottom: '25px' }} className="skeleton-animation" />
          
          {/* Selector de presentación */}
          <Skeleton width="100%" height="90px" style={{ borderRadius: '12px', marginBottom: '25px' }} className="skeleton-animation" />
          
          {/* Botón cotizar */}
          <Skeleton width="100%" height="50px" style={{ borderRadius: '10px' }} className="skeleton-animation" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;