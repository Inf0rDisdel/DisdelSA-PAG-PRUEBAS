import React from 'react';
import Skeleton from '../Skeleton/Skeleton';

const ProductCardSkeleton = () => {
  return (
    <div style={{ 
      padding: '15px', 
      border: '1px solid #eee', 
      borderRadius: '12px', 
      background: 'white',
      height: '100%' 
    }}>
      {/* Imagen del producto */}
      <Skeleton width="100%" height="180px" style={{ marginBottom: '15px' }} />
      
      {/* Título */}
      <Skeleton width="80%" height="20px" style={{ marginBottom: '10px' }} />
      
      {/* Precio o Categoría */}
      <Skeleton width="40%" height="15px" style={{ marginBottom: '20px' }} />
      
      {/* Botón */}
      <Skeleton width="100%" height="40px" style={{ borderRadius: '25px' }} />
    </div>
  );
};

export default ProductCardSkeleton;