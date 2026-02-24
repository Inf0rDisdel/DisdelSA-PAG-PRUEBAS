import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProducts } from 'hooks/useProducts'; 
import ProductCard from 'components/ui/ProductCard/ProductCard';
import styles from './SearchResults.module.css';

const SearchResultsPage = () => {
  const location = useLocation();
  const { data: productos, isLoading } = useProducts();
  
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.disdelsa.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.disdelsa.com/buscar?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // LÓGICA DE FILTRADO + ELIMINACIÓN DE DUPLICADOS
  const resultados = useMemo(() => {
    if (!productos || !Array.isArray(productos)) return [];
    
    const searchLower = query.toLowerCase().trim();
    
    // 1. Primero filtramos por coincidencia de texto
    const matched = productos.filter(p => {
      const descripcion = (p.Descripcion || "").toString().toLowerCase();
      const id = (p.IdProducto || "").toString().toLowerCase();
      const marca = (p.Marca || "").toString().toLowerCase();
      const categoria = (p.Categoria || "").toString().toLowerCase();
      
      return (
        descripcion.includes(searchLower) || 
        id.includes(searchLower) || 
        marca.includes(searchLower) ||
        categoria.includes(searchLower)
      );
    });

    // 2. Luego eliminamos duplicados por ID usando un Set
    const seenIds = new Set();
    return matched.filter(p => {
      if (seenIds.has(p.IdProducto)) return false;
      seenIds.add(p.IdProducto);
      return true;
    });

  }, [productos, query]);

  if (isLoading) return <div className={styles.loading}>Buscando productos...</div>;

  return (
    <div className={styles.searchPageWrapper}>
      <Helmet>
        <title>{`Resultados para "${query}" | Disdel`}</title>
        <script type="application/ld+json">
          {JSON.stringify(searchSchema)}
        </script>
      </Helmet>
      <div className={styles.container}>
        <header className={styles.searchHeader}>
          <p>Se encontraron {resultados.length} coincidencias</p>
        </header>

        {resultados.length > 0 ? (
          <div className={styles.productGrid}>
            {resultados.map(p => (
              <ProductCard 
                key={p.IdProducto} 
                product={{
                  id: p.IdProducto,
                  name: p.Descripcion,
                  price: p.PrecioIVA,
                  image: p.Imagen,
                  brand: p.Marca,
                  ...p 
                }} 
              />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <div className={styles.icon}>🔍</div>
            <h2>No hay resultados exactos para tu búsqueda</h2>
            <p>Prueba buscando por una palabra más general (ej. "Aceite" o "Silver")</p>
            <button onClick={() => window.history.back()} className={styles.btnBack}>
              Volver atrás
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;