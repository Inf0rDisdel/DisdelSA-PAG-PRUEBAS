import React, { useMemo } from 'react';
import { useProducts } from 'hooks/useProducts';
import ProductCard from "components/ui/ProductCard/ProductCard";
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';

const RelatedProducts = ({ category, currentProductId }) => {

  const { data: allProducts, isLoading } = useProducts(); 

  // 1. Buscamos en la caché global de React Query
  const relatedList = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return [];

    // Filtramos: Misma categoría, pero que NO sea el producto que estamos viendo
    return allProducts
      .filter(p => 
        p.Categoria === category && 
        String(p.IdProducto) !== String(currentProductId)
      )
      .slice(0, 4); // Solo mostramos los primeros 4
  }, [allProducts, category, currentProductId]);

  if (isLoading) {
    return (
      <section className='pdp-realted-section' style={{marginTop: '50px'}}>
        <h2 style={{ marginBottom: '25px', fontSize: '1.4rem', fontWeight: '600', color: '#333'}}>
          Buscando productos relacionados...
        </h2>
        <div className='related-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, ninmax(220px, 1fr))', gap:'20px'}}>
          {[1,2,3,4].map(n=> <ProductCardSkeleton key={n} />)}
        </div>
      </section>
    )
  }

  // Si no hay productos en caché o no hay relacionados, no renderizamos nada
  if (relatedList.length === 0) return null;

  return (
    <section className="pdp-related-section" style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
      <h2 style={{ marginBottom: '25px', fontSize: '1.4rem', fontWeight: '600', color: '#333' }}>
        Productos que te pueden interesar
      </h2>
      <div className="related-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '20px' 
      }}>
        {relatedList.map((prod, index) => (
          <ProductCard 
            key={prod.IdProducto} 
            product={prod} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;