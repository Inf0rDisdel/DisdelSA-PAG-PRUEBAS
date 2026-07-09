import React from 'react';
import Skeleton from 'components/ui/Skeleton/Skeleton';

export const ProductDetailSkeleton = () => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 468 : false;

  return (
    // 🚀 FIX CLS 1: Agregamos width: '100%' para evitar que Flexbox lo encoja hacia el centro
    <div 
      className="pdp-container pdp-skeleton-active" 
      style={{ 
        padding: isMobile ? '10px' : '20px', 
        width: '100%', 
        maxWidth: 'var(--site-max-width)', 
        margin: '0 auto', 
        boxSizing: 'border-box' 
      }}
    >
      {/* Esqueleto del botón volver */}
      <Skeleton width="150px" height="20px" style={{ marginBottom: '25px' }} />
      
      {/* 🚀 FIX CLS 2: Estilos inline de rejilla para que se posicione correctamente antes de descargar el CSS de la página */}
      <div 
        className="pdp-main-grid" 
        style={{ 
          display: isMobile ? 'block' : 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? '20px' : '40px' 
        }}
      >
        
        {/* Esqueleto de la Galería */}
        <div 
          className="pdp-gallery-wrapper" 
          style={{ display: 'flex', gap: '15px', width: '100%' }}
        >
          {!isMobile && (
            <div 
              className="pdp-thumbnails-vertical" 
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '75px', flexShrink: 0 }}
            >
              {[1, 2, 3].map(i => (
                <Skeleton key={`thumb-sk-${i}`} width="75px" height="75px" style={{ marginBottom: '12px' }} />
              ))}
            </div>
          )}
          <div style={{ flex: 1, height: isMobile ? '300px' : '600px' }}>
            <Skeleton width="100%" height="100%" style={{ borderRadius: '15px' }} className="skeleton-animation" />
          </div>
        </div>
        
        {/* Esqueleto de la Info Técnica */}
        <div 
          className="pdp-info-section" 
          style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: isMobile ? '20px' : '0' }}
        >
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