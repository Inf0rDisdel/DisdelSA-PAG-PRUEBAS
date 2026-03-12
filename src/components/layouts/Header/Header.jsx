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
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=50231094985&text&type=phone_number&app_absent=0`;

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
                alt="Cargando..." 
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

    <header className={styles.header}>
      <div className={styles.headerContainer}>

        {/* 1. LOGO (headerLeft) */}
        <div className={styles.headerLeft}>
          <Link to="/" onClick={handleLogoClick}>
             <img src={logoMain} alt="Disdel Logo" className={styles.logo} />
          </Link>
        </div>

        {/* 2. BUSCADOR Y NAV (headerCenter) */}
        <div className={styles.headerCenter}>
            <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
              <input type="text" placeholder="Búsqueda de productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button type="submit" className={styles.searchButton}><FaSearch /></button>
            </form>
          
          <nav className={styles.mainNav}>
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
            <Link to="/carrito" className={cartClasses}>
              <img src={iconCart} alt="Carrito" className={styles.cartIcon} />
              <span className={styles.cartNotification}>{cartItemCount}</span>
            </Link>
          </div>

          <button className={styles.hamburgerButton} onClick={() => setIsMobileMenuOpen(true)}>
            <FaBars />
          </button>
        </div>
      </header>

    {/* --- MENÚ LATERAL MÓVIL (SIDEBAR) --- */}
    <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
    
    <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuHeader}>
            <h3>Menú</h3>
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
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.sidebarLinkSimple}>Inicio</Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.sidebarLinkSimple}>Contacto WhatsApp</a>
          </nav>
      </div>
    </>
  );
};

export default Header;