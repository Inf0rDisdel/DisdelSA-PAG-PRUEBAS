import React, { useMemo, useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import useCartStore from 'store/useCartStore';
import styles from './Header.module.css';
import MegaMenu from './MegaMenu';

import { motion, AnimatePresence } from "framer-motion";

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';

import {
  FaSearch, FaAngleDown, FaBars, FaTimes
} from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const whatsappUrl = `https://wa.me/50231094985`;

  const { data: bannerData } = useBanners();

  const cart = useCartStore((state) => state.cart);
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getIcon = (dbTitle) => {
    const found = bannerData?.Iconos?.find(i => i.Titulo?.trim() === dbTitle);
    return found ? `${AppConfig.baseImageUrl}${found.Imagen}` : '';
  };

  // 🚀 LOGO PRINCIPAL (Buscamos en el grupo "Logo" - ID 31)
  const logoMainObj = bannerData?.Logo?.find(i => i.Titulo?.trim() === "LogoDisdel");
  const logoMain = logoMainObj ? `${AppConfig.baseImageUrl}${logoMainObj.Imagen}` : '';

  const iconUser = getIcon("IconoAsíDLimpio");
  const iconBuilding = getIcon("IconoMyBussines");
  const iconCart = getIcon("IconoCarrito");
  const logoSplash = getIcon("IconoSplash");

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsTransitioning(true);

    setTimeout(() => {
      navigate("/");
        setTimeout(() => setIsTransitioning(false),600);
    }, 600)
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); 
      setIsMobileMenuOpen(false); 
    }
  };

  useEffect(() => {
    if (cartItemCount === 0) return;
    setBtnIsHighlighted(true);
    const timer = setTimeout(() => setBtnIsHighlighted(false), 300);
    return () => clearTimeout(timer);
  }, [cartItemCount]); 

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

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
            <img src={logoMain} alt="Disdel S.A. - Expertos en Limpieza y Mantenimiento Institucional" className={styles.logo} fetchpriority="high" />
          </Link>
        </div>

        {/* 2. BUSCADOR Y NAV (headerCenter) */}
        <div className={styles.headerCenter}>
            <form className={styles.searchBar} onSubmit={handleSearchSubmit} role="search">
              <input 
                id="header-search"
                type="text" 
                placeholder="Buscar productos en Disdel..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                aria-label="Campo de búsqueda de productos"
              />
              <button type="submit" className={styles.searchButton} aria-label="Ejecutar búsqueda">
                <FaSearch />
              </button>
            </form>
          
          <nav className={styles.mainNav} role="navigation" aria-label="Navegación principal">
            <div
              className={styles.categoriesContainer}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className={styles.navButton}>Categorias <FaAngleDown /></button>
              {isMegaMenuOpen && <MegaMenu />}
            </div>
            <button className={styles.navButton} onClick={handleContactClick}>Contacto</button>
          </nav>
        </div>

        {/* 3. ICONOS DE USUARIO (desktopUserActions) */}
        <div className={styles.desktopUserActions}>
              <a href="https://asidelimpio.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                <img src={iconUser} alt="Así de Limpio" className={styles.actionIcon} />
                <span className={styles.actionText}>Así de Limpio</span>
              </a>
              <a href="https://disdelsagt.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                <img src={iconBuilding} alt="MyBusiness" className={styles.actionIcon} />
                <span className={styles.actionText}>MyBusiness</span>
              </a>
          </div>

        {/* 4. CARRITO (headerRight) */}
        <div className={styles.headerRight}>
            <Link to="/carrito" className={cartClasses} aria-label={`Ver mi cotización: ${cartItemCount} artículos`}>
              <img src={iconCart} alt="" aria-hidden="true" className={styles.cartIcon} />
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
              <img src={iconUser} alt="User" className={styles.sidebarIcon} />
              <div>
                <span className={styles.sidebarTitle}>Así de Limpio</span>
                <span className={styles.sidebarSubtitle}>Mi Cuenta</span>
              </div>
            </a>

            <a href="https://disdelsagt.com" target="_blank" rel="noopener noreferrer" className={styles.sidebarLink}>
              <img src={iconBuilding} alt="Business" className={styles.sidebarIcon} />
              <span>MyBusiness</span>
            </a>

            <hr className={styles.divider} />
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.sidebarLinkSimple}>Inicio del Catálogo</Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.sidebarLinkSimple}>Chat de Ventas PBX</a>
          </nav>
      </div>
    </>
  );
};


export default Header;