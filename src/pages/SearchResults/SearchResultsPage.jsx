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
  const decodedQuery = decodeURIComponent(query);

  const fullSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://disdelsa.com/" },
          { "@type": "ListItem", "position": 2, "name": "Búsqueda", "item": `https://disdelsa.com/buscar?q=${encodeURIComponent(query)}` }
        ]
      },
      {
        "@type": "SearchResultsPage",
        "mainEntity": {
          "@type": "ItemList",
          "name": `Resultados para ${decodedQuery}`,
          "numberOfItems": 0 
        }
      }
    ]
  }), [query, decodedQuery]);

  // LÓGICA DE FILTRADO + ELIMINACIÓN DE DUPLICADOS
  const resultados = useMemo(() => {
    if (!productos || !Array.isArray(productos)) return [];
    
    const searchLower = query.toLowerCase().trim();
    if (!searchLower) return productos;
    
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
      if (!p.IdProducto || seenIds.has(p.IdProducto)) return false;
      seenIds.add(p.IdProducto);
      return true;
    });

  }, [productos, query]); 

  if (fullSchema && fullSchema["@graph"][1].mainEntity) {
    fullSchema["@graph"][1].mainEntity.numberOfItems = resultados.length;
  }

  if (isLoading) return <div className={styles.loading}>Buscando suministros en Disdel...</div>;
  return (
    <main className={styles.searchPageWrapper}>
      <Helmet>
        {/* --- 1. SEO ESTÁNDAR --- */}
        <title>{`Comprar ${decodedQuery} en Guatemala | Disdel`}</title>
        <meta name="description" content={`Resultados de búsqueda para ${decodedQuery}. Encuentra suministros institucionales de alta calidad con entrega en toda Guatemala.`} />
        <link rel="canonical" href={`https://disdelsa.com/buscar?q=${query}`} />
        <meta name="robots" content="index, follow" />

        {/* --- 2. OPTIMIZACIÓN DE CARGA (Core Web Vitals) --- */}
        {/* Preconecta al servidor de imágenes para ganar velocidad (LCP) */}
        <link rel="preconnect" href="https://disdelsa.com" />
        <link rel="dns-prefetch" href="https://disdelsa.com" />

        {/* --- 3. SEO LOCAL (Guatemala) --- */}
        <meta name="geo.region" content="GT-GU" /> {/* Guatemala, Ciudad */}
        <meta name="geo.placename" content="Guatemala" />
        <meta name="geo.position" content="14.6349;-90.5069" />
        <meta name="ICBM" content="14.6349, -90.5069" />

        {/* --- 4. REDES SOCIALES (Open Graph) --- */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Resultados para "${decodedQuery}" en Disdel`} />
        <meta property="og:description" content="Encuentra los mejores suministros industriales y de limpieza profesional en nuestra tienda online." />
        <meta property="og:image" content="https://disdelsa.com/logo-social.jpg" /> {/* URL de una imagen de marca */}
        <meta property="og:url" content={`https://disdelsa.com/buscar?q=${query}`} />
        <meta property="og:site_name" content="Disdel" />

        {/* --- 5. TWITTER CARD --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Catálogo Disdel: ${decodedQuery}`} />
        <meta name="twitter:image" content="https://disdelsa.com/logo-social.jpg" />

        {/* --- 6. ESTILO DEL NAVEGADOR (Mobile) --- */}
        <meta name="theme-color" content="#135eab" /> {/* Color azul Disdel para la barra del navegador en Android */}

        {/* --- 7. SCHEMA (JSON-LD) --- */}
        <script type="application/ld+json">
          {JSON.stringify(fullSchema)}
        </script>
      </Helmet>

      <div className={styles.container}>
        <header className={styles.searchHeader}>
          <p>Se encontraron {resultados.length} coincidencias</p>
        </header>

        <div className={styles.resultsContent} style={{ minHeight: '60vh' }}>
          {resultados.length > 0 ? (
            <div className={styles.productGrid}>
              {resultados.map((p, index) => (
                <ProductCard 
                  key={p.IdProducto} 
                  index={index} // Importante para el SEO/LCP que añadimos antes
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
              <h2>No hay resultados para tu búsqueda</h2>
              <p>Intenta con palabras más generales o revisa la ortografía.</p>
              <button onClick={() => window.history.back()} className={styles.btnBack}>
                Volver atrás
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchResultsPage;