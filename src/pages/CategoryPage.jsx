import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { Helmet } from 'react-helmet-async';
import './CategoryPage.css';
import ProductCard from 'components/ui/ProductCard/ProductCard';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import useCartStore from 'store/useCartStore';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';
import { createSlug } from 'utils/slugify';

import Skeleton from 'components/ui/Skeleton/Skeleton';
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';
import { getCollectionSchema, getBreadcrumbs } from 'utils/schemas/mainSchemas';

const CategoryPage = () => {
  const { slug, cat, subcat } = useParams();
  const navigate = useNavigate();

  const { data: bannerData } = useBanners();
  // const addItem = useCartStore((state) => state.addItem);
  const location = useLocation(); 
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  const [activeCatId, setActiveCatId] = useState(null);
  const [activeSubCatId, setActiveSubCatId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 468);

  const scrollRef = useRef(null);

   useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 468);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔥 SCROLL TOP CORRECTO
  useEffect(() => {
  window.scrollTo(0, 0); // 🚀 Más rápido para bots que 'smooth'
  }, [slug, cat, subcat]);

  const cleanSlug = slug ? slug.replace(/\/$/, "").trim() : '';
  const canonicalSlug = cleanSlug.toLowerCase();
  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();

  const currentSegment = useMemo(() => {
      if (!menuData) return null;
      return menuData.find(seg => createSlug(seg.NombreSegmento) === cleanSlug) || null;
  }, [menuData, cleanSlug, createSlug]);

  const activeCategoryData = useMemo(() => {
      if (!currentSegment || !activeCatId) return null;
      return currentSegment.Categorias?.find(cat => norm(cat.IdCategoria) === norm(activeCatId));
  }, [currentSegment, activeCatId]);

  const filteredProducts = useMemo(() => {
      if (!productsData || !currentSegment) return [];
      const filtered = productsData.filter(prod => {
          if (norm(prod.IdSegmento) !== norm(currentSegment.IdSegmento)) return false;
          if (activeCatId && norm(prod.IdCategoria) !== norm(activeCatId)) return false;
          if (activeSubCatId && norm(prod.IdSubCategoria) !== norm(activeSubCatId)) return false;
          return true;
      });
      const seenIds = new Set();
      return filtered.filter(prod => {
          const duplicate = seenIds.has(prod.IdProducto);
          seenIds.add(prod.IdProducto);
          return !duplicate;
      });
  }, [productsData, currentSegment, activeCatId, activeSubCatId]);

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    return found?.BannerImagenMovil || found?.Imagen 
      ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil || found.Imagen}` 
      : '';
  }, [bannerData]);

  const catBanner = useMemo(() => {
    const bannerObj = bannerData?.sliderPrincipal?.[1]; 
    return {
      desktop: bannerObj?.Imagen ? `${AppConfig.baseImageUrl}${bannerObj.Imagen}` : '',
      mobile: bannerObj?.BannerImagenMovil ? `${AppConfig.baseImageUrl}${bannerObj.BannerImagenMovil}` : ''
    };
  }, [bannerData]);

  const seoData = useMemo(() => {
  const segmentName = currentSegment?.NombreSegmento || "Categoría";
  const categoryName = activeCategoryData?.NombreCategoria;
  const subCategoryName = activeCategoryData?.SubCategorias?.find(
    s => norm(s.IdSubCategoria) === norm(activeSubCatId)
  )?.NombreSubCategoria;

  let dynamicTitle = categoryName || segmentName;
  if (categoryName && cat) dynamicTitle = `${categoryName} | ${segmentName}`;
  if (subCategoryName && subcat) dynamicTitle = `${subCategoryName} | ${categoryName}`;

  return {
    // Título Híbrido: Genérico + Profesional + Marca
    title: `${dynamicTitle} Profesional en Guatemala | Mayoreo y Unidad | Disdel`,
    description: `Distribución líder de ${dynamicTitle} institucional en Guatemala. Soluciones de alta concentración para empresas, hospitales y hogares. Cotización inmediata y envíos a todo el país.`,
    url: `https://disdelsa.com/categoria/${slug}${cat ? '/' + cat : ''}${subcat ? '/' + subcat : ''}`,
    image: catBanner.desktop || defaultImage
  };
}, [currentSegment, activeCategoryData, slug, cat, subcat, catBanner, defaultImage]);

  const fullSchema = useMemo(() => {
    if (!currentSegment) return null;
    const schemaUrl = `https://disdelsa.com/categoria/${slug}${cat ? '/' + cat : ''}`;
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            getCollectionSchema(seoData.title, seoData.description, schemaUrl, filteredProducts),
            getBreadcrumbs([
                { name: "Inicio", item: "https://disdelsa.com/" },
                { name: currentSegment.NombreSegmento, item: `https://disdelsa.com/categoria/${slug}` },
                ...(cat ? [{ name: activeCategoryData?.NombreCategoria || cat, item: `https://disdelsa.com/categoria/${slug}/${cat}` }] : [])
            ])
        ]
    };
  }, [currentSegment, filteredProducts, seoData, slug, cat, activeCategoryData]);  

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
    return (
      <div className="cat-master-wrapper">
        <div className="cat-container">
          <Skeleton width="100%" height={isMobile ? "150px" : "300px"} style={{ marginBottom: '20px' }} />
          <div className="cat-content-layout">
             <aside className="cat-sidebar-left"><Skeleton width="100%" height="400px" /></aside>
             <main className="cat-right-column">
                <div className="cat-grid-products">
                  {[1, 2, 3, 4, 5, 6].map(n => <ProductCardSkeleton key={n} />)}
                </div>
             </main>
          </div>
        </div>
      </div>
    );
  }

  if (!currentSegment) return <div className="no-products-msg">Categoría no encontrada</div>;

  return (
    <div className="cat-master-wrapper">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
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
            {!isMobile && (
              <div className="cat-header-overlay">
                  <h1 className="cat-segment-title">{currentSegment.NombreSegmento}</h1>
              </div>
            )}
        </div>

        <div className="cat-content-layout">
           <aside className="cat-sidebar-left">
            <div className="cat-sidebar-header-mobile">
                <div className="cat-sidebar-label">CATEGORÍAS</div>
            </div>
             <div className="cat-sidebar-nav" ref={scrollRef}>
              {currentSegment.Categorias?.map((catItem) => (
                <Link
                  key={catItem.IdCategoria}
                  to={`/categoria/${canonicalSlug}/${createSlug(catItem.NombreCategoria)}`}
                  className={`cat-nav-item ${norm(activeCatId) === norm(catItem.IdCategoria) ? 'active-filter' : ''}`}
                >
                  <div className="cat-nav-icon">
                    <img src={catItem.Imagen ? `${AppConfig.baseImageUrl}${catItem.Imagen}` : defaultImage} alt={catItem.NombreCategoria} width="24" height="24" loading="lazy" />
                 </div>
                  <span>{catItem.NombreCategoria}</span>
                </Link>
              ))}
            </div>
          </aside>

          <main className="cat-right-column">
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
          </main>
        </div>
      </div>

      <section className="cat-expert-content">
        <div className="cat-container">
          <hr className="pdp-divider" />
          <h2>Guía de Selección Profesional: {activeCategoryData?.NombreCategoria || currentSegment?.NombreSegmento}</h2>
          <p>
            En <strong>Disdel</strong>, entendemos que el abastecimiento de {activeCategoryData?.NombreCategoria || currentSegment?.NombreSegmento} requiere estándares de calidad institucional. 
            Ya sea que necesite suministros por <strong>unidad</strong> para su oficina o por <strong>mayoreo</strong> para mantenimiento industrial, 
            nuestro catálogo ofrece rendimiento garantizado en toda Guatemala.
          </p>
          <div className="cat-benefits-grid">
            <div className="benefit-item">✅ Grado Institucional</div>
            <div className="benefit-item">✅ Asesoría Técnica</div>
            <div className="benefit-item">✅ Entrega en 24-48 horas</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;