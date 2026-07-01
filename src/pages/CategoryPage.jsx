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
import { getCollectionSchema } from 'utils/schemas/mainSchemas';
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
        url: activeSeo.CanonicalUrl || activeSeo.canonicalUrl || window.location.href,
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
    const schemaUrl = seoData.url;

    return getCollectionSchema(seoData.title, seoData.description, schemaUrl, filteredProducts);
  }, [currentSegment, filteredProducts, seoData]);   

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

           <div className="cat-grid-products"> 
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod, index) => (
                  /* 🔥 Usamos el componente único. 
                    Esto hereda automáticamente el SEO y el diseño Pro */
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
            <div className="benefit-item">✅ Entrega en 24-48 horas</div>
            <div className="benefit-item">✅ Precios de Distribuidor</div>
            <div className="benefit-item">✅ Soporte Técnico Especializado</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;