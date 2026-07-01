import React, { useState, useEffect, useMemo, useRef } from 'react'; 
import { useParams, Link, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './BrandPage.css';
import ProductCard from 'components/ui/ProductCard/ProductCard';

import { AppConfig } from 'config/AppConfig';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';
import { useBanners } from 'hooks/useBanners';
import { useFilterProducts } from 'hooks/useFilterProducts';
import { createSlug } from 'utils/slugify';
import { getCollectionSchema } from 'utils/schemas/mainSchemas';
import CatalogSkeleton from 'components/ui/Skeleton/CatalogSkeleton';
import { useCatalogSeo } from 'hooks/useCatalogSeo';

const BrandPage = () => {
  const { slug, subcat } = useParams();
  const { data: bannerData } = useBanners();
  const location = useLocation();
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  const [activeCatId, setActiveCatId] = useState(null);
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 468 : false);

  const cleanSlug = slug ? slug.replace(/\/$/, "").trim() : '';
  const canonicalSlug = cleanSlug.toLowerCase(); 
  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();

  //Mapeo de IDs de marcas estáticos para la API de C#
  const seoParams = useMemo(() => {
    if (activeCatId) return { idCategoria: activeCatId }; // Si filtran por categoría dentro de la marca
    
    // Si están en la raíz de la marca, mandamos el ID de la marca correspondiente
    const brandMapping = {
      "wiese": 3238,
      "kimberly-clark-professional": 29, 
      "3m": 28,
      "silver": 27
    };
    const mappedId = brandMapping[canonicalSlug];
    if (mappedId) return { idMarca: mappedId };

    return {};
  }, [activeCatId, canonicalSlug]);

  const { data: dbSeo } = useCatalogSeo(seoParams);

  useEffect(() => {
    const handleResize = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 468 : false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(b => b.Titulo?.trim() === "ImagenDefault3");
    return found ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil || found.Imagen}` : ''; 
  }, [bannerData]);

  const iconoInicio = useMemo (() => {
    const iconDb = bannerData?.Iconos?.find(b => b.Titulo === "IconoInicio");
    return iconDb ? `${AppConfig.baseImageUrl}${iconDb.Imagen}` : '';
  }, [bannerData]);

  // --- 3. LÓGICA DE BANNERS POR MARCA (ID 29, 28, 27) ---
  const visualConfig = useMemo(() => {
    const mapping = {
      "kimberly-clark-professional": { title: "Banner KCP", idGroup: bannerData?.BannersMarcasInternos, color: "#135eab" },
      "silver": { title: "Banner Silver", idGroup: bannerData?.BannersMarcasInternos, color: "#76BD1D" },
      "3m": { title: "3m", idGroup: bannerData?.BannersMarcasInternos, color: "#EE2737" },
      "wiese": { title: "Banner Wiese ", idGroup: bannerData?.BannersMarcasInternos, color: "#692C90" }
    };

    const currentConf = mapping[canonicalSlug] || { color: "#135eab" };
    const apiBanner = bannerData?.BannersMarcasInternos?.find(b => b.Titulo === currentConf.title);

    return {
      color: currentConf.color,
      banner: apiBanner?.Imagen ? `${AppConfig.baseImageUrl}${apiBanner.Imagen}` : null,
      bannerMob: (apiBanner?.BannerImagenMovil || apiBanner?.ImagenMovil) ? `${AppConfig.baseImageUrl}${apiBanner.BannerImagenMovil || apiBanner.ImagenMovil}` : null
    };
  }, [bannerData, canonicalSlug]);

  const currentBrandSegment = useMemo(() => {
    if (!menuData || canonicalSlug === "silver") return null;

    return menuData.find(seg => 
      createSlug(seg.NombreSegmento).includes(cleanSlug) || cleanSlug.includes(createSlug(seg.NombreSegmento))
    );
  }, [menuData, canonicalSlug, cleanSlug]);


  // --- 3. COMPILADOR EXCLUSIVO PARA LA MARCA SILVER ---
  // Extraemos todos los productos activos de Silver directamente desde la base de datos
  const silverProductsRaw = useMemo(() => {
    if (!productsData || canonicalSlug !== "silver") return [];

    return productsData.filter(prod => {
      const brandField = String(prod.Marca || prod.brand || '').toLowerCase().trim();
      const descField = String(prod.Descripcion || prod.name || '').toLowerCase().trim();
      return brandField.includes("silver") || descField.includes("silver");
    });
  }, [productsData, canonicalSlug]);

  // Generamos las categorías dinámicas para Silver basadas en sus productos reales
  const silverCategories = useMemo(() => {
    if (canonicalSlug !== "silver" || silverProductsRaw.length === 0) return [];

    //FUNCION AUXILIAR PARA BUSCAR EL ICONO DE CADA CATEGORIA
    const findOfficialIcon = (catName) => {
      if (!menuData) return null;
      const targetName = catName.toLowerCase().trim();

      for (const segment of menuData) {
        if (segment.Categorias) {
          const matchedCat = segment.Categorias.find(
            c => c.NombreCategoria && c.NombreCategoria.toLowerCase().trim() === targetName
          );
          if (matchedCat && matchedCat.Imagen) {
            return matchedCat.Imagen;
          }
        }
      }
      return null;
    };

    const categoriesMap = {};
    silverProductsRaw.forEach(prod => {
      const catName = prod.Categoria || "Otros";
      const catId = prod.IdCategoria || catName;
      if (!categoriesMap[catId]) {
        categoriesMap[catId] = {
          IdCategoria: catId,
          NombreCategoria: catName,
          Imagen: findOfficialIcon(catName) || null
        };
      }
    });

    return Object.values(categoriesMap);
  }, [silverProductsRaw, canonicalSlug, menuData]);

  const silverFilteredProducts = useMemo(() => {
    if (canonicalSlug !== "silver" || silverProductsRaw.length === 0) return [];

    let result = silverProductsRaw;
    if (activeCatId) {
      result = silverProductsRaw.filter(prod => norm(prod.IdCategoria) === norm(activeCatId));
    }

    const seenIds = new Set();
    return result.filter(prod => {
      const id = norm(prod.IdProducto || prod.id);
      if (!id || seenIds.has(id)) return false;
      seenIds.add(id);
      return true;
    });
  }, [silverProductsRaw, activeCatId, canonicalSlug]);

  // --- 4. CONVERGENCIA DE LÓGICAS (Silver Dinámico vs Estándar) ---
  const displayCategories = useMemo(() => {
    if (canonicalSlug === "silver") return silverCategories;
    return currentBrandSegment?.Categorias || [];
  }, [canonicalSlug, silverCategories, currentBrandSegment]);

  const standardFilteredProducts = useFilterProducts(productsData, currentBrandSegment, activeCatId, null);

  const filteredProducts = useMemo(() => {
    if (canonicalSlug === "silver") return silverFilteredProducts;
    return standardFilteredProducts;
  }, [canonicalSlug, silverFilteredProducts, standardFilteredProducts]);
  
  const brandNameOfficial = useMemo(() => {
    if (canonicalSlug === "silver") return "Silver";
    return currentBrandSegment?.NombreSegmento || slug.replace(/-/g, ' ');
  }, [currentBrandSegment, slug, canonicalSlug]);

  // --- SCHEMA DINÁMICO ---
  const fullSchema = useMemo(() => {
    if (!currentBrandSegment && canonicalSlug !== "silver") return null;
    const baseUrl = `https://disdelsa.com/marca/${canonicalSlug}`;
    const activeCategory = displayCategories?.find(c => norm(c.IdCategoria) === norm(activeCatId));

    // Si hay SEO de base de datos, lo usamos, si no, aplicamos los fallbacks
    const activeSeo = dbSeo || {};
    const seoTitle = activeSeo.MetaTitle || activeSeo.metaTitle || (activeCategory 
        ? `${activeCategory.NombreCategoria} ${brandNameOfficial} Guatemala` 
        : `Distribuidor Autorizado ${brandNameOfficial} en Guatemala`);
    
    const seoDesc = activeSeo.MetaDescription || activeSeo.metaDescription || (activeCategory
        ? `Compra ${activeCategory.NombreCategoria} de ${brandNameOfficial} con distribución institucional.`
        : `Catálogo institucional de ${brandNameOfficial}. Suministros con garantía oficial.`);

    // 🚀 FIX SENIOR: Retornamos getCollectionSchema directo sin volver a envolverlo en otro array @graph
    return getCollectionSchema(seoTitle, seoDesc, baseUrl, filteredProducts);
  }, [currentBrandSegment, displayCategories, brandNameOfficial, filteredProducts, canonicalSlug, activeCatId, dbSeo]);

  // --- 6. EFECTOS DE NAVEGACIÓN Y FILTROS ---
  useEffect(() => {
    if (displayCategories.length > 0) {
      const preId = location.state?.preSelectedCatId;
      if (preId) {
        const exists = displayCategories.some(c => norm(c.IdCategoria) === norm(preId));
        setActiveCatId(exists ? preId : null);
      }
    }
  }, [displayCategories, location.state]);

  useEffect(() => {
    if (!subcat || displayCategories.length === 0) return;
    const foundCat = displayCategories.find(cat => createSlug(cat.NombreCategoria) === subcat);
    if (foundCat) {
      setActiveCatId(foundCat.IdCategoria);
    }
  }, [subcat, displayCategories]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  //SI NO EXISTE LA MARCA, RETORNA AL INICIO EVITANDO EL ERROR 404
  if (!loadingProducts && !currentBrandSegment && !loadingMenu && canonicalSlug !== "silver") {
    return <Navigate to="/" replace />; 
  }

  if (loadingMenu || loadingProducts) {
    return <CatalogSkeleton />; // 🚀 Reutilización de código limpia y eficiente
  }

  // if (!currentBrandSegment) {
  //   const activeBanner = isMobile && visualConfig.bannerMob ? visualConfig.bannerMob : visualConfig.banner;
  //   return (
  //     <div className="brand-container">
  //         <div className="brand-hero">
  //             {activeBanner ? (
  //               <img src={activeBanner} alt="Banner" className='banner-fade-in' />
  //             ) : (
  //               <div className="brand-hero-fallback" style={{ background: visualConfig.color }}>
  //                 <h1>{slug.replace(/-/g, ' ')}</h1>
  //               </div>
  //             )}
  //         </div>
  //         {/* <div style={{textAlign:'center', padding:'80px 20px'}}>
  //             <h2 style={{color: '#135eab', textTransform: 'capitalize'}}>Estamos actualizando el catálogo de {slug.replace(/-/g, ' ')}</h2>
  //             <Link to="/" style={{color: '#135eab', textDecoration: 'underline'}}>Volver al inicio</Link>
  //         </div> */}
  //     </div>
  //   );
  // }
 
  return (
    <div className="brand-container" style={{ '--brand-color': visualConfig.color }}>

      <Helmet>
      {/* 1. SEO DE BÚSQUEDA - AUTORIDAD DE DISTRIBUIDOR */}
      {/* El título ahora incluye "Distribuidor Autorizado" y "Suministros", palabras clave para jefes de compras */}
      <title>{`Distribuidor Autorizado ${brandNameOfficial} en Guatemala | Suministros Disdel`}</title>
      
      <meta name="description" content={`Adquiere suministros originales ${brandNameOfficial} al por mayor. Distribución institucional con asesoría técnica y entrega rápida en Guatemala. Calidad garantizada para su empresa.`} />
      <link rel="canonical" href={`https://disdelsa.com/marca/${canonicalSlug}`} />

      <meta property="og:title" content={`Catálogo Mayorista ${brandNameOfficial} - Distribución Disdel`} />
      <meta property="og:description" content={`Adquiere productos originales ${brandNameOfficial} con respaldo institucional. Soluciones integrales para hoteles, hospitales y oficinas en Guatemala.`} />
      <meta property="og:image" content={visualConfig.banner || defaultImage} />
      <meta property="og:url" content={`https://disdelsa.com/marca/${canonicalSlug}`} />

      <meta property="og:type" content="website" />

      <meta property="og:site_name" content="Disdel" />

      {/* 4. TWITTER CARD */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${brandNameOfficial} Guatemala - Suministros Industriales`} />
      <meta name="twitter:description" content={`Cotiza por volumen productos ${brandNameOfficial}. Entrega rápida y garantía de fábrica en toda la república.`} />
      <meta name="twitter:image" content={visualConfig.banner ? visualConfig.banner : defaultImage} />

      <script type="application/ld+json">{JSON.stringify(fullSchema)}</script>
    </Helmet>

      <section className="brand-hero">
        <img 
            src={(isMobile && visualConfig.bannerMob) ? visualConfig.bannerMob : (visualConfig.banner || defaultImage)} 
            alt={brandNameOfficial} 
            className='banner-fade-in' 
            fetchpriority="high" 
            loading="eager"
            width="1330" 
            height="250"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="brand-header-overlay-pdp">
            <h1 className="brand-segment-title">
              {brandNameOfficial} en Guatemala
            </h1>
        </div>
      </section>

      <div className="brand-layout">
        <aside className="sidebar-filters">
          <div className="cat-sidebar-header-mobile">
            <span className="sidebar-label-grey">CATEGORÍAS</span>
            <div className="cat-nav-arrows">
                <button onClick={() => handleScroll('left')} className="scroll-arrow"><FiChevronLeft /></button>
                <button onClick={() => handleScroll('right')} className="scroll-arrow"><FiChevronRight /></button>
            </div>
          </div>
          
          <nav className="categories-stack" ref={scrollRef}>
            <Link 
              to={`/marca/${canonicalSlug}`}
              className={`category-card-btn ${!activeCatId ? 'active-filter' : ''}`}
            >
              <div className="cat-img-box"><img src={iconoInicio} alt="Inicio" /></div>
              <span className="cat-text">Ver Todo</span>
            </Link>
          
            {displayCategories.map((cat) => (
                <Link
                  key={cat.IdCategoria}
                  to={`/marca/${canonicalSlug}/${createSlug(cat.NombreCategoria)}`}
                  className={`category-card-btn ${norm(activeCatId) === norm(cat.IdCategoria) ? 'active-filter' : ''}`}
                >
                  <div className="cat-img-box">
                    <img src={cat.Imagen ? `${AppConfig.baseImageUrl}${cat.Imagen}` : defaultImage} alt={cat.NombreCategoria} loading="lazy" />
                  </div>
                  <span className="cat-text">{cat.NombreCategoria}</span>
                </Link>
            ))}
          </nav>
        </aside>

        <main className="products-area">
          <div className="grid-container">
            {filteredProducts.map((prod, index) => (
              <ProductCard key={prod.IdProducto} product={prod} index={index} />
            ))}
          </div>
        </main>
      </div>

      {/* 🚀 NUEVA SECCIÓN DE CONTENIDO EXPERTO DE MARCA */}
      <section className="brand-expert-content" aria-label="Información adicional de marca">
        <div className="brand-expert-container">
          <hr className="pdp-divider" />
          <h2>{dbSeo?.H1 || dbSeo?.h1 || `Distribución y Venta de ${brandNameOfficial} en Guatemala`}</h2>
          <p className="brand-expert-text">
            {dbSeo?.SeoContent || dbSeo?.seoContent || `En Disdel somos distribuidores de productos ${brandNameOfficial} [2]. Abastecemos a oficinas, industrias, hospitales y el sector Horeca con un catálogo de alta resistencia y estándares técnicos [2]. Cotiza tu pedido por volumen y recibe de forma segura asesoría técnica personalizada con cobertura de entrega en toda la república de Guatemala [2].`}
          </p>
          <div className="brand-benefits-grid">
            <div className="benefit-item">✅ Suministros 100% Originales</div>
            <div className="benefit-item">✅ Asesoría y Cotización Técnica B2B [2]</div>
            <div className="benefit-item">✅ Stock Garantizado por Volumen</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandPage;