import React from "react";
import './Ayuda.css';

// Asegúrate de que las rutas a tus iconos sean correctas
import iconMercadeo from 'assets/icons/mercadeo.png'; // Ajusta la ruta si es necesario
import iconSoporte from 'assets/icons/soporte.png';   // Ajusta la ruta si es necesario

const Ayuda = () => {
    return (
        <div className="ayuda-container">
            {/* Header alineado a la izquierda */}
            <div className="ayuda-header">
                <h1 className="ayuda-title">Centro de Ayuda</h1>
                <p className="ayuda-subtitle">Selecciona el área que deseas contactar</p>
            </div>

            <div className="ayuda-grid">
                
                {/* TARJETA 1: MERCADEO */}
                <div className="ayuda-card">
                    <div className="icon-wrapper">
                        <img src={iconMercadeo} className="ayuda-icon" alt="Mercadeo" />
                    </div>
                    
                    <div className="card-info">
                        <h3>Mercadeo</h3>
                        <p className="ayuda-text">
                            Teléfono: <strong>+502 2422-6199</strong>
                        </p>
                        <p className="ayuda-text">
                            Correo: <a href="mailto:mercadeo@disdelsa.com">mercadeo@disdelsa.com</a>
                        </p>
                        <button className="btn-minimal">Contactar</button>
                    </div>
                </div>

                {/* TARJETA 2: SOPORTE TÉCNICO */}
                <div className="ayuda-card">
                    <div className="icon-wrapper">
                        <img src={iconSoporte} className="ayuda-icon" alt="Soporte" />
                    </div>

                    <div className="card-info">
                        <h3>Soporte Técnico</h3>
                        <p className="ayuda-text">
                            Teléfono: <strong>+502 2422-6120</strong>
                        </p>
                        <p className="ayuda-text">
                            Correo: <a href="mailto:infotec@disdelsa.com">infotec@disdelsa.com</a>
                        </p>
                        <button className="btn-minimal">Contactar</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Ayuda;