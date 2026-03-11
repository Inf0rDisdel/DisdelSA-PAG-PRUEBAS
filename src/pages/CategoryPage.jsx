import { useLocation, Link, useParams } from 'react-router-dom';
import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { Helmet } from 'react-helmet-async';
import {  FiShoppingCart } from 'react-icons/fi'; 
import './CategoryPage.css';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import useCartStore from 'store/useCartStore';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';

import Skeleton from 'components/ui/Skeleton/Skeleton';
import ProductCardSkeleton from 'components/ui/ProductCard/ProductCardSkeleton';

const CategoryPage = () => {
  const { slug } = useParams();
  const { data: bannerData } = useBanners();
  const addItem = useCartStore((state) => state.addItem);
  const location = useLocation(); 
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  const cleanSlug = slug ? slug.replace(/\/$/, "").trim() : '';
  const canonicalSlug = cleanSlug.toLowerCase();

  const [activeCatId, setActiveCatId] = useState(null);
  const [activeSubCatId, setActiveSubCatId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 468);

   useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 468);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollRef = useRef(null);

  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();
  const createSlug = (text) => text?.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n').replace(/\s+/g, '-') || '';

  const currentSegment = useMemo(() => {
      if (!menuData) return null;
      return menuData.find(seg => createSlug(seg.NombreSegmento) === cleanSlug) || null;
  }, [menuData, cleanSlug]);

  const badgeLogo = useMemo (() => {
      const found = bannerData?.Iconos?.find(b=> b.Titulo === "IconoDisdel");
      return found ? `${AppConfig.baseImageUrl}${found.Imagen}` : '';
    }, [bannerData]);

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
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault");
    return found?.BannerImagenMovil ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil}` : '';
  }, [bannerData]);

  const catBanner = useMemo(() => {
    const bannerObj = bannerData?.sliderPrincipal?.[1]; 
    return {
      desktop: bannerObj?.Imagen ? `${AppConfig.baseImageUrl}${bannerObj.Imagen}` : '',
      mobile: bannerObj?.BannerImagenMovil ? `${AppConfig.baseImageUrl}${bannerObj.BannerImagenMovil}` : ''
    };
  }, [bannerData]);

  const seoData = useMemo(() => {
    const name = currentSegment?.NombreSegmento || "Categoría";
    return {
      title: `${name} Mayorista en Guatemala | Suministros Disdel`,
      description: `Distribución institucional de ${name}. Suministros profesionales para empresas y sector Horeca en Guatemala.`,
      url: `https://disdelsa.com/categoria/${canonicalSlug}`,
      image: catBanner.desktop || defaultImage
    };
  }, [currentSegment, canonicalSlug, catBanner, defaultImage]);

  const fullSchema = useMemo(() => {
    if (!currentSegment) return null;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "@id": `${seoData.url}/#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://disdelsa.com/" },
            { "@type": "ListItem", "position": 2, "name": currentSegment.NombreSegmento, "item": seoData.url }
          ]
        },
        {
          "@type": "CollectionPage",
          "@id": `${seoData.url}/#collection`,
          "url": seoData.url,
          "name": seoData.title,
          "description": seoData.description,
          "publisher": {
            "@type": "Organization",
            "name": "Disdel, S.A.",
            "url": "https://disdelsa.com/"
          },
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": filteredProducts.length,
            "itemListElement": filteredProducts.slice(0, 40).map((prod, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `https://disdelsa.com/producto/${String(prod.IdProducto).toLowerCase()}`,
              "name": prod.Descripcion,
              "image": prod.Imagen ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}` : defaultImage
            }))
          }
        }
      ]
    };
  }, [currentSegment, filteredProducts, seoData, defaultImage]);

  useEffect(() => {
    if (currentSegment && currentSegment.Categorias?.length > 0) {
        const preSelectedId = location.state?.preSelectedCatId;
        if (preSelectedId) {
            setActiveCatId(preSelectedId);
            window.history.replaceState({}, document.title);
        } else {
            setActiveCatId(currentSegment.Categorias[0].IdCategoria);
        }
        setActiveSubCatId(null);
    }
  }, [currentSegment, location.state]);

  const handleCategoryClick = (cat) => {
    setActiveCatId(cat.IdCategoria);
    setActiveSubCatId(cat.SubCategorias?.length > 0 ? cat.SubCategorias[0].IdSubCategoria : null);
  };

   if (loadingMenu || loadingProducts) {
    return (
      <div className="cat-master-wrapper">
        <div className="cat-container">
          <Skeleton width="100%" height={isMobile ? "150px" : "300px"} style={{ marginBottom: '20px' }} />
          <div className="cat-content-layout">
             <aside className="cat-sidebar-left">
                <Skeleton width="100%" height="400px" />
             </aside>
             <main className="cat-right-column">
                <div className="cat-grid-products">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <ProductCardSkeleton key={n} />
                  ))}
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
            />
            {!isMobile && (
              <div className="cat-header-overlay">
                  <h1 className="cat-segment-title">
                    {currentSegment.NombreSegmento} 
                  </h1>
              </div>
            )}
        </div>

        <div className="cat-content-layout">
          <aside className="cat-sidebar-left">
            {/* Restaurado el label simple sin flechas */}
            <div className="cat-sidebar-header-mobile">
                <div className="cat-sidebar-label">CATEGORÍAS</div>
            </div>

             <div className="cat-sidebar-nav" ref={scrollRef}>
              {currentSegment.Categorias?.map((cat) => (
                <div 
                  key={cat.IdCategoria} 
                  className={`cat-nav-item ${norm(activeCatId) === norm(cat.IdCategoria) ? 'active-filter' : ''}`} 
                  onClick={() => handleCategoryClick(cat)}
                  role="button"
                  tabIndex="0"
                >
                  <div className="cat-nav-icon">
                    <img src={cat.Imagen ? `${AppConfig.baseImageUrl}${cat.Imagen}` : defaultImage} alt={cat.NombreCategoria} />
                  </div>
                  <span>{cat.NombreCategoria}</span>
                </div>
              ))}
            </div>
          </aside>

          <main className="cat-right-column">
            {activeCategoryData?.SubCategorias?.length > 0 && (
                <div className="cat-subcategories-bar">
                    {activeCategoryData.SubCategorias.map(sub => (
                        <button 
                          key={sub.IdSubCategoria} 
                          className={`cat-sub-pill ${norm(activeSubCatId) === norm(sub.IdSubCategoria) ? 'active' : ''}`} 
                          onClick={() => setActiveSubCatId(sub.IdSubCategoria)}
                        >
                            {sub.NombreSubCategoria}
                        </button>
                    ))}
                </div>
            )}

            <div className="cat-grid-products"> 
              {filteredProducts.map((prod, index) => (
                  <article key={prod.IdProducto} className="cat-product-card">
                    <div className="cat-brand-badge">
                      {badgeLogo && <img src={badgeLogo} alt="Disdel" className="cat-badge-logo-img" />}
                    </div>

                    <Link to={`/producto/${prod.IdProducto.toLowerCase()}`} className="cat-card-link" style={{ textDecoration: 'none' }}>
                      <div className="cat-img-wrapper">
                        <img 
                          src={prod.Imagen ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}` : defaultImage} 
                          alt={prod.Descripcion} 
                          loading={index < 6 ? "eager" : "lazy"} 
                          fetchpriority={index < 6 ? "high" : "auto"}
                          decoding="async"
                          width="200" height="200"
                        />
                      </div>
                      <span className="cat-card-tag">{prod.Categoria}</span>
                      <h2 className="cat-title">{prod.Descripcion}</h2>
                      {/* --- ID ABAJO DEL TÍTULO --- */}
                      <span className="cat-detail-id">Disdel # {prod.IdProducto}</span>
                    </Link>

                    <div className="cat-card-footer">
                        <button 
                          className="cat-quote-btn" 
                          onClick={() => addItem({...prod, presentationSelected: prod.Unidad || prod.Empaque, unitType: prod.Unidad ? 'Y' : 'N'})}
                        >
                            <FiShoppingCart className="cat-cart-icon" /> COTIZAR 
                        </button>
                    </div>
                  </article>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;