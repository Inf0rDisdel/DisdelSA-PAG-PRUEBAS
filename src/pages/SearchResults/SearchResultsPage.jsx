import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProducts } from 'hooks/useProducts'; 
import ProductCard from 'components/ui/ProductCard/ProductCard';
import styles from './SearchResults.module.css';

const SearchResultsPage = () => {
  const location = useLocation();
  const { data: productos, isLoading } = useProducts();
  
  // 🚀 LEEMOS LA BÚSQUEDA INVISIBLE DESDE EL STATE DE MANERA SEGURA (Con fallback vacío)
  const query = location.state?.q || '';
  const decodedQuery = query; // Al venir en memoria, ya viene decodificado automáticamente

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);

  // --- 1. LÓGICA DE FILTRADO DE TEXTO (Tu lógica original mejorada) ---
  const matchedByText = useMemo(() => {
    if (!productos || !Array.isArray(productos)) return [];
    
    const searchLower = decodedQuery.toLowerCase().trim();
    if (!searchLower) return productos;

    const searchWords = searchLower.split(/\s+/);
    
    const matched = productos.filter(p => {
      const descripcion = (p.Descripcion || "").toString().toLowerCase();
      const id = (p.IdProducto || "").toString().toLowerCase();
      const marca = (p.Marca || "").toString().toLowerCase();
      const categoria = (p.Categoria || "").toString().toLowerCase();
      const combinedText = `${descripcion} ${id} ${marca} ${categoria}`;
      return searchWords.every(word => combinedText.includes(word));
    });

    const seenIds = new Set();
    return matched.filter(p => {
      if (!p.IdProducto || seenIds.has(p.IdProducto)) return false;
      seenIds.add(p.IdProducto);
      return true;
    });
  }, [productos, decodedQuery]);

  // --- 2. EXTRACCIÓN DE FACETAS (Para los checkboxes del filtro) ---
  const facets = useMemo(() => {
    const brands = {};
    const categories = {};
    matchedByText.forEach(p => {
      if (p.Marca) brands[p.Marca] = (brands[p.Marca] || 0) + 1;
      if (p.Categoria) categories[p.Categoria] = (categories[p.Categoria] || 0) + 1;
    });
    return {
      brands: Object.entries(brands).sort((a, b) => b[1] - a[1]),
      categories: Object.entries(categories).sort((a, b) => b[1] - a[1])
    };
  }, [matchedByText]);

  // --- 3. APLICACIÓN DE FILTROS SELECCIONADOS ---
  const resultadosFinales = useMemo(() => {
    return matchedByText.filter(p => {
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.Marca);
      const matchCat = selectedCats.length === 0 || selectedCats.includes(p.Categoria);
      return matchBrand && matchCat;
    });
  }, [matchedByText, selectedBrands, selectedCats]);

  const fullSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.disdelsa.com/" },
          { "@type": "ListItem", "position": 2, "name": "Búsqueda", "item": `https://www.disdelsa.com/buscar?q=${encodeURIComponent(query)}` }
        ]
      },
      {
        "@type": "SearchResultsPage",
        "mainEntity": {
          "@type": "ItemList",
          "name": `Resultados para ${decodedQuery}`,
          "numberOfItems": resultadosFinales.length 
        }
      }
    ]
  }), [query, decodedQuery, resultadosFinales.length]);

 const handleToggleFilter = (value, list, setList) => {
    setList(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  };

  if (isLoading) return <div className={styles.loading}>Buscando suministros en Disdel...</div>;
  
  return (
    <main className={styles.searchPageWrapper}>
      <Helmet>
        {/* --- 1. SEO ESTÁNDAR (CON 'NOINDEX' PARA PROTEGER TU CRAWL BUDGET) --- */}
        <title>{decodedQuery ? `Comprar ${decodedQuery} en Guatemala | Disdel` : "Buscar Suministros | Disdel"}</title>
        <meta name="description" content={decodedQuery ? `Resultados de búsqueda para ${decodedQuery}. Encuentra suministros institucionales de alta calidad con entrega en toda Guatemala.` : "Buscador de suministros industriales y de limpieza profesional en Guatemala."} />
        
        {/* 🚀 CANÓNICA LIMPIA: Apunta a la URL base de búsqueda sin parámetros de consulta */}
        <link rel="canonical" href="https://disdelsa.com/buscar" />
        <meta name="robots" content="noindex, nofollow" /> {/* Indica a Google que no gaste rastreo en búsquedas dinámicas */}

        {/* --- 2. OPTIMIZACIÓN DE CARGA (Core Web Vitals) --- */}
        <link rel="preconnect" href="https://disdelsa.com" />
        <link rel="dns-prefetch" href="https://disdelsa.com" />

        {/* --- 3. SEO LOCAL (Guatemala) --- */}
        <meta name="geo.region" content="GT-GU" />
        <meta name="geo.placename" content="Guatemala" />
        <meta name="geo.position" content="14.6349;-90.5069" />
        <meta name="ICBM" content="14.6349, -90.5069" />

        {/* --- 4. REDES SOCIALES (Open Graph) --- */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={decodedQuery ? `Resultados para "${decodedQuery}" en Disdel` : "Buscador de Suministros | Disdel"} />
        <meta property="og:description" content="Encuentra los mejores suministros industriales y de limpieza profesional en nuestra tienda online." />
        <meta property="og:image" content="https://www.disdelsa.com/logo-social.jpg" />
        
        {/* 🚀 URL OG CANÓNICA LIMPIA */}
        <meta property="og:url" content="https://disdelsa.com/buscar" />
        <meta property="og:site_name" content="Disdel" />

        {/* --- 5. TWITTER CARD --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={decodedQuery ? `Catálogo Disdel: ${decodedQuery}` : "Catálogo Disdel"} />
        <meta name="twitter:image" content="https://www.disdelsa.com/logo-social.jpg" />

        {/* --- 6. ESTILO DEL NAVEGADOR (Mobile) --- */}
        <meta name="theme-color" content="#135eab" />

        {/* --- 7. SCHEMA (JSON-LD) --- */}
        <script type="application/ld+json">
          {JSON.stringify(fullSchema)}
        </script>
      </Helmet>

      <div className={styles.container}>
        <header className={styles.searchHeader}>
          <p>Se encontraron {resultadosFinales.length} coincidencias</p>
        </header>

        <div className={styles.searchContentLayout}>
          {/* 🔥 SIDEBAR DE FILTROS (Mantenemos coherencia visual) */}
          {matchedByText.length > 0 && (
            <aside className={styles.filterSidebar}>
              <div className={styles.filterGroup}>
                <h4>Marcas</h4>
                <ul>
                  {facets.brands.slice(0, 15).map(([name, count]) => (
                    <li key={name}>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(name)}
                          onChange={() => handleToggleFilter(name, selectedBrands, setSelectedBrands)}
                        />
                        <span>{name} ({count})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.filterGroup}>
                <h4>Categorías</h4>
                <ul>
                  {facets.categories.slice(0, 15).map(([name, count]) => (
                    <li key={name}>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={selectedCats.includes(name)}
                          onChange={() => handleToggleFilter(name, selectedCats, setSelectedCats)}
                        />
                        <span>{name} ({count})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

        <div className={styles.resultsContent} style={{ minHeight: '60vh', flex: 1 }}>
            {resultadosFinales.length > 0 ? (
              <div className={styles.productGrid}>
                {resultadosFinales.slice(0, 80).map((p, index) => (
                  <ProductCard 
                    key={p.IdProducto} 
                    index={index} 
                    // 🔥 Simplificamos: Pasamos 'p' directamente. 
                    // Tu ProductCard ya sabe leer IdProducto, Descripcion, etc.
                    product={p} 
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
      </div>
    </main>
  );
};

export default SearchResultsPage;