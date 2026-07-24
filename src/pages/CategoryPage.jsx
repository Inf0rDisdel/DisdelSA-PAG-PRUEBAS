import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CategoryPage.css';
import ProductCard from 'components/ui/ProductCard/ProductCard';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';
import { useFilterProducts } from 'hooks/useFilterProducts';
import { createSlug } from 'utils/slugify';

import CatalogSkeleton from 'components/ui/Skeleton/CatalogSkeleton';
import { getCategorySchema } from 'utils/schemas/categorySchema';
import { optimizedSeoData } from 'utils/SEO/optimizedSeo';
import { useCatalogSeo } from 'hooks/useCatalogSeo';

const CategoryPage = () => {
  const { slug, cat, subcat } = useParams();
  const navigate = useNavigate();

  const { data: bannerData } = useBanners();
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  // 1. Declaración de Estados primero (Evita errores de inicialización de variables)
  const [activeCatId, setActiveCatId] = useState(null);
  const [activeSubCatId, setActiveSubCatId] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 468 : false);

  const [sortBy, setSortBy] = useState('default');
  const scrollRef = useRef(null);

  const cleanSlug = slug ? slug.replace(/\/$/, "").trim() : '';
  const canonicalSlug = cleanSlug.toLowerCase();
  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();

  const currentSegment = useMemo(() => {
      if (!menuData) return null;
      return menuData.find(seg => createSlug(seg.NombreSegmento) === cleanSlug) || null;
  }, [menuData, cleanSlug, createSlug]);

  // 2. Cálculo del ID más específico activo (Nivel 3 ➡️ Nivel 2 ➡️ Nivel 1)
  const seoParams = useMemo(() => {
    if (activeSubCatId) return { idSubCategoria: activeSubCatId }; // Corregida la variable y camelCase para C#
    if (activeCatId) return { idCategoria: activeCatId };         // Corregido a camelCase para C#
    if (currentSegment?.IdSegmento) return { idSegmento: currentSegment.IdSegmento }; // Corregido a camelCase para C#
    return {};
  }, [activeSubCatId, activeCatId, currentSegment]);

  // 3. Consulta dinámica a la API de C# utilizando tu nuevo controlador
  const { data: dbSeo } = useCatalogSeo(seoParams);

  useEffect(() => {
    const handleResize = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 468 : false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [slug, cat, subcat]);

  const activeCategoryData = useMemo(() => {
      if (!currentSegment || !activeCatId) return null;
      return currentSegment.Categorias?.find(cat => norm(cat.IdCategoria) === norm(activeCatId));
  }, [currentSegment, activeCatId]);

  const filteredProducts = useFilterProducts(
    productsData,
    currentSegment,
    activeCatId,
    activeSubCatId
  );

  const sortedProducts = useMemo(() => {
    if (!filteredProducts) return [];

    const productsCopy = [...filteredProducts];

    if (sortBy === 'az') {
      return productsCopy.sort((a, b) => {
        const descA = a.Descripcion?.toLowerCase().trim() || "";
        const descB = b.Descripcion?.toLowerCase().trim() || "";
        return descA.localeCompare(descB, 'es', { sensitivity: 'base' });
      });
    }

    if (sortBy === 'za') {
      return productsCopy.sort((a, b) => {
        const descA = a.Descripcion?.toLowerCase().trim() || "";
        const descB = b.Descripcion?.toLowerCase().trim() || "";
        return descB.localeCompare(descA, 'es', { sensitivity: 'base' });
      });
    }

    return productsCopy;
  }, [filteredProducts, sortBy]);

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    return found ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil || found.Imagen}` : '';
  }, [bannerData]);

  const catBanner = useMemo(() => {
    const bannerObj = bannerData?.sliderPrincipal?.[1]; 
    return {
      desktop: bannerObj?.ImagenBanner ? `${AppConfig.baseImageUrl}${bannerObj.ImagenBanner}` : '',
      mobile: bannerObj?.BannerImagenMovil ? `${AppConfig.baseImageUrl}${bannerObj.BannerImagenMovil}` : ''
    };
  }, [bannerData]);

  const categorySeo = useMemo(() => {
    return optimizedSeoData[canonicalSlug] || null;
  }, [canonicalSlug]);

  const handleWhatsAppClick = () => {
    const phoneNumber = "50231094985"; // Teléfono de Disdel
    const categoryName = activeCategoryData?.NombreCategoria || currentSegment?.NombreSegmento || 'Cafetería';
    const message = `Hola Disdel, me interesa solicitar una cotización personalizada para abastecer mi empresa con productos de la categoría de *${categoryName}*.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const seoData = useMemo(() => {
    const segmentName = currentSegment?.NombreSegmento || "Categoría";
    const categoryName = activeCategoryData?.NombreCategoria;
    const subCategoryName = activeCategoryData?.SubCategorias?.find(
      s => norm(s.IdSubCategoria) === norm(activeSubCatId)
    )?.NombreSubCategoria;

    const cleanCanonicalUrl = `https://disdelsa.com/categoria/${slug}${cat ? '/' + cat : ''}${subcat ? '/' + subcat : ''}`;

    // 🚀 SOLUCIÓN: Usamos 'activeSeo' para evitar sombrear la variable externa 'dbSeo' de la API
    const activeSeo = dbSeo || {};
    if (dbSeo) {
      return {
        title: activeSeo.MetaTitle || activeSeo.metaTitle || `${categoryName || segmentName} en Guatemala`,
        description: activeSeo.MetaDescription || activeSeo.metaDescription || "",
        url: activeSeo.CanonicalUrl || activeSeo.canonicalUrl || cleanCanonicalUrl,
        image: activeSeo.OgImage || activeSeo.ogImage || catBanner.desktop || defaultImage,
        h1: activeSeo.H1 || activeSeo.h1 || `${categoryName || segmentName} en Guatemala`,
        h2: activeSeo.H2Principal || activeSeo.h2Principal || "",
        content: activeSeo.SeoContent || activeSeo.seoContent || ""
      };
    }

    // 🚀 FIX: Usamos "let" para permitir la construcción del título dinámico
    let dynamicTitle = categorySeo?.t || categoryName || segmentName;

    // Si no hay SEO manual en el JSON, construimos el título jerárquico
    if (!categorySeo?.t) {
      if (categoryName && cat && !subcat) {
        dynamicTitle = `${categoryName} en Guatemala | ${segmentName}`;
      }
      if (subCategoryName && subcat) {
        dynamicTitle = `${subCategoryName} | ${categoryName} | Disdel`;
      }
    }

    const finalTitle = dynamicTitle.includes("Disdel") 
      ? dynamicTitle 
      : `${dynamicTitle} en Guatemala | Mayoreo y Unidad | Disdel`;

    return {
      title: finalTitle,
      description: categorySeo?.d || `Distribución líder de ${dynamicTitle} institucional en Guatemala. Soluciones de alta concentración para empresas, hospitales y hogares.`,
      url: `https://disdelsa.com/categoria/${slug}${cat ? '/' + cat : ''}${subcat ? '/' + subcat : ''}`,
      image: catBanner.desktop || defaultImage,
      h1: `${categoryName || segmentName} en Guatemala`,
      h2: categorySeo?.t || `Guía de Selección: ${finalTitle}`,
      content: categorySeo?.d || `En Disdel somos expertos en la distribución de ${currentSegment?.NombreSegmento}.`
    };
  }, [categorySeo, activeCategoryData, currentSegment, slug, cat, subcat, catBanner, defaultImage, activeSubCatId, dbSeo]);

  const fullSchema = useMemo(() => {
  if (!currentSegment) return null;

  // Obtenemos el nombre de la subcategoría activa si el usuario seleccionó una
  const subCategoryName = activeCategoryData?.SubCategorias?.find(
    s => norm(s.IdSubCategoria) === norm(activeSubCatId)
  )?.NombreSubCategoria;

  return getCategorySchema({
    title: seoData.title,
    description: seoData.description,
    url: seoData.url,
    products: sortedProducts, // Conserva la lista ordenada activa
    segmentName: currentSegment?.NombreSegmento || "",
    categoryName: activeCategoryData?.NombreCategoria || "",
    subCategoryName: subCategoryName || ""
  });
  }, [currentSegment, activeCategoryData, activeSubCatId, sortedProducts, seoData]);  

   useEffect(() => {
    if (!currentSegment?.Categorias) return;
    if (cat) {
      const foundCat = currentSegment.Categorias.find(c => createSlug(c.NombreCategoria) === cat);
      if (foundCat) {
        setActiveCatId(foundCat.IdCategoria);
        if (subcat && foundCat.SubCategorias) {
          const foundSub = foundCat.SubCategorias.find(s => createSlug(s.NombreSubCategoria) === subcat);
          setActiveSubCatId(foundSub ? foundSub.IdSubCategoria : null);
        } else {
          setActiveSubCatId(null);
        }
      }
    } else {
      setActiveCatId(currentSegment.Categorias[0]?.IdCategoria);
      setActiveSubCatId(null);
    }
  }, [cat, subcat, currentSegment]);
  
  if (loadingMenu || loadingProducts) {
    return <CatalogSkeleton />; // 🚀 Reutilización de código limpia y eficiente
  }

  if (!currentSegment) {
    return (
      <div className="no-products-msg" style={{ textAlign: 'center', padding: '100px' }}>
        {/* 🚀 SOLUCIÓN SOFT 404: Le indicamos a Google que no indexe esta categoría inexistente */}
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>Categoría no encontrada | Disdel</title>
        </Helmet>
        Categoría no encontrada
      </div>
    );
  }

  return (
    <div className="cat-master-wrapper">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={categorySeo?.k || "suministros, guatemala, limpieza"} />
        <link rel="canonical" href={seoData.url} />
        
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Disdel" />

        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(fullSchema)}</script>
      </Helmet>
      
      <div className="cat-container">

        <div className="breadcumb-container">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to={`/categoria/${canonicalSlug}`}>
            {currentSegment?.NombreSegmento}
          </Link>
          {activeCategoryData && (
            <>
              <span>/</span>
              <span>{activeCategoryData.NombreCategoria}</span>
            </>
          )}
        </div>

        <div className="cat-header-section">
            <img 
              src={isMobile ? (catBanner.mobile || catBanner.desktop) : catBanner.desktop} 
              alt={currentSegment.NombreSegmento} 
              className="cat-main-banner" 
              fetchpriority="high"
              loading="eager"
              width="1300" height="280"
              decoding="async"
            />
            <div className="cat-header-overlay">
                <h1 className="cat-segment-title">
                  {activeCategoryData?.NombreCategoria || currentSegment.NombreSegmento} en Guatemala
                </h1>
                <p className='category-subtitle'>
                Soluciónes para empresas, industria, hoteles y hospitales.
              </p>
            </div>
        </div>

        <div className="cat-content-layout">
           <aside className="cat-sidebar-left" aria-label="Menú de categorías">
            <div className="cat-sidebar-header-mobile">
                <div className="cat-sidebar-label">CATEGORÍAS</div>
            </div>
             <div className="cat-sidebar-nav" ref={scrollRef}>
              {currentSegment.Categorias?.map((catItem, index) => (
                <Link
                  key={`sidebar-cat-${catItem.IdCategoria}-${index}`}
                  to={`/categoria/${canonicalSlug}/${createSlug(catItem.NombreCategoria)}`}
                  className={`cat-nav-item ${norm(activeCatId) === norm(catItem.IdCategoria) ? 'active-filter' : ''}`}
                >
                  <div className="cat-nav-icon">
                    <img 
                      src={catItem.Imagen ? `${AppConfig.baseImageUrl}${catItem.Imagen}` : defaultImage} 
                      alt={catItem.NombreCategoria} 
                      width="24" height="24" 
                      loading="lazy" 
                      // 🚀 SANEAMIENTO EXTRA: Previene iconos rotos de categorías secundarias en el sidebar
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                 </div>
                  <span>{catItem.NombreCategoria}</span>
                </Link>
              ))}
            </div>
          </aside>

          <section className="cat-right-column" aria-label="Listado de productos">
            {activeCategoryData?.SubCategorias?.length > 0 && (
                <div className="cat-subcategories-bar">
                    {activeCategoryData.SubCategorias.map(sub => (
                        <Link
                          key={sub.IdSubCategoria}
                          to={`/categoria/${canonicalSlug}/${createSlug(activeCategoryData?.NombreCategoria)}/${createSlug(sub.NombreSubCategoria)}`}
                          className={`cat-sub-pill ${norm(activeSubCatId) === norm(sub.IdSubCategoria) ? 'active' : ''}`}
                        >
                            {sub.NombreSubCategoria}
                        </Link>
                    ))}
                </div>
            )}

            <div className="catalog-toolbar">
              <div className="toolbar-product-count">
                Mostrando <strong>{sortedProducts.length}</strong> productos
              </div>
              <div className="toolbar-sort-wrapper">
                <label htmlFor="sort-select">Ordenar por:</label>
                {/* 🔥 CORREGIDO: Agregamos value y onChange para controlar el estado sortBy */}
                <select 
                  id="sort-select" 
                  className="toolbar-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Más cotizados</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>
              </div>
            </div>

           <div className="cat-grid-products"> 
              {sortedProducts.length > 0 ? (
                // 🔥 CORREGIDO: Mapeamos sobre la lista ordenada 'sortedProducts' en lugar de 'filteredProducts'
                sortedProducts.map((prod, index) => (
                  <ProductCard 
                    key={prod.IdProducto} 
                    product={prod} 
                    index={index} 
                  />
                ))
              ) : (
                <div className="no-products-found" style={{gridColumn: '1/-1', textAlign:'center', padding: '50px'}}>
                  <p>No se encontraron productos en esta selección.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="category-cta">
          <div className="cta-content">
            <h2>¿Busca abastecer su empresa?</h2>
            <p>Nuestros asesores comerciales pueden ayudarle a seleccionar los productos ideales para su negocio con tarifas preferenciales por volumen.</p>
          </div>
          <button className="cta-whatsapp-btn" onClick={handleWhatsAppClick}>
            {/* SVG Icono oficial de WhatsApp */}
            <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.056 11.948.056c3.174.001 6.157 1.238 8.4 3.483 2.243 2.245 3.479 5.228 3.479 8.402 0 6.549-5.337 11.841-11.886 11.841a11.9 11.9 0 01-5.724-1.472L0 24zm6.542-4.177l.385.228a9.907 9.907 0 005.021 1.378c5.461 0 9.905-4.405 9.908-9.823.003-2.624-1.017-5.093-2.871-6.951-1.854-1.857-4.325-2.88-6.953-2.881-5.462 0-9.906 4.404-9.91 9.822-.001 2.016.521 3.99 1.514 5.73l.26.455-1.01 3.687 3.766-.988zm11.455-6.113c-.301-.15-1.78-.874-2.056-.974-.276-.101-.476-.15-.676.15-.199.3-.774.974-.95 1.174-.175.2-.351.224-.652.075a8.219 8.219 0 01-2.435-1.498 9.07 9.07 0 01-1.683-2.091c-.176-.301-.019-.462.132-.612.135-.135.301-.351.451-.526.15-.175.2-.3.301-.5.1-.201.05-.376-.025-.526-.075-.15-.676-1.629-.926-2.229-.244-.599-.513-.518-.676-.52-.159-.001-.341-.001-.522-.001-.182 0-.476.068-.724.385-.249.317-.95 1.025-.95 2.5s1.074 2.9 1.224 3.1c.15.2 2.11 3.224 5.112 4.522.714.309 1.272.494 1.707.632.717.227 1.37.195 1.885.118.574-.085 1.78-.724 2.03-1.424.25-.699.25-1.3.175-1.424-.075-.101-.275-.15-.576-.3z" />
            </svg>
            Cotizar por WhatsApp
          </button>
        </section>
      </div>

      <section className="cat-expert-content" aria-label="Información adicional de categoría">
        <div className="cat-container">
          <hr className="pdp-divider" />
          {/* H2 Dinámico de Base de Datos */}
          <h2>{seoData.h2 || `Guía de Selección: ${seoData.title}`}</h2>
          {/* Párrafo dinámico de Base de Datos */}
          <p className="cat-expert-text">
            {seoData.content}
          </p>
          
          <div className="cat-benefits-grid">
            <div className="benefit-item">🏢 Atención para empresas e instituciones</div>
            <div className="benefit-item">📦 Compra por volumen y abastecimiento continuo</div>
            <div className="benefit-item">👨‍💼 Asesoría técnica especializada</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;