import React from 'react';
import Skeleton from 'components/ui/Skeleton/Skeleton';
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';

export const CatalogSkeleton = () => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 468 : false;

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ width: '100%', maxWidth: 'var(--site-max-width)', margin: '0 auto', padding: isMobile ? '0 10px' : '0 20px', boxSizing: 'border-box' }}>
        
        {/* Banner de encabezado */}
        <div style={{ marginTop: '20px', marginBottom: '30px', borderRadius: '16px', overflow: 'hidden', height: isMobile ? '150px' : '280px' }}>
          <Skeleton width="100%" height="100%" className="skeleton-animation" style={{ borderRadius: '16px' }} />
        </div>

        {/* Layout de 2 columnas */}
        <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: '40px' }}>
          
          {/* Sidebar izquierdo (Oculto en móvil por defecto en tu CSS) */}
          <aside style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eee', display: isMobile ? 'none' : 'block' }}>
            <div style={{ marginBottom: '20px' }}>
              <Skeleton width="45%" height="12px" className="skeleton-animation" />
            </div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <Skeleton width="24px" height="24px" style={{ borderRadius: '50%', marginRight: '12px' }} className="skeleton-animation" />
                <Skeleton width="60%" height="14px" className="skeleton-animation" />
              </div>
            ))}
          </aside>

          {/* Grid de productos */}
          <main style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: isMobile ? '10px' : '25px' }}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default CatalogSkeleton;