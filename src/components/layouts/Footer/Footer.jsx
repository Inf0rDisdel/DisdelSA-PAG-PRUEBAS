import React, {useMemo} from 'react';
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
                                    <h3>CATEGORÍAS</h3>
                                    <ul>
                                        <li><Link to="/categoria/botiquin">Botiquín</Link></li>
                                        <li><Link to="/categoria/papeleria">Papelería</Link></li>
                                        <li><Link to="/categoria/herramientas-para-limpieza">Limpieza</Link></li>
                                    </ul>
                                </div>

                                    {/* Columna 3: SEO Marcas */}
                                    <div className="footer-column">
                                        <h3>MARCAS</h3>
                                        <ul>
                                            <li><Link to="/marca/3m">3M</Link></li>
                                            <li><Link to="/marca/kimberly-clark-professional">Kimberly Clark</Link></li>
                                            <li><Link to="/marca/wiese">Wiese</Link></li>
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