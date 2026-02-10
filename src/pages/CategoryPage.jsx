import { useLocation, Link, useParams } from 'react-router-dom';
import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { Helmet } from 'react-helmet-async';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; 
import { toast } from 'react-hot-toast'; // Notificación añadida
import './CategoryPage.css';

import { AppConfig } from 'config/AppConfig';
import useCartStore from 'store/useCartStore';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';

import bannerFijo from 'assets/images/banners/BANCategoria.jpg'; 
import defaultImage from 'assets/images/categories/KCP.jpg'; 

const CategoryPage = () => {
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const location = useLocation(); 
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  const [activeCatId, setActiveCatId] = useState(null);
  const [activeSubCatId, setActiveSubCatId] = useState(null);

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

  const currentSegment = useMemo(() => {
      if (!menuData) return null;
      return menuData.find(seg => createSlug(seg.NombreSegmento) === slug);
  }, [menuData, slug]);

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

  const itemListSchema = useMemo(() => {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "numberOfItems": filteredProducts.length,
        "itemListElement": filteredProducts.slice(0, 15).map((prod, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://www.disdelsa.com/producto/${prod.IdProducto}`
        }))
    };
  }, [filteredProducts]);

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

  if (loadingMenu || loadingProducts) return <div className="pdp-loading"><div className="spinner"></div></div>;
  if (!currentSegment) return <div className="no-products-msg">Categoría no encontrada</div>;

  return (
    <div className="cat-master-wrapper" style={{ '--cat-color': "#135eab" }}>
      <Helmet>
        <title>{`${currentSegment.NombreSegmento} | Disdel`}</title>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>
      
      <div className="cat-container">
        <div className="cat-header-section">
            <img src={bannerFijo} alt="Banner" className="cat-main-banner" />
            <div className="cat-header-overlay">
                <h1 className="cat-segment-title" style={{color:'white'}}>{currentSegment.NombreSegmento}</h1>
            </div>
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
              {filteredProducts.map((prod) => (
                  <div key={prod.IdProducto} className="cat-product-card">
                    <div className="cat-id-badge">ID: {prod.IdProducto}</div>
                    <Link to={`/producto/${prod.IdProducto}`} style={{textDecoration:'none', color:'inherit'}}>
                      <div className="cat-img-wrapper">
                        <img src={prod.Imagen ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}` : defaultImage} alt={prod.Descripcion} loading="lazy" />
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