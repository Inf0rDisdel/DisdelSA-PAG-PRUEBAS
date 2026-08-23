import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import useCartStore from 'store/useCartStore';
import styles from './Header.module.css';

import { createSlug } from 'utils/slugify';

import { useBanners } from 'hooks/useBanners';
import { useMenu } from 'hooks/useMenu';
import { useProducts } from 'hooks/useProducts';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';

import {
  FaSearch, FaAngleDown, FaBars, FaTimes} from 'react-icons/fa';

const brandKeywords = ['KIMBERLY', '3M', 'WIESE', 'SILVER'];
const MegaMenu = React.lazy(() => import('./MegaMenu'));

const Header = () => {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [suggestions, setSuggestions] = useState([]); // Estado para la lista de sugerencias
  const [showSuggestions, setShowSuggestions] = useState(false); // Estado para mostrar/ocultar el panel
  const searchRef = useRef(null); // Referencia para detectar clics fuera del buscador
  const { data: bannerData } = useBanners();
  // El catálogo completo se solicita al buscar, no durante la carga crítica.
  const shouldLoadSearchCatalog = searchTerm.trim().length > 2;
  const { data: productsData } = useProducts({ enabled: shouldLoadSearchCatalog });
  const whatsappUrl = `https://wa.me/50231094985`;
  
  const cart = useCartStore((state) => state.cart);
  const cartItemCount = useMemo(() => 
    cart.reduce((total, item) => total + (item.quantity || 1), 0), 
  [cart]);

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSidebarCategory, setExpandedSidebarCategory] = useState(null);
  const [isLogoTransitioning, setIsLogoTransitioning] = useState(false);
  const logoTransitionTimerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeMenuButtonRef = useRef(null);
  const { data: menuData, isLoading: isMenuLoading, isError: isMenuError } = useMenu({
    enabled: isMobileMenuOpen
  });

  const catalogSegments = useMemo(() => {
    if (!Array.isArray(menuData)) return [];

    return menuData.filter((segment) => {
      const segmentName = String(segment?.NombreSegmento || '').toUpperCase();
      return !brandKeywords.some((brand) => segmentName.includes(brand));
    });
  }, [menuData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length > 2 && productsData) {
        const searchLower = searchTerm.toLowerCase();
        const words = searchLower.split(/\s+/);
        
        const filtered = productsData.filter(p => {
          const text = `${p.Descripcion} ${p.IdProducto} ${p.Marca}`.toLowerCase();
          return words.every(word => text.includes(word));
        }).slice(0, 6);

        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 150); // 150ms de espera: Imperceptible para el usuario, respiro para el CPU

    return () => clearTimeout(timer);
  }, [searchTerm, productsData]);

  useEffect(() => {
    if (!showSuggestions) return undefined;

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  useEffect(() => () => {
    if (logoTransitionTimerRef.current) {
      window.clearTimeout(logoTransitionTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = 'hidden';
    closeMenuButtonRef.current?.focus();

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
      menuButton?.focus();
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMegaMenuOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsMegaMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMegaMenuOpen]);

  const assets = useMemo(() => {
    const getIcon = (title) => bannerData?.Iconos?.find(i => i.Titulo?.trim() === title)?.Imagen;
    const logoObj = bannerData?.Logo?.find(i => i.Titulo?.trim() === "LogoDisdel");
    return {
      logoMain: getDisdelImageUrl(logoObj?.Imagen),
      iconUser: getDisdelImageUrl(getIcon("IconoAsíDLimpio")),
      iconBuilding: getDisdelImageUrl(getIcon("IconoMyBussines")),
      iconCart: getDisdelImageUrl(getIcon("IconoCarrito")),
    };
  }, [bannerData]);

  const { logoMain, iconUser, iconBuilding, iconCart } = assets;

  const handleSearchSubmit = (e) => {
  e.preventDefault(); 
  const cleanTerm = searchTerm.trim();
  
  if (cleanTerm) {
    // 🚀 ENVIAMOS LA BÚSQUEDA DE FORMA INVISIBLE EN EL STATE
    navigate('/buscar', { state: { q: cleanTerm } });
    setSearchTerm(''); 
    setShowSuggestions(false);
    setIsMobileMenuOpen(false); 
  }
};

  const handleSuggestionClick = (p) => {
    setSearchTerm('');
    setShowSuggestions(false);
    navigate(`/producto/${String(p.IdProducto).trim().toLowerCase()}/${createSlug(p.Descripcion)}`);
  };

  const cartClasses = styles.cartLink;
  const handleContactClick = () => window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  const closeSidebar = () => setIsMobileMenuOpen(false);

  const toggleSidebarCategory = (segmentId) => {
    setExpandedSidebarCategory((current) => current === segmentId ? null : segmentId);
  };

  const handleLogoNavigation = (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (isLogoTransitioning) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      navigate('/');
      return;
    }

    setIsLogoTransitioning(true);
    logoTransitionTimerRef.current = window.setTimeout(() => {
      navigate('/');
      setIsMobileMenuOpen(false);
      setIsLogoTransitioning(false);
    }, 680);
  };

  return (
  <>
    <header className={styles.header} role="banner">
      <div className={styles.headerContainer}>

        {/* 1. MENÚ + LOGO (headerLeft) */}
        <div className={styles.headerLeft}>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.hamburgerButton}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú principal y categorías"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <FaBars aria-hidden="true" />
          </button>

          <Link
            to="/"
            aria-label="Ir al inicio de Disdel"
            className={styles.logoLink}
            onClick={handleLogoNavigation}
          >
            <OptimizedImage
              src={logoMain || undefined}
              alt="Disdel S.A. - Expertos en Limpieza y Mantenimiento Institucional" 
              className={styles.logo} 
              widths={[180, 270, 360]}
              targetWidth={360}
              quality={82}
              sizes="180px"
              fetchPriority="auto" // El Hero es el recurso LCP prioritario
              loading="eager"      // 🚀 Carga inmediata
              decoding="async"
              width="180"          // 🚀 Dimensiones explícitas
              height="90"  
            />
          </Link>
        </div>

        {/* 2. BUSCADOR Y NAV (headerCenter) */}
        <div className={styles.headerCenter}>
          <div className={styles.searchWrapper} ref={searchRef}>
            <form className={styles.searchBar} onSubmit={handleSearchSubmit} role="search">
              <input 
                id="header-search"
                type="text" 
                placeholder="Buscar productos en Disdel..." 
                value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  onFocus={() => searchTerm.length > 2 && setShowSuggestions(true)}
                  autoComplete="off"
                  aria-label="Buscar productos"
                />
              <button type="submit" className={styles.searchButton} aria-label="Ejecutar búsqueda">
                <FaSearch aria-hidden="true" />
              </button>
            </form>

                {showSuggestions && suggestions.length > 0 && (
                  <div
                    className={styles.suggestionsBox}
                  >
                    {suggestions.map((p, index) => (
                      <div 
                        key={`${p.IdProducto}-${index}`}
                        className={styles.suggestionItem}
                        onClick={() => handleSuggestionClick(p)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleSuggestionClick(p);
                          }
                        }}
                        role="button"
                        tabIndex="0"
                      >
                        <OptimizedImage
                          src={getDisdelImageUrl(p.Imagen, 'productos')}
                          alt="" 
                          className={styles.suggestImg} 
                          widths={[48, 72, 96]}
                          targetWidth={96}
                          quality={78}
                          sizes="45px"
                          width="45" // 🚀 Evita CLS interno
                          height="45"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                        />
                        <div className={styles.suggestInfo}>
                          <span className={styles.suggestTitle}>{p.Descripcion}</span>
                          <span className={styles.suggestMeta}>Disdel # {p.IdProducto} | {p.Marca}</span>
                        </div>
                      </div>
                    ))}
                    <div
                      className={styles.suggestFooter}
                      onClick={handleSearchSubmit}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleSearchSubmit(event);
                        }
                      }}
                      role="button"
                      tabIndex="0"
                    >
                      Ver todos los resultados para "{searchTerm}"
                    </div>
                  </div>
                )}
          </div>
          
          <nav className={styles.mainNav} role="navigation" aria-label="Navegación principal">
            <div
              className={styles.categoriesContainer}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                type="button"
                className={styles.navButton}
                aria-haspopup="true"
                aria-expanded={isMegaMenuOpen}
                onClick={() => setIsMegaMenuOpen(true)}
              >
                Categorías <FaAngleDown aria-hidden="true" />
              </button>
              {isMegaMenuOpen && (
                <React.Suspense fallback={null}>
                  <MegaMenu />
                </React.Suspense>
              )}
            </div>
            <button type="button" className={styles.navButton} onClick={() => navigate('/ayuda')}>Líneas de Asistencia</button>
          </nav>
        </div>

        {/* 3. ICONOS DE USUARIO (desktopUserActions) */}
        <div className={styles.desktopUserActions}>
              <a href="https://asidelimpio.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                <OptimizedImage src={iconUser}
                alt="" aria-hidden="true"
                className={styles.actionIcon} 
                widths={[48, 64, 96]}
                targetWidth={64}
                quality={80}
                sizes="35px"
                width="35" // 🚀 Evita CLS
                height="35"
                loading="eager"
                decoding="async"
                fetchPriority="auto"
                />
                <span className={styles.actionText}>Así de Limpio</span>
              </a>
              <a href="https://disdelsagt.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                <OptimizedImage src={iconBuilding}
                alt="" aria-hidden="true"
                className={styles.actionIcon} 
                widths={[48, 64, 96]}
                targetWidth={64}
                quality={80}
                sizes="35px"
                width="35" // 🚀 Evita CLS
                height="35"
                loading="eager"
                decoding="async"
                fetchPriority="auto"
                />
                <span className={styles.actionText}>MyBusiness</span>
              </a>
          </div>

        {/* 4. CARRITO (headerRight) */}
        <div className={styles.headerRight}>
            <Link to="/carrito" className={cartClasses} aria-label={`Ver mi cotización: ${cartItemCount} artículos`}>
              <OptimizedImage src={iconCart}
              alt="" aria-hidden="true" 
              className={styles.cartIcon} 
              widths={[48, 64, 96]}
              targetWidth={64}
              quality={80}
              sizes="40px"
              width="40" // 🚀 Evita CLS
              height="40"
              loading="eager"
              decoding="async"
              fetchPriority="auto"
              />
              <span className={styles.cartNotification} aria-hidden="true">{cartItemCount}</span>
            </Link>
          </div>
        </div>
      </header>

    {/* --- MENÚ LATERAL PRINCIPAL --- */}
    <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
    
    <aside
      id="mobile-navigation"
      className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
      aria-hidden={!isMobileMenuOpen}
      aria-label="Menú principal y categorías"
      inert={isMobileMenuOpen ? undefined : ''}
    >
          <div className={styles.mobileMenuHeader}>
            <OptimizedImage
              src={logoMain || undefined}
              alt="Disdel"
              className={styles.mobileMenuLogo}
              widths={[120, 180, 240]}
              targetWidth={180}
              quality={82}
              sizes="120px"
              width="120"
              height="60"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
            <button ref={closeMenuButtonRef} type="button" onClick={closeSidebar} className={styles.closeButton} aria-label="Cerrar menú"><FaTimes aria-hidden="true" /></button>
          </div>

          <nav className={styles.mobileNavLinks}>
            {/* BUSCADOR MÓVIL */}
            <form className={styles.searchBarMobile} onSubmit={handleSearchSubmit} style={{margin: '10px 20px'}} role="search">
               <div className={styles.searchBar} style={{border: '1px solid #ddd'}}>
                  <input type="text" placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Buscar productos" autoComplete="off" />
                  <button type="submit" className={styles.searchButton} aria-label="Ejecutar búsqueda"><FaSearch aria-hidden="true" /></button>
               </div>
            </form>

            <a href="https://asidelimpio.com" target="_blank" rel="noopener noreferrer" className={styles.sidebarLink}>
              <OptimizedImage src={iconUser} alt="" aria-hidden="true" className={styles.sidebarIcon} widths={[32, 48]} targetWidth={48} quality={80} sizes="24px" width="24" height="24" loading="lazy" decoding="async" fetchPriority="low" />
              <div>
                <span className={styles.sidebarTitle}>Así de Limpio</span>
                <span className={styles.sidebarSubtitle}>Mi Cuenta</span>
              </div>
            </a>

            <a href="https://disdelsagt.com" target="_blank" rel="noopener noreferrer" className={styles.sidebarLink}>
              <OptimizedImage src={iconBuilding} alt="" aria-hidden="true" className={styles.sidebarIcon} widths={[32, 48]} targetWidth={48} quality={80} sizes="24px" width="24" height="24" loading="lazy" decoding="async" fetchPriority="low" />
              <span>MyBusiness</span>
            </a>

            <hr className={styles.divider} />
            <p className={styles.sidebarSectionTitle}>Navegación</p>
            <Link to="/" onClick={closeSidebar} className={styles.sidebarLinkSimple}>Inicio del Catálogo</Link>
            <Link to="/quienes-somos" onClick={closeSidebar} className={styles.sidebarLinkSimple}>Quiénes Somos</Link>
            <Link to="/ayuda" onClick={closeSidebar} className={styles.sidebarLinkSimple}>Centro de Ayuda / Contacto</Link>
            <Link to="/ubicaciones" onClick={closeSidebar} className={styles.sidebarLinkSimple}>Ubicaciones y tiendas</Link>
            <button type="button" onClick={handleContactClick} className={styles.sidebarLinkSimple} style={{background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer'}}>
              WhatsApp Ventas
            </button>

            <div className={styles.sidebarCategories}>
              <p className={styles.sidebarSectionTitle}>Categorías de productos</p>

              {isMenuLoading && (
                <div className={styles.sidebarMenuStatus} role="status">Cargando categorías…</div>
              )}

              {isMenuError && (
                <div className={styles.sidebarMenuStatus}>No fue posible cargar las categorías.</div>
              )}

              {catalogSegments.map((segment) => {
                const segmentId = String(segment.IdSegmento || segment.NombreSegmento);
                const segmentSlug = createSlug(segment.NombreSegmento);
                const panelId = `sidebar-category-${createSlug(segmentId)}`;
                const isExpanded = expandedSidebarCategory === segmentId;

                return (
                  <section className={styles.sidebarCategoryGroup} key={segmentId}>
                    <button
                      type="button"
                      className={`${styles.sidebarCategoryButton} ${isExpanded ? styles.expanded : ''}`}
                      onClick={() => toggleSidebarCategory(segmentId)}
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                    >
                      <span>{segment.NombreSegmento}</span>
                      <FaAngleDown className={styles.sidebarCategoryChevron} aria-hidden="true" />
                    </button>

                    {isExpanded && (
                      <div id={panelId} className={styles.sidebarCategoryPanel}>
                        <Link
                          to={`/categoria/${segmentSlug}`}
                          onClick={closeSidebar}
                          className={`${styles.sidebarCategoryLink} ${styles.sidebarCategoryAll}`}
                        >
                          Ver todo en {segment.NombreSegmento}
                        </Link>

                        {(segment.Categorias || []).map((category) => (
                          <Link
                            key={category.IdCategoria || category.NombreCategoria}
                            to={`/categoria/${segmentSlug}/${createSlug(category.NombreCategoria)}`}
                            onClick={closeSidebar}
                            className={styles.sidebarCategoryLink}
                          >
                            {category.NombreCategoria}
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </nav>
      </aside>

      {isLogoTransitioning && (
        <div className={styles.logoTransitionOverlay} aria-hidden="true">
          <div className={styles.logoTransitionContent}>
            <svg
              className={styles.logoTransitionWing}
              viewBox="0 0 220 130"
              role="presentation"
              focusable="false"
            >
              <path d="M25 94C83 87 139 55 194 18" />
              <path d="M38 108C90 100 133 77 174 44" />
              <path d="M56 119C96 111 127 94 154 70" />
            </svg>
            <span className={styles.logoTransitionLine} />
            <span className={styles.logoTransitionText}>ASÍ DE LIMPIO</span>
          </div>
        </div>
      )}
    </>
  );
};


export default Header;
