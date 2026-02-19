import React, { useState, useEffect, useMemo, useRef } from 'react'; 
import { useParams, Link, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './BrandPage.css';

import { AppConfig } from 'config/AppConfig';
import useCartStore from 'store/useCartStore';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';

// Banners e iconos
import bannerKimberly from 'assets/images/banners/BANNER-KCP.png';
import bannerSilver from 'assets/images/banners/banners_silver-2.jpg';
import banner3m from 'assets/images/banners/BANNERS-3M.png';
import bannerWiese from 'assets/images/banners/BANNERS-WIESE.jpg';
import defaultImage from 'assets/images/categories/KCP.jpg';
import iconInicio from 'assets/icons/icon-inicio-removebg-preview.png';

import bannerKimberlyMob from 'assets/images/banners/Adaptacion-banner-KC.png'; 
import bannerSilverMob from 'assets/images/banners/banners_silver-movil.jpg'; 
import banner3mMob from 'assets/images/banners/Adaptacion--banner-3M.png'; 

const brandConfig = {
  "kimberly-clark-professional": { banner: bannerKimberly, bannerMob: bannerKimberlyMob, color: "#135eab" },
  "wiese": { banner: bannerWiese, color: "#692C90" },
  "3m": { banner: banner3m, bannerMob: banner3mMob, color: "#EE2737" },
  "silver": { banner: bannerSilver, bannerMob: bannerSilverMob, color: "#76BD1D" }
};

const BrandPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const addItem = useCartStore((state) => state.addItem);
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();
  const [activeCatId, setActiveCatId] = useState(null);
  const scrollRef = useRef(null);

  // 🔥 DETECCIÓN ÚNICAMENTE PARA 468px
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 468);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 468);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();
  const createSlug = (text) => text?.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n').replace(/\s+/g, '-') || '';

  const currentBrandSegment = useMemo(() => {
    if (!menuData) return null;
    return menuData.find(seg => createSlug(seg.NombreSegmento).includes(slug) || slug.includes(createSlug(seg.NombreSegmento)));
  }, [menuData, slug]);

  const visualConfig = brandConfig[slug] || { banner: null, bannerMob: null, color: "#135eab" };

  useEffect(() => {
    if (currentBrandSegment && currentBrandSegment.Categorias?.length > 0) {
      const preId = location.state?.preSelectedCatId;
      if (preId) {
        const exists = currentBrandSegment.Categorias.some(c => String(c.IdCategoria) === String(preId));
        setActiveCatId(exists ? preId : null);
      } else {
        setActiveCatId(null);
      }
    }
  }, [currentBrandSegment, location.state, slug]);

  const filteredProducts = useMemo(() => {
    if (!productsData || !currentBrandSegment) return [];
    const filtered = productsData.filter(prod => {
      if (norm(prod.IdSegmento) !== norm(currentBrandSegment.IdSegmento)) return false;
      if (activeCatId && norm(prod.IdCategoria) !== norm(activeCatId)) return false;
      return true;
    });
    const uniqueProducts = [];
    const seenIds = new Set();
    filtered.forEach(prod => {
      if (!seenIds.has(prod.IdProducto)) {
        seenIds.add(prod.IdProducto);
        uniqueProducts.push(prod);
      }
    });
    return uniqueProducts;
  }, [productsData, currentBrandSegment, activeCatId]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loadingMenu || loadingProducts) {
    return (
      <div className="brand-container">
        <div className="skeleton-shimmer" style={{width: '100%', height: isMobile ? '180px' : '280px', marginBottom: '30px'}}></div>
        <div className="brand-layout">
          <aside className="sidebar-filters">
             <div className="skeleton-shimmer" style={{width: '100%', height: '200px'}}></div>
          </aside>
          <main className="products-area">
             <div className="grid-container">
                {[1,2,3,4].map(n => (
                  <div key={n} className="skeleton-card">
                    <div className="skeleton-shimmer" style={{height: '150px'}}></div>
                    <div className="skeleton-shimmer" style={{height: '20px', width: '80%'}}></div>
                    <div className="skeleton-shimmer" style={{height: '40px', marginTop: 'auto'}}></div>
                  </div>
                ))}
             </div>
          </main>
        </div>
      </div>
    );
  }

  if (!currentBrandSegment) {
    const activeBanner = isMobile && visualConfig.bannerMob ? visualConfig.bannerMob : visualConfig.banner;
    return (
      <div className="brand-container">
          <div className="brand-hero">
              {activeBanner ? (
                <img src={activeBanner} alt="Banner" className='banner-fade-in' />
              ) : (
                <div className="brand-hero-fallback" style={{ background: visualConfig.color }}>
                  <h1>{slug.replace(/-/g, ' ')}</h1>
                </div>
              )}
          </div>
          <div style={{textAlign:'center', padding:'80px 20px'}}>
              <h2 style={{color: '#135eab', textTransform: 'capitalize'}}>Estamos actualizando el catálogo de {slug.replace(/-/g, ' ')}</h2>
              <Link to="/" style={{color: '#135eab', textDecoration: 'underline'}}>Volver al inicio</Link>
          </div>
      </div>
    );
  }
 
  return (
    <div className="brand-container" style={{ '--brand-color': visualConfig.color }}>
      <div className="brand-hero">
        {isMobile && visualConfig.bannerMob ? (
          <img src={visualConfig.bannerMob} alt={currentBrandSegment.NombreSegmento} className='banner-fade-in' />
        ) : visualConfig.banner ? (
          <img src={visualConfig.banner} alt={currentBrandSegment.NombreSegmento} className='banner-fade-in' />
        ) : (
           <div className="brand-hero-fallback" style={{ background: visualConfig.color }}>
            <h1>{currentBrandSegment.NombreSegmento}</h1>
          </div>
        )}
      </div>

      <div className="brand-layout">
        <aside className="sidebar-filters">
          <div className="cat-sidebar-header-mobile">
            <span className="sidebar-label-grey">CATEGORÍAS</span>
            <div className="cat-nav-arrows">
                <button onClick={() => handleScroll('left')} className="scroll-arrow"><FiChevronLeft /></button>
                <button onClick={() => handleScroll('right')} className="scroll-arrow"><FiChevronRight /></button>
            </div>
          </div>
          
          <div className="categories-stack" ref={scrollRef}>
            <div className={`category-card-btn ${!activeCatId ? 'active-filter' : ''}`} onClick={() => setActiveCatId(null)}>
              <div className="cat-img-box"><img src={iconInicio} alt="Inicio" /></div>
              <span className="cat-text">Ver Todo</span>
            </div>
          
            {currentBrandSegment.Categorias?.map((cat) => (
                <div key={cat.IdCategoria} className={`category-card-btn ${norm(activeCatId) === norm(cat.IdCategoria) ? 'active-filter' : ''}`} onClick={() => setActiveCatId(cat.IdCategoria)}>
                  <div className="cat-img-box">
                    <img src={cat.Imagen ? `${AppConfig.baseImageUrl}${cat.Imagen}` : defaultImage} alt={cat.NombreCategoria} />
                  </div>
                  <span className="cat-text">{cat.NombreCategoria}</span>
                </div>
            ))}
          </div>
        </aside>

        <main className="products-area">
          <div className="grid-container">
            {filteredProducts.map((prod) => (
                <div className="product-card" key={prod.IdProducto}>
                  <div className="cat-id-badge">ID: {prod.IdProducto}</div>
                  <Link to={`/producto/${prod.IdProducto}`} className="prod-link-wrapper">
                      <div className="prod-img-container">
                        <img src={prod.Imagen ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}` : defaultImage} alt={prod.Descripcion} loading="lazy" />
                      </div>
                      <div className="prod-category-label">{prod.Categoria}</div>
                      <div className="prod-title-text">{prod.Descripcion}</div>
                  </Link>
                  <button className="btn-details-brand" onClick={() => {
                      const defaultPresentation = prod.Unidad || prod.Empaque || 'Unidad';
                      addItem({
                          ...prod,
                          presentationSelected: defaultPresentation,
                          unitType: prod.Unidad ? 'Y' : 'N'
                      });
                  }}>
                    Cotizar
                  </button>
                </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BrandPage;