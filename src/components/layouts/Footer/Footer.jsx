import React from 'react';
import './Footer.css'; 
import { Link } from 'react-router-dom';

import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';

const Footer = () => {
    const { data: bannerData } = useBanners();

    const getUrl = (dbTitle) => {
        const found = bannerData?.Iconos?.find(i => i.Titulo?.trim() === dbTitle);
        return found ? `${AppConfig.baseImageUrl}${found.Imagen}` : '';
    };

    const imgMascota = getUrl("IconoPersonaje");
    const imgVisa = getUrl("IconoVISA");

    return (
        <footer className="footer-wrapper">
            <div className="footer-content-area">

                {/* 🚀 CONTENEDOR AZUL DISDEL */}
                <div className="footer-container">
                    <div className="footer-columns-grid">
                        
                        {/* 🚀 FILA 1: INFORMACIÓN CORPORATIVA (3 COLUMNAS) */}
                        <div className="footer-row-top">
                            {/* Columna 1: Contacto & Redes */}
                            <div className="footer-column contact-column">
                                <h3>CONTÁCTANOS</h3>
                                <ul className="contact-list">
                                    <li><a href="tel:+50231094985">+502 3109-4985</a></li>
                                    <li><a href="mailto:info@disdelsa.com">info@disdelsa.com</a></li>
                                    <li><a href="mailto:cmdisdel@disdelsa.com">cmdisdel@disdelsa.com</a></li>
                                </ul>

                                <div className="social-container-desktop">
                                    <h3 className="social-title">CONÉCTATE CON NOSOTROS</h3>
                                    <ul className="social-links-list">
                                        <li>
                                            <a href="https://www.facebook.com/Disdelsagt" target="_blank" rel="noopener noreferrer" className="facebook" aria-label="Facebook Disdel">
                                                <FaFacebookF /> <span className="social-text">Disdelsagt</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.instagram.com/disdelsagt/" target="_blank" rel="noopener noreferrer" className="instagram" aria-label="Instagram Disdel">
                                                <FaInstagram /> <span className="social-text">Disdelsagt</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.linkedin.com/company/disdelsa/" target="_blank" rel="noopener noreferrer" className="linkedin" aria-label="LinkedIn Disdel">
                                                <FaLinkedinIn /> <span className="social-text">Disdelsagt</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Columna 2: Sobre Nosotros */}
                            <div className="footer-column">
                                <h3>SOBRE NOSOTROS</h3>
                                <ul>
                                    <li><Link to="/quienes-somos" className="footer-link">Quiénes Somos</Link></li>
                                    <li><a href="https://disdelsagt.com/MyBusiness/Empleo/SolicitudEmpleo" target="_blank" rel="noopener noreferrer">Empleos Disdel</a></li>
                                    <li><Link to="/ayuda" className="footer-link">Ayuda</Link></li>
                                </ul>
                            </div>

                            {/* Columna 3: Tiendas y Sucursales */}
                            <div className="footer-column">
                                <h3>TIENDAS Y SUCURSALES</h3>
                                <ul>
                                    <li><Link to="/ubicaciones" className="footer-link">Ubicaciones Y Teléfonos</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* 🚀 FILA 2: ENLACES SEO / DIRECTORIO (3 COLUMNAS SIMÉTRICAS) */}
                        <div className="footer-row-bottom">
                            {/* Columna 1: Soluciones (4 elementos exactos como la imagen) */}
                            <div className="footer-column">
                                <h3>SOLUCIONES MAYORISTAS</h3>
                                <ul>
                                    <li><Link to="/categoria/banos-e-higiene">Higiene y Baños Institucionales</Link></li>
                                    <li><Link to="/categoria/quimicos-para-limpieza">Químicos de Limpieza Profesional</Link></li>
                                    <li><Link to="/categoria/herramientas-para-limpieza">Herramientas y Utensilios</Link></li>
                                    <li><Link to="/categoria/epp">Equipo de Protección Personal (EPP)</Link></li>
                                </ul>
                             </div>

                            {/* Columna 2: Marcas (4 elementos exactos como la imagen) */}
                            <div className="footer-column">
                                <h3>MARCAS DESTACADAS</h3>
                                <ul>
                                    <li><Link to="/marca/kimberly-clark-professional">Kimberly Clark Professional</Link></li>
                                    <li><Link to="/marca/3m">Productos 3M Guatemala</Link></li>
                                    <li><Link to="/marca/wiese">Suministros Wiese</Link></li>
                                    <li><Link to="/marca/silver">Silver Chemical</Link></li>
                                </ul>
                            </div>

                            {/* Columna 3: Palabras clave (4 elementos exactos como la imagen) */}
                            <div className="footer-column">
                                <h3>LO MÁS BUSCADO</h3>
                                <ul className="footer-keyword-links">
                                    <li><Link to="/buscar?q=detergente">Detergente Industrial</Link></li>
                                    <li><Link to="/buscar?q=cloro">Cloro y Desinfectantes</Link></li>
                                    <li><Link to="/buscar?q=jabon">Jabón para Manos</Link></li>
                                    <li><Link to="/buscar?q=escobas">Escobas y Cepillos</Link></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Área derecha con gráficos */}
                <div className="footer-right-area">
                    <div className="products-text">
                        <span>+1000</span> productos <br /> <small>para tu empresa</small>
                    </div>
                    {/* Caja de logos de pago blanca con sombra sutil */}
                    <div className="payment-logos-card">
                        {imgVisa && <img src={imgVisa} alt="Métodos de pago aceptados" width="120" height="40" />}
                    </div>
                    <div className="mascot">
                       {imgMascota && <img src={imgMascota} alt="Mascota Disdel" width="180" height="340" />}
                    </div>
                    <div className="footer-copyright">
                        <p>© 2026 Disdel S.A. Todos los derechos reservados.</p>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;