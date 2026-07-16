import React, { useMemo } from 'react';
import { useProducts } from 'hooks/useProducts';
import ProductCard from "components/ui/ProductCard/ProductCard";
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';

const RelatedProducts = ({ category, currentProductId }) => {

  const { data: allProducts, isLoading } = useProducts(); 

  // 1. Buscamos en la caché global de React Query
  const relatedList = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return [];

    const seenIds = new Set();

    // Filtramos: Misma categoría, pero que NO sea el producto que estamos viendo
    return allProducts
      .filter(p => {
        const isSameCategory = p.Categoria === category;
        const isNotCurrent = String(p.IdProducto) !== String(currentProductId);
        const isNotDuplicate = !seenIds.has(p.IdProducto); // ¿Ya lo vimos?

        if (isSameCategory && isNotCurrent && isNotDuplicate) {
          seenIds.add(p.IdProducto); // Marcamos como visto
          return true;
        }
        return false;
      })
      .slice(0, 5); // Limitamos a 4
  }, [allProducts, category, currentProductId]);

  if (isLoading) {
    return (
      <section className='pdp-realted-section' style={{marginTop: '50px'}}>
        <h2 style={{ marginBottom: '25px', fontSize: '1.4rem', fontWeight: '600', color: '#333'}}>
          Buscando productos relacionados...
        </h2>
        <div className='related-grid'>
          {[1, 2, 3, 4, 5].map(n => <ProductCardSkeleton key={`related-sk-${n}`} />)}
        </div>
      </section>
    )
  }

  // Si no hay productos en caché o no hay relacionados, no renderizamos nada
  if (relatedList.length === 0) return null;

  return (
    <section className="pdp-related-section">
      <h2 className="pdp-related-title">
        Productos que te pueden interesar
      </h2>
      <div className="related-grid">
        {relatedList.map((prod) => (
          <ProductCard 
            key={`${prod.IdProducto}-${category}`} 
            product={prod} 
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;