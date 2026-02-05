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

const brandConfig = {
  "kimberly-clark-professional": { banner: bannerKimberly, color: "#135eab" },
  "wiese": { banner: bannerWiese, color: "#692C90" },
  "3m": { banner: banner3m, color: "#EE2737" },
  "silver": { banner: bannerSilver, color: "#76BD1D" }
};

const BrandPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const addItem = useCartStore((state) => state.addItem);
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();
  const [activeCatId, setActiveCatId] = useState(null);

  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();
  const createSlug = (text) => text?.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n').replace(/\s+/g, '-') || '';

  const currentBrandSegment = useMemo(() => {
    if (!menuData) return null;
    return menuData.find(seg => createSlug(seg.NombreSegmento).includes(slug) || slug.includes(createSlug(seg.NombreSegmento)));
  }, [menuData, slug]);

  const visualConfig = brandConfig[slug] || { banner: null, color: "#135eab" };

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

  if (loadingMenu || loadingProducts) return <div className="pdp-loading"><div className="spinner"></div></div>;

  if (!currentBrandSegment) return (
    <div className="brand-container">
        <div className="brand-hero">
            {visualConfig.banner && <img src={visualConfig.banner} alt="Banner" />}
        </div>
        <div style={{textAlign:'center', padding:'80px 20px'}}>
            <h2 style={{color: '#135eab'}}>Estamos actualizando el catálogo de {slug.replace(/-/g, ' ')}</h2>
            <Link to="/" style={{color: '#135eab', textDecoration: 'underline'}}>Volver al inicio</Link>
        </div>
    </div>
  );

  return (
    <div className="brand-container" style={{ '--brand-color': visualConfig.color }}>
      <div className="brand-hero">
        {visualConfig.banner ? (
          <img src={visualConfig.banner} alt={currentBrandSegment.NombreSegmento} />
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
                  <button className="btn-details-brand" onClick={() => addItem(prod)}>Cotizar</button>
                </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BrandPage;