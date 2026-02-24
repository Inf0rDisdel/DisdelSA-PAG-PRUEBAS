import React, { useState } from "react";
// Ruta corregida según tu código
import logoDisdel from 'assets/logo/disdel-logo.png'; 
import { FiShield, FiLock, FiMail, FiCheckCircle, FiChevronDown, FiChevronUp, FiTrash2 } from "react-icons/fi";
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    const [openStep, setOpenStep] = useState(1);

    const toggleStep = (step) => {
        setOpenStep(openStep === step ? null : step);
    };

    return (
        <div className="privacy-container">
            <div className="privacy-card">
                
                {/* ENCABEZADO PRINCIPAL: Icono + Logo */}
                <header className="privacy-header">
                    <div className="header-brand-row">
                        <FiShield className="main-shield-icon" />
                        <img src={logoDisdel} alt="Disdel Logo" className="header-logo-img" />
                    </div>
                    <h1>Políticas de Privacidad</h1>
                    <span className="update-badge">Actualizado 2026</span>
                </header>

                <div className="hero-banner">
                    <p>Su seguridad y confianza son nuestra prioridad.</p>
                </div>

                {/* Sección 1 */}
                <section className="info-section">
                    <div className="section-icon-side">
                        <FiShield className="section-icon" />
                    </div>
                    <div className="section-text-side">
                        <h2>Políticas de Privacidad</h2>
                        <p>En <strong>Disdelsa</strong>, protegemos su información personal y garantizamos su uso únicamente para fines autorizados. Nunca compartiremos sus datos con terceros sin su consentimiento expreso.</p>
                    </div>
                </section>

                <div className="divider"></div>

                {/* Sección 2 */}
                <section className="info-section">
                    <div className="section-icon-side">
                        <FiCheckCircle className="section-icon blue" />
                    </div>
                    <div className="section-text-side">
                        <h2>Protección de datos</h2>
                        <p>Nuestra política prohíbe estrictamente la venta o divulgación de información personal. Aplicamos medidas de seguridad de grado industrial para mantener la integridad y confidencialidad de sus datos.</p>
                    </div>
                </section>

                <div className="divider"></div>

                {/* Sección 3 */}
                <section className="info-section no-border">
                    <div className="section-icon-side">
                        <FiLock className="section-icon" />
                    </div>
                    <div className="section-text-side">
                        <h2>Eliminación de Datos</h2>
                        <p>Usted tiene el derecho de solicitar la eliminación definitiva de sus datos de nuestros registros siguiendo estos pasos:</p>
                    </div>
                </section>

                {/* Acordeón de Pasos */}
                <div className="steps-container">
                    <div className={`step-item ${openStep === 1 ? 'active' : ''}`} onClick={() => toggleStep(1)}>
                        <div className="step-header">
                            <span className="step-title-flex"><FiMail className="step-icon-small" /> Paso 1: Redactar un correo</span>
                            {openStep === 1 ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {openStep === 1 && (
                            <div className="step-content">
                                <p>Envíe un correo a <strong>informatica@disdelsa.com</strong> con el asunto <strong>"Eliminación de datos"</strong>.</p>
                            </div>
                        )}
                    </div>

                    <div className={`step-item ${openStep === 2 ? 'active' : ''}`} onClick={() => toggleStep(2)}>
                        <div className="step-header">
                            <span className="step-title-flex"><FiTrash2 className="step-icon-small" /> Paso 2: Incluir sus datos</span>
                            {openStep === 2 ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {openStep === 2 && (
                            <div className="step-content">
                                <p>Adjunte su nombre completo y el correo electrónico con el que se registró.</p>
                            </div>
                        )}
                    </div>

                    <div className={`step-item ${openStep === 3 ? 'active' : ''}`} onClick={() => toggleStep(3)}>
                        <div className="step-header">
                            <span className="step-title-flex"><FiCheckCircle className="step-icon-small" /> Paso 3: Confirmación</span>
                            {openStep === 3 ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {openStep === 3 && (
                            <div className="step-content">
                                <p>Nuestro equipo procesará su solicitud en un plazo no mayor a 48 horas hábiles.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="footer-banner">
                    <p>En Disdelsa, usted tiene el control total de su información.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;