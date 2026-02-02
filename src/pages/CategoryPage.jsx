import { useLocation } from 'react-router-dom'; // <--- 1. Agrega este import arriba
import React, { useState, useMemo, useEffect } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import './CategoryPage.css';

import { AppConfig } from 'config/AppConfig';
import useCartStore from 'store/useCartStore';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';

import iconInicio from 'assets/icons/icon-inicio-removebg-preview.png';
import bannerFijo from 'assets/images/banners/BANCategoria.jpg'; 
import defaultImage from 'assets/images/categories/KCP.jpg'; 

const CategoryPage = () => {
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const location = useLocation(); // <--- 2. Obtén location
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  const [activeCatId, setActiveCatId] = useState(null);
  const [activeSubCatId, setActiveSubCatId] = useState(null);

  // --- HELPERS ---
  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();

  const createSlug = (text) => text?.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n').replace(/\s+/g, '-') || '';

  // 1. DATA PROCESSING
  const currentSegment = useMemo(() => {
      if (!menuData) return null;
      return menuData.find(seg => createSlug(seg.NombreSegmento) === slug);
  }, [menuData, slug]);

  const activeCategoryData = useMemo(() => {
      if (!currentSegment || !activeCatId) return null;
      return currentSegment.Categorias?.find(cat => norm(cat.IdCategoria) === norm(activeCatId));
  }, [currentSegment, activeCatId]);

  // 2. INICIALIZACIÓN (Auto-selección)
useEffect(() => {
    if (currentSegment && currentSegment.Categorias?.length > 0) {
        
        // A. Verificamos si viene un ID "pre-seleccionado" desde PromoLayout
        const preSelectedId = location.state?.preSelectedCatId;
        
        if (preSelectedId) {
            // ¡Bingo! Usamos el ID específico (ej: 2266)
            setActiveCatId(preSelectedId);
            // Limpiamos el state para que al recargar no se quede pegado (opcional)
            window.history.replaceState({}, document.title);
        } else {
            // B. Si no, usamos el comportamiento normal (la primera categoría)
            const firstCat = currentSegment.Categorias[0];
            setActiveCatId(firstCat.IdCategoria);
        }

        // Reseteamos subcategoría siempre al cambiar de segmento mayor
        setActiveSubCatId(null);
    }
}, [currentSegment, location.state]); // Agregamos location.state a dependencias

  // 3. HANDLER MANUAL
  const handleCategoryClick = (cat) => {
      setActiveCatId(cat.IdCategoria);
      if (cat.SubCategorias?.length > 0) {
          setActiveSubCatId(cat.SubCategorias[0].IdSubCategoria);
      } else {
          setActiveSubCatId(null);
      }
  };

  // 4. FILTRADO
  const filteredProducts = useMemo(() => {
      if (!productsData || !currentSegment) return [];

      const filtered = productsData.filter(prod => {
          const pSeg = norm(prod.IdSegmento);
          const pCat = norm(prod.IdCategoria);
          const pSub = norm(prod.IdSubCategoria);

          const tSeg = norm(currentSegment.IdSegmento);
          const tCat = activeCatId ? norm(activeCatId) : null;
          const tSub = activeSubCatId ? norm(activeSubCatId) : null;

          if (pSeg !== tSeg) return false;
          if (tCat && pCat !== tCat) return false;
          if (tSub && pSub !== tSub) return false;

          return true;
      });

      // Eliminar duplicados
      const uniqueProducts = [];
      const seenIds = new Set();
      filtered.forEach(prod => {
          if (!seenIds.has(prod.IdProducto)) {
              seenIds.add(prod.IdProducto);
              uniqueProducts.push(prod);
          }
      });
      return uniqueProducts;

  }, [productsData, currentSegment, activeCatId, activeSubCatId]);

  const themeColor = "#135eab";

  // 🔥 SKELETON LOADING (PANTALLA DE CARGA PROFESIONAL)
  if (loadingMenu || loadingProducts) {
      return (
        <div className="cat-master-wrapper">
            <div className="cat-container">
                <div className="skeleton-banner"></div>
                <div className="skeleton-layout">
                    <div className="skeleton-sidebar"></div>
                    <div className="skeleton-grid">
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="skeleton-card">
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
  
  if (!currentSegment) return <div className="no-products-msg">Categoría no encontrada</div>;

  return (
    <div className="cat-master-wrapper" style={{ '--cat-color': themeColor }}>
      <div className="cat-container">
        
        {/* HEADER GRANDE (BANNER + TÍTULO) */}
        <div className="cat-header-section">
            <img src={bannerFijo} alt="Banner" className="cat-main-banner" />
            <div className="cat-header-overlay">
                <h1 className="cat-segment-title" style={{color:'white', border:'none', margin:0}}>{currentSegment.NombreSegmento}</h1>
            </div>
        </div>

        <div className="cat-content-layout">
          
          {/* SIDEBAR */}
          <aside className="cat-sidebar-left">
            <div className="cat-sidebar-label">CATEGORÍAS</div>
            <div className="cat-sidebar-nav">
              {currentSegment.Categorias?.map((cat) => (
                <div 
                  key={cat.IdCategoria} 
                  className={`cat-nav-item ${norm(activeCatId) === norm(cat.IdCategoria) ? 'active-filter' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className="cat-nav-icon">
                    <img src={cat.Imagen ? `${AppConfig.baseImageUrl}${cat.Imagen}` : defaultImage} alt={cat.NombreCategoria} />
                  </div>
                  <span>{cat.NombreCategoria}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN */}
          <main className="cat-right-column">
            
            {/* PILLS SUBCATEGORÍAS */}
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

            {/* GRILLA PRODUCTOS (Con Key para resetear) */}
            <div className="cat-grid-products" key={`${activeCatId}-${activeSubSubCatId => activeSubCatId}`}> 
              {filteredProducts.map((prod) => (
                  <div key={prod.IdProducto} className="cat-product-card">
                    
                    <div className="cat-id-badge">ID: {prod.IdProducto}</div>
                    
                    <Link to={`/producto/${prod.IdProducto}`} style={{textDecoration:'none', color:'inherit', flexGrow:1, display:'flex', flexDirection:'column'}}>
                      <div className="cat-img-wrapper">
                        <img 
                            src={prod.Imagen ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}` : defaultImage} 
                            alt={prod.Descripcion} 
                            loading="lazy"
                        />
                      </div>
                      <span className="cat-card-tag">{prod.Categoria}</span>
                      <h3 className="cat-title">{prod.Descripcion}</h3>
                    </Link>

                    <button className="cat-btn" onClick={() => addItem(prod)}>
                        Cotizar
                    </button>
                  </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="no-products-msg">
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otra categoría.</p>
                </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;