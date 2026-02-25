import { useLocation, Link, useParams } from 'react-router-dom';
import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { Helmet } from 'react-helmet-async';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; 
import './CategoryPage.css';

import { AppConfig } from 'config/AppConfig';
import useCartStore from 'store/useCartStore';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';

import bannerFijo from 'assets/images/banners/BANCategoria.jpg'; 
import bannerMob from 'assets/images/banners/Adaptacion--banner-Disdel.png';
import defaultImage from 'assets/images/categories/KCP.jpg'; 

const CategoryPage = () => {
  const { slug } = useParams();

  const cleanSlug = slug ? slug.replace(/\/$/, "").trim() : '';
  const canonicalSlug = cleanSlug.toLowerCase();

  const addItem = useCartStore((state) => state.addItem);
  const location = useLocation(); 
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  const [activeCatId, setActiveCatId] = useState(null);
  const [activeSubCatId, setActiveSubCatId] = useState(null);

  // Lógica para detectar móvil (Breakpoint 468px)
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

      const cleanSlug = slug.replace(/\/$/, "");
      return menuData.find(seg => createSlug(seg.NombreSegmento) === cleanSlug);
  }, [menuData, cleanSlug]);

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

  // --- SCHEMA AVANZADO ---
  const categorySchema = useMemo(() => {
    if (!currentSegment) return null;
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.disdelsa.com/" },
                    { "@type": "ListItem", "position": 2, "name": currentSegment.NombreSegmento, "item": `https://www.disdelsa.com/categoria/${canonicalSlug}` }
                ]
            },
            {
                "@type": "ItemList",
                "name": `Productos de ${currentSegment.NombreSegmento}`,
                "numberOfItems": filteredProducts.length,
                "itemListElement": filteredProducts.slice(0, 15).map((prod, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `https://www.disdelsa.com/producto/${prod.IdProducto}`
                }))
            }
        ]
    };
  }, [filteredProducts, currentSegment, canonicalSlug]);


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

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loadingMenu || loadingProducts) {
    return (
      <div className="cat-master-wrapper">
        <Helmet>
           <title>Cargando productos... | Disdel</title>
        </Helmet>

        <div className="cat-container">
          <div className="skeleton-shimmer" style={{width: '100%', height: isMobile ? '140px' : '200px', borderRadius: '16px', marginBottom: '20px'}}></div>
          <div className="cat-content-layout">
            <aside className="cat-sidebar-left">
               <div className="skeleton-shimmer" style={{width: '100%', height: '300px'}}></div>
            </aside>
            <main className="cat-right-column">
               <div className="cat-grid-products">
                  {[1,2,3,4].map(n => (
                    <div key={n} className="skeleton-card">
                      <div className="skeleton-shimmer" style={{height: '130px'}}></div>
                      <div className="skeleton-shimmer" style={{height: '18px', width: '90%'}}></div>
                      <div className="skeleton-shimmer" style={{height: '40px', marginTop: 'auto'}}></div>
                    </div>
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
    <div className="cat-master-wrapper" style={{ '--cat-color': "#135eab" }}>
      <Helmet>
        <title>{`${currentSegment.NombreSegmento} | Disdel Guatemala`}</title>
        <meta name="description" content={`Encuentra los mejores productos de ${currentSegment.NombreSegmento} en Disdel S.A. Suministros de limpieza profesional en Guatemala.`} />
        <link rel="canonical" href={`https://www.disdelsa.com/categoria/${canonicalSlug}`} />
        {/* CORREGIDO: Usamos categorySchema, no itemListSchema */}
        <script type="application/ld+json">{JSON.stringify(categorySchema)}</script>
      </Helmet>
      
      <div className="cat-container">
        {/* SECCIÓN DEL BANNER DINÁMICO */}
        <div className="cat-header-section">
            <img 
              src={isMobile ? bannerMob : bannerFijo} 
              alt="Banner Principal Disdel" 
              className="cat-main-banner" 
            />
            
            {!isMobile && (
              <div className="cat-header-overlay">
                  <h1 className="cat-segment-title" style={{color:'white'}}>
                    {currentSegment.NombreSegmento}
                  </h1>
              </div>
            )}
        </div>

        <div className="cat-content-layout">
          <aside className="cat-sidebar-left">
            <div className="cat-sidebar-header-mobile">
                <div className="cat-sidebar-label">SUBCATEGORÍAS</div>
                <div className="cat-nav-arrows">
                  <button onClick={() => handleScroll('left')} className="scroll-arrow"><FiChevronLeft /></button>
                  <button onClick={() => handleScroll('right')} className="scroll-arrow"><FiChevronRight /></button>
                </div>
            </div>

            <div className="cat-sidebar-nav" ref={scrollRef}>
              {currentSegment.Categorias?.map((cat) => (
                <div key={cat.IdCategoria} className={`cat-nav-item ${norm(activeCatId) === norm(cat.IdCategoria) ? 'active-filter' : ''}`} onClick={() => handleCategoryClick(cat)}>
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
                        <button key={sub.IdSubCategoria} className={`cat-sub-pill ${norm(activeSubCatId) === norm(sub.IdSubCategoria) ? 'active' : ''}`} onClick={() => setActiveSubCatId(sub.IdSubCategoria)}>
                            {sub.NombreSubCategoria}
                        </button>
                    ))}
                </div>
            )}

            <div className="cat-grid-products"> 
              {filteredProducts.map((prod, index) => (
                  <div key={prod.IdProducto} className="cat-product-card">
                    <div className="cat-id-badge">ID: {prod.IdProducto}</div>
                    <Link to={`/producto/${prod.IdProducto}`} style={{textDecoration:'none', color:'inherit'}}>
                      <div className="cat-img-wrapper">
                        <img src={prod.Imagen ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}` : defaultImage} 
                        alt={prod.Descripcion} 
                        // 🔥 TRUCOS MÓVIL AQUÍ:
                        loading={index < 4 ? "eager" : "lazy"} 
                        fetchpriority={index < 4 ? "high" : "auto"}
                        width="200"
                        height="200"
                        />
                      </div>
                      <span className="cat-card-tag">{prod.Categoria}</span>
                      <h3 className="cat-title">{prod.Descripcion}</h3>
                    </Link>
                    <button className="cat-btn" onClick={() => {
                        addItem({
                            ...prod,
                            presentationSelected: prod.Unidad || prod.Empaque,
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
    </div>
  );
};

export default CategoryPage;