import React from 'react';
import Skeleton from '../Skeleton/Skeleton';
// Importamos el CSS del ProductCard para heredar automáticamente las proporciones, grid y márgenes
import '../ProductCard/ProductCard.css'; 

const ProductCardSkeleton = () => {
  return (
    <div className="product-card" style={{ pointerEvents: 'none' }}>
      
      {/* 1. Contenedor de la Imagen: Hereda el aspect-ratio 1:1 del CSS */}
      <div className="product-image-container">
        <Skeleton width="100%" height="100%" />
      </div>
      
      <div className="product-link">
        {/* 2. Textos e Información */}
        <div className="product-info-top">
          {/* Marca / Categoría */}
          <Skeleton width="45%" height="10px" style={{ marginBottom: '8px' }} />
          
          {/* Título de producto (simulamos 2 líneas para coincidir con la altura fija del h3) */}
          <Skeleton width="90%" height="14px" style={{ marginBottom: '6px' }} />
          <Skeleton width="65%" height="14px" style={{ marginBottom: '12px' }} />
          
          {/* Código o Detalle ID */}
          <Skeleton width="50%" height="11px" style={{ marginBottom: '5px' }} />
        </div>
      </div>

      {/* 3. Botón de Cotizar (Footer) */}
      <div className="product-card-footer">
        {/* El botón real tiene un border-radius de 10px (8px en móvil) y un alto promedio de 38px */}
        <Skeleton width="100%" height="38px" style={{ borderRadius: '10px' }} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;