import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { Link, Navigate, useParams } from 'react-router-dom';
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
import NotFoundLegacyRedirect from 'pages/Legacy/NotFoundLegacyRedirect';

const CategoryPage = () => {
  const { slug, cat, subcat } = useParams();

  const { data: bannerData } = useBanners();
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  // 1. Declaración de Estados primero (Evita errores de inicialización de variables)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 468 : false);

  const [sortBy, setSortBy] = useState('default');
  const scrollRef = useRef(null);

  const cleanSlug = slug ? slug.replace(/\/$/, "").trim() : '';
  const canonicalSlug = createSlug(cleanSlug);
  const categoryParamSlug = createSlug(cat || '');
  const subcategoryParamSlug = createSlug(subcat || '');
  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();

  const currentSegment = useMemo(() => {
      if (!menuData) return null;
      return menuData.find(seg => createSlug(seg.NombreSegmento) === canonicalSlug) || null;
  }, [menuData, canonicalSlug]);

  // Resuelve la selección directamente desde la URL antes del primer pintado.
  // Así categorías y subcategorías no aparecen un frame después del banner.
  const { activeCatId, activeSubCatId, hasInvalidHierarchy } = useMemo(() => {
    const categories = currentSegment?.Categorias || [];
    const selectedCategory = cat
      ? categories.find(item => createSlug(item.NombreCategoria) === categoryParamSlug)
      : null;
    const resolvedCategory = selectedCategory || null;
    const selectedSubcategory = subcat
      ? selectedCategory?.SubCategorias?.find(item => createSlug(item.NombreSubCategoria) === subcategoryParamSlug)
      : null;

    return {
      activeCatId: resolvedCategory?.IdCategoria ?? null,
      activeSubCatId: selectedSubcategory?.IdSubCategoria ?? null,
      hasInvalidHierarchy: Boolean(
        (cat && !selectedCategory) ||
        (subcat && (!selectedCategory || !selectedSubcategory))
      ),
    };
  }, [currentSegment, cat, subcat, categoryParamSlug, subcategoryParamSlug]);

  const canonicalPath = `/categoria/${canonicalSlug}${cat ? `/${categoryParamSlug}` : ''}${subcat ? `/${subcategoryParamSlug}` : ''}`;
  const needsCanonicalRedirect = Boolean(
    currentSegment &&
    !hasInvalidHierarchy &&
    (
      cleanSlug !== canonicalSlug ||
      (cat && cat !== categoryParamSlug) ||
      (subcat && subcat !== subcategoryParamSlug)
    )
  );

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
    const text = (value) => String(value || '').trim();
    const compare = (valueA, valueB) => text(valueA).localeCompare(text(valueB), 'es', {
      sensitivity: 'base',
      numeric: true,
    });
    const compareWithEmptyLast = (valueA, valueB) => {
      const cleanA = text(valueA);
      const cleanB = text(valueB);
      if (!cleanA && cleanB) return 1;
      if (cleanA && !cleanB) return -1;
      return compare(cleanA, cleanB);
    };

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

    if (sortBy === 'brand-az') {
      return productsCopy.sort((a, b) => (
        compareWithEmptyLast(a.Marca || a.Categoria, b.Marca || b.Categoria)
        || compare(a.Descripcion, b.Descripcion)
      ));
    }

    if (sortBy === 'category-az') {
      return productsCopy.sort((a, b) => (
        compareWithEmptyLast(a.Categoria || a.NombreCategoria, b.Categoria || b.NombreCategoria)
        || compare(a.Descripcion, b.Descripcion)
      ));
    }

    return productsCopy;
  }, [filteredProducts, sortBy]);

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    return found ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil || found.Imagen}` : '';
  }, [bannerData]);

  const iconoInicio = useMemo(() => {
    const iconDb = bannerData?.Iconos?.find(icon => icon.Titulo?.trim() === "IconoInicio");
    return iconDb ? `${AppConfig.baseImageUrl}${iconDb.Imagen}` : defaultImage;
  }, [bannerData, defaultImage]);

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

  if (loadingMenu || loadingProducts) {
    return <CatalogSkeleton variant="category" />;
  }

  if (!currentSegment || hasInvalidHierarchy) {
    return <NotFoundLegacyRedirect />;
  }

  if (needsCanonicalRedirect) {
    return <Navigate to={canonicalPath} replace />;
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
              fetchPriority="high"
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
              <Link
                to={`/categoria/${canonicalSlug}`}
                className={`cat-nav-item ${!cat ? 'active-filter' : ''}`}
                aria-current={!cat ? 'page' : undefined}
              >
                <div className="cat-nav-icon">
                  <img
                    src={iconoInicio}
                    alt=""
                    aria-hidden="true"
                    width="24"
                    height="24"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                </div>
                <span>Ver todo</span>
              </Link>

              {currentSegment.Categorias?.map((catItem, index) => (
                <Link
                  key={`sidebar-cat-${catItem.IdCategoria}-${index}`}
                  to={`/categoria/${canonicalSlug}/${createSlug(catItem.NombreCategoria)}`}
                  className={`cat-nav-item ${norm(activeCatId) === norm(catItem.IdCategoria) ? 'active-filter' : ''}`}
                  aria-current={norm(activeCatId) === norm(catItem.IdCategoria) ? 'page' : undefined}
                >
                  <div className="cat-nav-icon">
                    <img 
                      src={catItem.Imagen ? `${AppConfig.baseImageUrl}${catItem.Imagen}` : defaultImage} 
                      alt={catItem.NombreCategoria} 
                      width="24" height="24" 
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
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
                <nav className="cat-subcategories-bar" aria-label={`Subcategorías de ${activeCategoryData.NombreCategoria}`}>
                    <Link
                      to={`/categoria/${canonicalSlug}/${createSlug(activeCategoryData.NombreCategoria)}`}
                      className={`cat-sub-pill ${!activeSubCatId ? 'active' : ''}`}
                    >
                      Ver todo
                    </Link>
                    {activeCategoryData.SubCategorias.map(sub => (
                        <Link
                          key={sub.IdSubCategoria}
                          to={`/categoria/${canonicalSlug}/${createSlug(activeCategoryData?.NombreCategoria)}/${createSlug(sub.NombreSubCategoria)}`}
                          className={`cat-sub-pill ${norm(activeSubCatId) === norm(sub.IdSubCategoria) ? 'active' : ''}`}
                        >
                            {sub.NombreSubCategoria}
                        </Link>
                    ))}
                </nav>
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
                  <option value="az">Producto: A-Z</option>
                  <option value="za">Producto: Z-A</option>
                  <option value="brand-az">Marca: A-Z</option>
                  <option value="category-az">Categoría: A-Z</option>
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
