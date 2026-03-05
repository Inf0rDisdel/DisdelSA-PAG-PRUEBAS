import React, { useState, useEffect, useMemo, useRef } from 'react'; 
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './BrandPage.css';

import { AppConfig } from 'config/AppConfig';
import useCartStore from 'store/useCartStore';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';
import { useBanners } from 'hooks/useBanners';

const BrandPage = () => {
  const { slug } = useParams();
  const { data: bannerData } = useBanners();

  const cleanSlug = slug ? slug.replace(/\/$/, "").trim() : '';
  const canonicalSlug = cleanSlug.toLowerCase(); // Para SEO

  const location = useLocation();
  const addItem = useCartStore((state) => state.addItem);
  const { data: menuData, isLoading: loadingMenu } = useMenu();
  const { data: productsData, isLoading: loadingProducts } = useProducts();

  const [activeCatId, setActiveCatId] = useState(null);
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 468);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 468);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultImage = useMemo (() => {
    const imgDb = bannerData?.ImagenPredeterminado?.find(b => b.Titulo === "ImagenDefault");

    return imgDb ? `${AppConfig.baseImageUrl}${imgDb.Imagen}` : ''; 
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

    const currentConf = mapping[cleanSlug.toLowerCase()] || { color: "#135eab" };
    const apiBanner = currentConf.idGroup?.find(b => b.Titulo === currentConf.title);

    const desktopFile = apiBanner?.Imagen; 
    const mobileFile = apiBanner?.BannerImagenMovil || apiBanner?.ImagenMovil;

    return {
      color: currentConf.color,
      banner: desktopFile ? `${AppConfig.baseImageUrl}${desktopFile}` : null,
      bannerMob: mobileFile ? `${AppConfig.baseImageUrl}${mobileFile}` : null
    };
  }, [bannerData, cleanSlug]);

  const norm = (id) => (id === null || id === undefined) ? '' : String(id).trim();
  const createSlug = (text) => text?.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n').replace(/\s+/g, '-') || '';

  const currentBrandSegment = useMemo(() => {
    if (!menuData) return null;

    return menuData.find(seg => createSlug(seg.NombreSegmento).includes(cleanSlug) || cleanSlug.includes(createSlug(seg.NombreSegmento)));
  }, [menuData, cleanSlug]);
  
  const brandNameOfficial = visualConfig.name || currentBrandSegment?.NombreSegmento || slug;


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

  // --- SCHEMA DINÁMICO ---
  const brandSchema = useMemo(() => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.disdelsa.com/" },
          { "@type": "ListItem", "position": 2, "name": brandNameOfficial, "item": `https://www.disdelsa.com/marca/${canonicalSlug}` }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": `Distribuidor Autorizado ${brandNameOfficial} en Guatemala`,
        "description": `Línea completa de productos ${brandNameOfficial} para uso profesional e industrial. Suministros originales con garantía Disdel.`,
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": filteredProducts.slice(0, 30).map((prod, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": prod.Descripcion,
            "url": `https://www.disdelsa.com/producto/${String(prod.IdProducto).toLowerCase()}`
          }))
        }
      }
    ]
  };
}, [filteredProducts, brandNameOfficial, canonicalSlug]);

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

      <Helmet>
      {/* 1. SEO DE BÚSQUEDA - AUTORIDAD DE DISTRIBUIDOR */}
      {/* El título ahora incluye "Distribuidor Autorizado" y "Suministros", palabras clave para jefes de compras */}
      <title>{`Distribuidor Autorizado ${brandNameOfficial} en Guatemala | Suministros Disdel`}</title>
      
      {/* La descripción ataca el sector empresarial e institucional directamente */}
      <meta name="description" content={`Catálogo institucional de ${brandNameOfficial} para empresas en Guatemala. Venta por mayor de suministros de limpieza, higiene y mantenimiento industrial. Distribuidor oficial con asesoría técnica y entrega en todo el país.`} />
      
      <link rel="canonical" href={`https://www.disdelsa.com/marca/${canonicalSlug}`} />

      {/* 2. DATOS ESTRUCTURADOS (Tu brandSchema profesional) */}
      <script type="application/ld+json">{JSON.stringify(brandSchema)}</script>

      {/* 3. OPEN GRAPH (Optimizado para que los links en WhatsApp/Facebook se vean corporativos) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`Catálogo Mayorista ${brandNameOfficial} - Distribución Disdel`} />
      <meta property="og:description" content={`Adquiere productos originales ${brandNameOfficial} con respaldo institucional. Soluciones integrales para hoteles, hospitales y oficinas en Guatemala.`} />
      <meta property="og:image" content={visualConfig.banner || defaultImage} />
      <meta property="og:url" content={`https://www.disdelsa.com/marca/${canonicalSlug}`} />
      <meta property="og:site_name" content="Disdel" />

      {/* 4. TWITTER CARD */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${brandNameOfficial} Guatemala - Suministros Industriales`} />
      <meta name="twitter:description" content={`Cotiza por volumen productos ${brandNameOfficial}. Entrega rápida y garantía de fábrica en toda la república.`} />
      <meta name="twitter:image" content={visualConfig.banner ? visualConfig.banner : defaultImage} />

      <script type="application/ld+json">{JSON.stringify(brandSchema)}</script>
    </Helmet>

      <div className="brand-hero">
        {isMobile && visualConfig.bannerMob ? (
          <img src={visualConfig.bannerMob} alt={brandNameOfficial} className='banner-fade-in' />
        ) : visualConfig.banner ? (
          <img src={visualConfig.banner} alt={brandNameOfficial} className='banner-fade-in' />
        ) : (
           <div className="brand-hero-fallback" style={{ background: visualConfig.color }}>
            <h1>{brandNameOfficial}</h1>
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
              <div className="cat-img-box"><img src={iconoInicio} alt="Inicio" /></div>
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
            {filteredProducts.map((prod, index) => (
                <div className="product-card" key={prod.IdProducto}>
                  <div className="cat-id-badge">ID: {prod.IdProducto}</div>

                  <Link to={`/producto/${prod.IdProducto.toLowerCase()}`} className="prod-link-wrapper">
                      <div className="prod-img-container">
                        <img src={prod.Imagen ? `${AppConfig.baseImageUrl}productos/${prod.Imagen}` : defaultImage} 
                        alt={prod.Descripcion} 
                        // 🔥 TRUCOS DE VELOCIDAD MÓVIL (OPCIÓN B):
                        // Si es uno de los primeros 4, carga de inmediato, si no, que espere.
                        loading={index < 4 ? "eager" : "lazy"} 
                        // Prioridad alta para los que el usuario ve primero
                        fetchpriority={index < 4 ? "high" : "auto"}
                        // Dimensiones fijas para que la página no "brinque" (CLS)
                        decoding='async'
                        width="200"
                        height="200"
                        style={{aspectRatio: "1/1"}}
                      />
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