import React, {  useState, useEffect, useRef, useMemo, useCallback } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import useCartStore from 'store/useCartStore';
import styles from './Header.module.css';
import MegaMenu from './MegaMenu';

import { motion, AnimatePresence } from "framer-motion";
import { createSlug } from 'utils/slugify';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import { useProducts } from 'hooks/useProducts';

import {
  FaSearch, FaAngleDown, FaBars, FaTimes} from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [suggestions, setSuggestions] = useState([]); // Estado para la lista de sugerencias
  const [showSuggestions, setShowSuggestions] = useState(false); // Estado para mostrar/ocultar el panel
  const searchRef = useRef(null); // Referencia para detectar clics fuera del buscador
  const { data: bannerData } = useBanners();
  const { data: productsData } = useProducts(); // Trae la data de productos
  const whatsappUrl = `https://wa.me/50231094985`;
  
  const cart = useCartStore((state) => state.cart);
  const cartItemCount = useMemo(() => 
    cart.reduce((total, item) => total + (item.quantity || 1), 0), 
  [cart]);

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false); 
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const assets = useMemo(() => {
    const getIcon = (title) => bannerData?.Iconos?.find(i => i.Titulo?.trim() === title)?.Imagen;
    const logoObj = bannerData?.Logo?.find(i => i.Titulo?.trim() === "LogoDisdel");
    const splashObj = bannerData?.Iconos?.find(i => i.Titulo?.trim() === "IconoSplash");
    
    return {
      logoMain: logoObj ? `${AppConfig.baseImageUrl}${logoObj.Imagen}` : '',
      logoSplash: splashObj ? `${AppConfig.baseImageUrl}${splashObj.Imagen}` : '',
      iconUser: getIcon("IconoAsíDLimpio"),
      iconBuilding: getIcon("IconoMyBussines"),
      iconCart: getIcon("IconoCarrito"),
    };
  }, [bannerData]);

  const { logoMain, logoSplash, iconUser, iconBuilding, iconCart } = assets;

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
    navigate(`/producto/${p.IdProducto}/${createSlug(p.Descripcion)}`);
  };

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/");
      setTimeout(() => setIsTransitioning(false), 600);
    }, 600);
  }, [navigate]);

  const cartClasses = `${styles.cartLink} ${btnIsHighlighted ? styles.bump : ''}`;
  const handleContactClick = () => window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  return (
  <>
    <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            className={styles.splashOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.splashContent}>
              <motion.img 
                src={logoSplash} 
                alt="Disdel S.A. - Cargando Experiencia" 
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              />
              <motion.div className={styles.splashLine} initial={{ width: 0 }} animate={{ width: "150px" }} transition={{ delay: 0.5, duration: 0.8 }} />
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>Así de Limpio</motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    <header className={styles.header} role="banner">
      <div className={styles.headerContainer}>

        {/* 1. LOGO (headerLeft) */}
        <div className={styles.headerLeft}>
          <Link to="/" onClick={handleLogoClick}>
            <img 
              src={logoMain} 
              alt="Disdel S.A. - Expertos en Limpieza y Mantenimiento Institucional" 
              className={styles.logo} 
              fetchpriority="high" // 🚀 Prioridad máxima
              loading="eager"      // 🚀 Carga inmediata
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
                <FaSearch />
              </button>
            </form>

            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    className={styles.suggestionsBox}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {suggestions.map((p, index) => (
                      <div 
                        key={`${p.IdProducto}-${index}`}
                        className={styles.suggestionItem}
                        onClick={() => handleSuggestionClick(p)}
                      >
                        <img 
                          src={p.Imagen ? `${AppConfig.baseImageUrl}productos/${p.Imagen}` : ''} 
                          alt="" 
                          className={styles.suggestImg} 
                          width="45" // 🚀 Evita CLS interno
                          height="45"
                        />
                        <div className={styles.suggestInfo}>
                          <span className={styles.suggestTitle}>{p.Descripcion}</span>
                          <span className={styles.suggestMeta}>Disdel # {p.IdProducto} | {p.Marca}</span>
                        </div>
                      </div>
                    ))}
                    <div className={styles.suggestFooter} onClick={handleSearchSubmit}>
                      Ver todos los resultados para "{searchTerm}"
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
          
          <nav className={styles.mainNav} role="navigation" aria-label="Navegación principal">
            <div
              className={styles.categoriesContainer}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className={styles.navButton}>Categorias <FaAngleDown /></button>
              {isMegaMenuOpen && <MegaMenu />}
            </div>
            <button className={styles.navButton} onClick={() => navigate('/ayuda')}>Líneas de Asistencia</button>
          </nav>
        </div>

        {/* 3. ICONOS DE USUARIO (desktopUserActions) */}
        <div className={styles.desktopUserActions}>
              <a href="https://asidelimpio.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                <img src={`${AppConfig.baseImageUrl}${iconUser}`} 
                alt="Así de Limpio" 
                className={styles.actionIcon} 
                width="35" // 🚀 Evita CLS
                height="35"
                />
                <span className={styles.actionText}>Así de Limpio</span>
              </a>
              <a href="https://disdelsagt.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                <img src={`${AppConfig.baseImageUrl}${iconBuilding}`} 
                alt="MyBusiness" 
                className={styles.actionIcon} 
                width="35" // 🚀 Evita CLS
                height="35"
                />
                <span className={styles.actionText}>MyBusiness</span>
              </a>
          </div>

        {/* 4. CARRITO (headerRight) */}
        <div className={styles.headerRight}>
            <Link to="/carrito" className={cartClasses} aria-label={`Ver mi cotización: ${cartItemCount} artículos`}>
              <img src={`${AppConfig.baseImageUrl}${iconCart}`} 
              alt="" aria-hidden="true" 
              className={styles.cartIcon} 
              width="40" // 🚀 Evita CLS
              height="40"
              />
              <span className={styles.cartNotification} aria-hidden="true">{cartItemCount}</span>
            </Link>
          </div>


          <button 
            className={styles.hamburgerButton} 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú móvil"
          >
            <FaBars />
          </button>
        </div>
      </header>

    {/* --- MENÚ LATERAL MÓVIL (SIDEBAR) --- */}
    <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
    
    <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuHeader}>
            <h3>Menú Disdel</h3>
            <button onClick={() => setIsMobileMenuOpen(false)} className={styles.closeButton}><FaTimes /></button>
          </div>

          <nav className={styles.mobileNavLinks}>
            {/* BUSCADOR MÓVIL */}
            <form className={styles.searchBarMobile} onSubmit={handleSearchSubmit} style={{margin: '10px 20px'}}>
               <div className={styles.searchBar} style={{border: '1px solid #ddd'}}>
                  <input type="text" placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <button type="submit" className={styles.searchButton}><FaSearch /></button>
               </div>
            </form>

            <a href="https://asidelimpio.com" target="_blank" rel="noopener noreferrer" className={styles.sidebarLink}>
              <img src={`${AppConfig.baseImageUrl}${iconUser}`} alt="User" className={styles.sidebarIcon} />
              <div>
                <span className={styles.sidebarTitle}>Así de Limpio</span>
                <span className={styles.sidebarSubtitle}>Mi Cuenta</span>
              </div>
            </a>

            <a href="https://disdelsagt.com" target="_blank" rel="noopener noreferrer" className={styles.sidebarLink}>
              <img src={`${AppConfig.baseImageUrl}${iconBuilding}`} alt="Business" className={styles.sidebarIcon} />
              <span>MyBusiness</span>
            </a>

            <hr className={styles.divider} />
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.sidebarLinkSimple}>Inicio del Catálogo</Link>
            <Link to="/ayuda" onClick={() => setIsMobileMenuOpen(false)} className={styles.sidebarLinkSimple}>Centro de Ayuda</Link>
            <button onClick={handleContactClick} className={styles.sidebarLinkSimple} style={{background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer'}}>
              WhatsApp Ventas
          </button>
          </nav>
      </div>
    </>
  );
};


export default Header;