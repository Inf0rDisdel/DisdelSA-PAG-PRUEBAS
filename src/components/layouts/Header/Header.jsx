import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import MegaMenu from './MegaMenu';

import logo from 'assets/logo/LOGO-BLANCO.png';
import iconUser from 'assets/icons/INICIAR-SESION-USUARIO.png';
import iconBuilding from 'assets/icons/MY-BUSINESS.png';
import iconCart from 'assets/icons/CARRITO-DE-COMPRAS.png';

import {
  FaSearch, FaAngleDown, FaShoppingCart, FaBars, FaTimes, FaMapMarkerAlt
} from 'react-icons/fa';

const Header = ({ cartItemCount = 0 }) => {
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=50231094985&text&type=phone_number&app_absent=0`;

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);

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
      <header className={styles.header}>
        <div className={styles.headerContainer}>

          {/* IZQUIERDA: Menú Hamburguesa (Solo Móvil) + Logo */}
          <div className={styles.headerLeft}>
            <button 
              className={styles.hamburgerButton} 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FaBars />
            </button>

            <Link to="/">
              <img src={logo} alt="Disdel Logo" className={styles.logo} />
            </Link>
          </div>

          {/* CENTRO: Buscador */}
         <div className={styles.headerCenter}>
            <div className={styles.searchBar}>
              <input type="text" placeholder="Búsqueda de productos" />
              <button className={styles.searchButton}><FaSearch /></button>
            </div>
            
            {/* Navegación Desktop (Oculta en móvil) */}
            <nav className={styles.mainNav}>
              
              {/* --- AQUÍ ESTÁ EL TRUCO DEL HOVER --- */}
              {/* Este DIV envuelve al botón y al menú para que no se cierre */}
              <div
                className={styles.categoriesContainer}
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button className={styles.navButton}>Categorias <FaAngleDown /></button>
                {/* El menú aparece aquí dentro */}
                {isMegaMenuOpen && <MegaMenu />}
              </div>

               <button className={styles.navButton} onClick={handleContactClick}>Contacto</button>
            </nav>
          </div>

          {/* DERECHA: Carrito (Siempre visible) + Login/MyBusiness (Solo Desktop) */}
          <div className={styles.headerRight}>
            
            <div className={styles.desktopUserActions}>
              <Link to="/login" className={styles.actionLink}>
                <img src={iconUser} alt="Login" className={styles.actionIcon} />
                <span className={styles.actionText}>Login</span>
              </Link>
              <Link to="/my-business" className={styles.actionLink}>
                <img src={iconBuilding} alt="MyBusiness" className={styles.actionIcon} />
                <span className={styles.actionText}>MyBusiness</span>
              </Link>
              <Link to="/sede-central" className={styles.secondaryLink}>Tienda Disdel</Link>
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
            <button onClick={() => setIsMobileMenuOpen(false)} className={styles.closeButton}>
              <FaTimes />
            </button>
          </div>

          <nav className={styles.mobileNavLinks}>
            
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={styles.sidebarLink}>
              <img src={iconUser} alt="User" className={styles.sidebarIcon} />
              <div>
                <span className={styles.sidebarTitle}>Iniciar Sesión / Regístrate</span>
                <span className={styles.sidebarSubtitle}>Mi Cuenta</span>
              </div>
            </Link>

            <Link to="/my-business" onClick={() => setIsMobileMenuOpen(false)} className={styles.sidebarLink}>
              <img src={iconBuilding} alt="Business" className={styles.sidebarIcon} />
              <span>MyBusiness</span>
            </Link>

            <Link to="/sede-central" onClick={() => setIsMobileMenuOpen(false)} className={styles.sidebarLink}>
              <FaMapMarkerAlt className={styles.sidebarIcon} style={{color: '#135eab'}}/> 
              <span>Recoge en tienda</span>
            </Link>

            <hr className={styles.divider} />

            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.sidebarLinkSimple}>Inicio</Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.sidebarLinkSimple}>Contacto WhatsApp</a>
          </nav>
      </div>
    </>
  );
};

export default Header;