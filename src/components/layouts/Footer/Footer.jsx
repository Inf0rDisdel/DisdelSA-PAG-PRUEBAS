import React from 'react';
import './Footer.css'; 
import { Link } from 'react-router-dom';

import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

import mascotImage from 'assets/icons/PERSONAJE.png'; 
import paymentCardsImage from 'assets/icons/VISA.jpg';

const Footer = () => {
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
                            <div className="footer-column">
                                <h3>SOBRE NOSOTROS</h3>
                                <ul>
                                    <Link to="/quienes-somos" className="footer-link">
                                        Quiénes Somos
                                        </Link>
                                    <li><a href="https://disdelsagt.com/MyBusiness/Empleo/SolicitudEmpleo" target="_blank" rel="noopener noreferrer"> Empleos Disdel </a></li>
                                     <Link to="/ayuda" className="footer-link">
                                        ayuda
                                        </Link>
                                </ul>
                            </div>
                            <div className="footer-column">
                                <h3>TIENDAS Y SUCURSALES</h3>
                                <ul>
                                    <Link to="/ubicaciones" className="...">Ubicaciones</Link>
                                </ul>
                            </div>
                        </div>

                        <div className="footer-row">
                            <div className="footer-column">
                                <h3>ENCUÉNTRANOS</h3>
                                <ul className="social-links-list">
                                    <li><a href="https://www.facebook.com/Disdelsagt" target="_blank" rel="noopener noreferrer"><FaFacebookF /> Disdelsagt</a></li>
                                    <li><a href="https://www.instagram.com/disdelsagt/" target="_blank" rel="noopener noreferrer"><FaInstagram /> Disdelsagt</a></li>
                                    <li><a href="https://www.linkedin.com/company/disdelsa/" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /> Disdelsagt</a></li>
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
                        <img src={mascotImage} alt="Mascota Disdel" />
                    </div>
                        <div className="payment-logos">
                            <img src={paymentCardsImage} alt="Visa y Mastercard" />
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