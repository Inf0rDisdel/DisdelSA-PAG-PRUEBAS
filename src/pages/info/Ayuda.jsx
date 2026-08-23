import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import './Ayuda.css';

import { AppConfig } from "config/AppConfig";
import { useBanners } from "hooks/useBanners";

const Ayuda = () => {
    const { data: bannerData } = useBanners();

    // Logotipo de respaldo predeterminado de Disdel para evitar /undefined en iconos
    const defaultIconFallback = `${AppConfig.baseImageUrl}logo-disdel.png`;

    const images = useMemo(() => {
        const getUrl = (imgName) => imgName ? `${AppConfig.baseImageUrl}${imgName}` : '';

        const iconAyuda = bannerData?.Iconos?.find(i => i.Titulo?.trim() === "IconosAyuda")?.Imagen;
        const iconAyuda2 = bannerData?.Iconos?.find(i => i.Titulo?.trim() === "iconoAyuda2")?.Imagen;

        return {
            ayuda: getUrl(iconAyuda),
            mercadeo: getUrl(iconAyuda2)
        };
    }, [bannerData]);

    return (
        <div className="ayuda-container">
            <Helmet>
                <title>Centro de Ayuda y Líneas de Asistencia | Disdel Guatemala</title>
                <meta name="description" content="¿Necesitas soporte técnico o cotizar suministros de limpieza al por mayor? Contacta a nuestro departamento de mercadeo y asistencia técnica en Guatemala." />
                <link rel="canonical" href="https://disdelsa.com/ayuda" />
                
                {/* Protocolo Open Graph de respaldo para compartir el enlace */}
                <meta property="og:title" content="Centro de Ayuda y Líneas de Asistencia | Disdel" />
                <meta property="og:description" content="Contacta a nuestro equipo técnico de suministros y mercadeo." />
                <meta property="og:image" content={images.ayuda || defaultIconFallback} />
                <meta property="og:url" content="https://disdelsa.com/ayuda" />
            </Helmet>

            {/* Header alineado a la izquierda */}
            <div className="ayuda-header">
                <h1 className="ayuda-title">Centro de Ayuda</h1>
                <p className="ayuda-subtitle">Selecciona el área que deseas contactar</p>
            </div>

            <div className="ayuda-grid">
                
                {/* TARJETA 1: MERCADEO */}
                <div className="ayuda-card">
                    <div className="icon-wrapper">
                        {/* 🚀 FIX DISEÑO: Agregada la clase 'ayuda-icon' para limitar el tamaño en la rejilla */}
                        <img 
                          src={images.ayuda || defaultIconFallback} 
                          alt="Ayuda Soporte" 
                          className="ayuda-icon"
                          width="35"
                          height="35"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultIconFallback;
                          }}
                        />
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
                        {/* 🚀 FIX DISEÑO: Agregada la clase 'ayuda-icon' para limitar el tamaño en la rejilla */}
                        <img 
                          src={images.mercadeo || defaultIconFallback} 
                          alt="Icono Mercadeo Soporte" 
                          className="ayuda-icon"
                          width="35"
                          height="35"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultIconFallback;
                          }}
                        />
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
