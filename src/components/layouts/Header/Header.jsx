import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import useCartStore from 'store/useCartStore';
import styles from './Header.module.css';
import MegaMenu from './MegaMenu';

import { motion , AnimatePresence} from "framer-motion";
import logo from 'assets/logo/LOGO-BLANCO.png';
import iconUser from 'assets/icons/INICIAR-SESION-USUARIO.png';
import iconBuilding from 'assets/icons/MY-BUSINESS.png';
import iconCart from 'assets/icons/CARRITO-DE-COMPRAS.png';
import LogoSplash from 'assets/logo/ICONO-DISDEL.png'

import {
  FaSearch, FaAngleDown, FaBars, FaTimes
} from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=50231094985&text&type=phone_number&app_absent=0`;

  const cart = useCartStore((state) => state.cart);
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
              {/* Animación del Logo: Aparece desde abajo y se agranda un poco */}
              <motion.img 
                src={LogoSplash} 
                alt="Disdel Cargando" 
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              />
              
              {/* Línea de carga sutil */}
              <motion.div 
                className={styles.splashLine}
                initial={{ width: 0 }}
                animate={{ width: "150px" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />

              {/* Texto Así de Limpio */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Así de Limpio
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={styles.header}>
        <div className={styles.headerContainer}>

          {/* IZQUIERDA: Menú Hamburguesa + Logo */}
          <div className={styles.headerLeft}>
            <button className={styles.hamburgerButton} onClick={() => setIsMobileMenuOpen(true)}>
              <FaBars />
            </button>
            <Link to="/" onClick={handleLogoClick}>
               <img src={logo} alt="Disdel Logo" className={styles.logo} />
            </Link>
          </div>

          {/* CENTRO: Buscador */}
          <div className={styles.headerCenter}>
            <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder="Búsqueda de productos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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

          {/* DERECHA: Carrito + Links Externos DESKTOP */}
          <div className={styles.headerRight}>
            <div className={styles.desktopUserActions}>
              
              {/* LOGIN EXTERNO (asidelimpio.com) */}
              <a href="https://asidelimpio.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                <img src={iconUser} alt="Login" className={styles.actionIcon} />
                <span className={styles.actionText}>Así de Limpio</span>
              </a>

              {/* MY BUSINESS EXTERNO (disdelsagt.com) */}
              <a href="https://disdelsagt.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                <img src={iconBuilding} alt="MyBusiness" className={styles.actionIcon} />
                <span className={styles.actionText}>MyBusiness</span>
              </a>
            </div>
            
            <Link to="/carrito" className={cartClasses}>
              <img src={iconCart} alt="Carrito" className={styles.cartIcon} />
              <span className={styles.cartNotification}>{cartItemCount}</span>
            </Link>
          </div>
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
            <form className={styles.searchBarMobile} onSubmit={handleSearchSubmit} style={{margin: '10px 20px'}}>
               <div className={styles.searchBar} style={{border: '1px solid #ddd'}}>
                  <input 
                    type="text" 
                    placeholder="Buscar productos..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className={styles.searchButton}><FaSearch /></button>
               </div>
            </form>

            {/* LOGIN EXTERNO MÓVIL */}
            <a 
              href="https://asidelimpio.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)} 
              className={styles.sidebarLink}
            >
              <img src={iconUser} alt="User" className={styles.sidebarIcon} />
              <div>
                <span className={styles.sidebarTitle}>Así de Limpio</span>
                <span className={styles.sidebarSubtitle}>Mi Cuenta</span>
              </div>
            </a>

            {/* MY BUSINESS EXTERNO MÓVIL */}
            <a 
              href="https://disdelsagt.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)} 
              className={styles.sidebarLink}
            >
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