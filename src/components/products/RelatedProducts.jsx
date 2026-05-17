import React, { useMemo } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import ProductCard from "components/ui/ProductCard/ProductCard";

const RelatedProducts = ({ category, currentProductId }) => {
  const queryClient = useQueryClient();

  // 1. Buscamos en la caché global de React Query
  const relatedList = useMemo(() => {
    // Obtenemos los productos descargados por el hook 'useProducts'
    const allProducts = queryClient.getQueryData(['productos-all']);
    
    if (!allProducts || !Array.isArray(allProducts)) return [];

    // Filtramos: Misma categoría, pero que NO sea el producto que estamos viendo
    return allProducts
      .filter(p => 
        p.Categoria === category && 
        String(p.IdProducto) !== String(currentProductId)
      )
      .slice(0, 4); // Solo mostramos los primeros 4
  }, [category, currentProductId, queryClient]);

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