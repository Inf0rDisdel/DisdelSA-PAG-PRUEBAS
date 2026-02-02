import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import './BrandPage.css';

import { AppConfig } from 'config/AppConfig';
import useCartStore from 'store/useCartStore';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';

// Banners Fijos
import bannerKimberly from 'assets/images/banners/BANNER-KCP.png'; 
import bannerSilver from 'assets/images/banners/banners_silver-2.jpg';
import banner3m from 'assets/images/banners/BANNERS-3M.png';
import bannerWiese from 'assets/images/banners/BANNERS-WIESE.jpg';

import defaultImage from 'assets/images/categories/KCP.jpg'; 
import iconInicio from 'assets/icons/icon-inicio-removebg-preview.png';

const brandConfig = {
  "kimberly-clark-professional": { banner: bannerKimberly, color: "#00558C" },
  "wiese": { banner: bannerWiese, color: "#692C90" },
  "3m": { banner: banner3m, color: "#EE2737" },
  "silver": { banner: bannerSilver, color: "#76BD1D" }
};

const BrandPage = () => {
  const { slug } = useParams();
  const location = useLocation(); // 2. Inicializamos location
  const addItem = useCartStore((state) => state.addItem);

  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  const [activeCatId, setActiveCatId] = useState(null);

  // --- HELPER NORMALIZADOR (IGUAL QUE EN CATEGORY PAGE) ---
  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();

  const createSlug = (text) => text?.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n').replace(/\s+/g, '-') || '';

  // 1. ENCONTRAR MARCA (SEGMENTO)
  const currentBrandSegment = useMemo(() => {
      if (!menuData) return null;
      return menuData.find(seg => createSlug(seg.NombreSegmento).includes(slug) || slug.includes(createSlug(seg.NombreSegmento)));
  }, [menuData, slug]);

  const visualConfig = brandConfig[slug] || { banner: null, color: "#004aad" };

  // Reset filtro al cambiar de marca
    useEffect(() => {
      if (currentBrandSegment && currentBrandSegment.Categorias?.length > 0) {
          const preId = location.state?.preSelectedCatId;

          if (preId) {
              // Validamos que la categoría pertenezca a esta marca
              const exists = currentBrandSegment.Categorias.some(c => String(c.IdCategoria) === String(preId));
              if (exists) {
                  setActiveCatId(preId);
              } else {
                  setActiveCatId(null);
              }
          } else {
              // Si no hay state, resetear a "Ver Todo"
              setActiveCatId(null);
          }
      }
  }, [currentBrandSegment, location.state, slug]); // Se dispara al cambiar marca o recibir nuevo state

  // --- 2. FILTRADO MAESTRO (BLINDADO) ---
  const filteredProducts = useMemo(() => {
      if (!productsData || !currentBrandSegment) return [];

      // A. FILTRO
      const filtered = productsData.filter(prod => {
          const pSeg = norm(prod.IdSegmento);
          const pCat = norm(prod.IdCategoria);
          
          const mSeg = norm(currentBrandSegment.IdSegmento);
          const mCat = activeCatId ? norm(activeCatId) : null;

          // Regla 1: Debe ser de esta Marca
          if (pSeg !== mSeg) return false;

          // Regla 2: Si hay categoría, debe coincidir
          if (mCat && pCat !== mCat) return false;

          return true;
      });

      // B. ANTI-DUPLICADOS
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

  // --- SKELETON LOADING (PANTALLA DE CARGA PROFESIONAL) ---
  if (loadingMenu || loadingProducts) {
      return (
        <div className="brand-container">
            <div className="sk-banner"></div>
            <div className="brand-layout">
                <div className="sk-sidebar"></div>
                <div className="products-area">
                    <div className="grid-container">
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="sk-card">
                                <div className="sk-img"></div>
                                <div className="sk-line"></div>
                                <div className="sk-line" style={{width:'50%'}}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      );
  }
  
  if (!currentBrandSegment) return (
    <div className="brand-container">
        <div className="brand-hero">
            {visualConfig.banner && <img src={visualConfig.banner} alt="Banner" />}
        </div>
        <div style={{textAlign:'center', padding:'50px'}}>
            <h2>Estamos actualizando el catálogo de {slug}</h2>
        </div>
    </div>
  );

  return (
    <div className="brand-container" style={{ '--brand-color': visualConfig.color }}>
      
      {/* BANNER */}
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
        
        {/* SIDEBAR: CATEGORÍAS */}
        <aside className="sidebar-filters">
          <span className="sidebar-title">Categorías {currentBrandSegment.NombreSegmento}</span>
          
          <div className="categories-stack">
            
            {/* Botón Ver Todo */}
            <div 
              className={`category-card-btn ${!activeCatId ? 'active-filter' : ''}`}
              onClick={() => setActiveCatId(null)}
            >
              <div className="cat-img-box">
                <img src={iconInicio} alt="Inicio" />
              </div>
              <span className="cat-text">Ver Todo</span>
            </div>
          
            {/* Lista Dinámica */}
            {currentBrandSegment.Categorias?.map((cat) => (
                <div 
                  key={cat.IdCategoria} 
                  className={`category-card-btn ${norm(activeCatId) === norm(cat.IdCategoria) ? 'active-filter' : ''}`}
                  onClick={() => setActiveCatId(cat.IdCategoria)}
                >
                  <div className="cat-img-box">
                    <img 
                        src={cat.Imagen ? `${AppConfig.baseImageUrl}${cat.Imagen}` : defaultImage} 
                        alt={cat.NombreCategoria} 
                    />
                  </div>
                  <span className="cat-text">{cat.NombreCategoria}</span>
                </div>
            ))}
          </div>
        </aside>

        {/* PRODUCTOS */}
        <main className="products-area">
          <div className="grid-container">
            {filteredProducts.map((prod) => (
                <div className="product-card" key={prod.IdProducto}>
                  
                  <div style={{position:'absolute', top:10, right:10, fontSize:10, color:'#aaa'}}>ID: {prod.IdProducto}</div>

                  <Link to={`/producto/${prod.IdProducto}`} style={{textDecoration:'none', color:'inherit', flexGrow:1, display:'flex', flexDirection:'column'}}>
                      <div className="prod-img-container">
                        <img 
                            src={prod.Imagen ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}` : defaultImage} 
                            alt={prod.Descripcion} 
                            loading="lazy"
                        />
                      </div>
                      <div className="prod-category">{prod.Categoria}</div>
                      <div className="prod-title">{prod.Descripcion}</div>
                  </Link>
                  
                  <button className="btn-details" onClick={() => addItem(prod)}>Cotizar</button>
                </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-products-message">
              <h3>No hay productos disponibles en esta categoría.</h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrandPage;