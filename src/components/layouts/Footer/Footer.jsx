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

                <div className="footer-container">
                    <div className="footer-columns-grid">
                        
                        <div className="footer-row">
                            <div className="footer-column">
                                <h3>CONTÁCTANOS</h3>
                                <ul>
                                    <li><a href="tel:+50231094985">+502 3109-4985</a></li>
                                    <li><a href="mailto:info@disdelsa.com">info@disdelsa.com</a></li>
                                    <li><a href="mailto:cmdisdel@disdelsa.com">cmdisdel@disdelsa.com</a></li>
                                </ul>
                            </div>

                            <div className="seo-hidden-links">
                                <div className="footer-column">
                                    <h3>SOLUCIONES MAYORISTAS</h3>
                                    <ul>
                                        <li><Link to="/categoria/baños-e-higiene">Higiene y Baños Institucionales</Link></li>
                                        <li><Link to="/categoria/quimicos-para-limpieza">Químicos de Limpieza Profesional</Link></li>
                                        <li><Link to="/categoria/herramientas-para-limpieza">Herramientas y Utensilios</Link></li>
                                        <li><Link to="/categoria/epp">Equipo de Protección Personal (EPP)</Link></li>
                                        <li><Link to="/categoria/cafeteria">Cafetería e Insumos para Oficinas</Link></li>
                                        <li><Link to="/categoria/botiquin">Botiquín y Seguridad Médica</Link></li>
                                        <li><Link to="/categoria/ferreteria">Artículos de Ferretería Industrial</Link></li>
                                    </ul>
                                 </div>

                                    {/* Columna 3: SEO Marcas */}
                                    <div className="footer-column">
                                    <h3>MARCAS DESTACADAS</h3>
                                        <ul>
                                            <li><Link to="/marca/kimberly-clark-professional">Kimberly Clark Professional</Link></li>
                                            <li><Link to="/marca/3m">Productos 3M Guatemala</Link></li>
                                            <li><Link to="/marca/wiese">Suministros Wiese</Link></li>
                                            <li><Link to="/marca/silver">Silver Chemical</Link></li>
                                            <li><Link to="/marca/leoncito">Artículos Leoncito</Link></li>
                                            <li><Link to="/marca/rendidor">Detergentes Rendidor</Link></li>
                                        </ul>
                                    </div>

                                       {/* COLUMNA 3: LO MÁS BUSCADO (KEYWORD ATTACK) */}
                                       {/* Esta sección ataca directamente las búsquedas: cloro, detergente, cafe, etc. */}
                                        <div className="footer-column">
                                        <h3>LO MÁS BUSCADO</h3>
                                        <ul className="footer-keyword-links">
                                            <li><Link to="/buscar?q=detergente">Detergente Industrial</Link></li>
                                            <li><Link to="/buscar?q=cloro">Cloro y Desinfectantes</Link></li>
                                            <li><Link to="/buscar?q=jabon">Jabón para Manos</Link></li>
                                            <li><Link to="/buscar?q=escobas">Escobas y Cepillos</Link></li>
                                            <li><Link to="/buscar?q=palas">Palas y Recolectores</Link></li>
                                            <li><Link to="/buscar?q=cafe">Café en Grano y Soluble</Link></li>
                                            <li><Link to="/buscar?q=papel+higienico">Papel Higiénico Mayoreo</Link></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="footer-column">
                                    <h3>SOBRE NOSOTROS</h3>
                                    <ul>
                                        <Link to="/quienes-somos" className="footer-link">
                                            Quiénes Somos
                                            </Link>
                                        <li><a href="https://disdelsagt.com/MyBusiness/Empleo/SolicitudEmpleo" target="_blank" rel="noopener noreferrer"> Empleos Disdel </a></li>
                                        <Link to="/ayuda" className="footer-link">
                                            Ayuda
                                            </Link>
                                    </ul>
                                </div>
                            <div className="footer-column">
                                <h3>TIENDAS Y SUCURSALES</h3>
                                <ul>
                                    <Link to="/ubicaciones" className="...">Ubicaciones Y Teléfonos</Link>
                                </ul>
                            </div>
                        </div>

                        <div className="footer-row">
                            <div className="footer-column">
                                <h3>Conéctate con nosotros</h3>
                                <ul className="social-links-list">
                                    <li>
                                        <a href="https://www.facebook.com/Disdelsagt" target="_blank" rel="noopener noreferrer" className="facebook">
                                            <FaFacebookF /> <span className="social-text">Disdelsagt</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.instagram.com/disdelsagt/" target="_blank" rel="noopener noreferrer" className="instagram">
                                            <FaInstagram /> <span className="social-text">Disdelsagt</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/company/disdelsa/" target="_blank" rel="noopener noreferrer" className="linkedin">
                                            <FaLinkedinIn /> <span className="social-text">Disdelsagt</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="footer-right-area">
                    <div className="products-text">
                        <span>+1000</span> productos
                    </div>
                    <div className="mascot">
                       {imgMascota && <img src={imgMascota} alt="Mascota Disdel" />}
                    </div>
                        <div className="payment-logos">
                            {imgVisa && <img src={imgVisa} alt="Metodos de pago" />}
                        </div>
                        <div className="footer-copyright">
                            <p>© 2026 Copyright Disdel S.A</p>
                        </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;