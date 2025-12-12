import React from 'react';
import './AboutUs.css'; 

import imgDisdel from '../../assets/images/banners/BANNER-ASI-DE-LIMPIO.jpeg'; 
import imgVision from 'assets/images/banners/Visión.jpg'
import imgMision from 'assets/images/banners/Misión.jpg'
import imgPlanta from '../../assets/images/banners/Disdel-Plsnts.jpg'; 
import imgCentral from '../../assets/images/banners/Disdel-Central.jpg';

const AboutUs = () => {
  return (
    <div className="about-page-container">
      <div className="main-layout-container">
        
        {/* 1. TÍTULO */}
        <div className="about-header">
            <h1>Orgullosos de nuestra historia</h1>
        </div>

        {/* 2. HISTORIA (Texto) */}
        <div className="content-block">
             <h2>Nuestra Historia</h2>
                  <p>
                    En los años 70, nuestro fundador, <strong>Silverio de León Chay</strong>, 
                    tomó la valiente decisión de dejar su hogar y familia en el departamento de Quiché
                    para buscar una mejor oportunidad en la ciudad de Guatemala. Con determinación y esfuerzo,
                    inició su negocio vendiendo productos de limpieza de puerta en puerta.
                  </p>
                  <p>
                    Con el tiempo, su esposa <strong>Candelaria López Morales</strong> y sus hijos se unieron a él en esta aventura, 
                    trabajando juntos para hacer crecer la empresa. En 1975, nació "Distribuidora de León", 
                    ubicada en la 15 Calle 16-30, Zona 1 de la ciudad.
                  </p>
                  <p>
                    A lo largo de los años, nuestra empresa ha crecido y evolucionado, y en el 2006, 
                    decidimos dar un paso más y convertirnos en <strong>DISDEL, S.A.</strong> Hoy en día, somos líderes en la comercialización
                    y distribución de suministros de limpieza, mantenimiento y equipo de protección personal, y nos enorgullece
                    ser el <strong>Distribuidor #1 en la marca KIMBERLY CLARK</strong>.
                  </p>
        </div>

        {/* 3. BANNER GRANDE (Tamaño Original) */}
        {/* Ya no está en la grid pequeña, ahora ocupa todo el ancho real */}
        <div className="full-banner-container">
            <img src={imgDisdel} alt="Banner Historia" />
        </div>

        {/* 4. POR QUÉ COMPRAR EN DISDEL */}
        <div className="content-block why-buy">
            <h2 className="section-title">¿Por qué comprar en Disdel?</h2>
            <ul className="benefits-list">
                <li>✅ <strong>Experiencia:</strong> Más de 40 años en el mercado nos respaldan.</li>
                <li>✅ <strong>Calidad:</strong> Distribuidores autorizados de marcas mundiales (3M, Kimberly Clark).</li>
                <li>✅ <strong>Servicio:</strong> Asesoría personalizada para optimizar tu presupuesto de higiene.</li>
                <li>✅ <strong>Cobertura:</strong> Llegamos a donde tu empresa lo necesite.</li>
            </ul>
        </div>

        {/* 5. VISIÓN (Imagen al lado) */}
        <div className="vm-flex-row">
            {/* Imagen Pequeña a la izquierda */}
            <div className="vm-small-img">
                <img src={imgVision} alt="Visión Icono" /> {/* Cambia esta imagen por tu icono */}
            </div>
            {/* Texto a la derecha */}
            <div className="vm-text-side">
                <h2>Nuestra Visión</h2>
                <p>
                    Ser líderes absolutos en suministrar productos de limpieza, mantenimiento y EPP 
                    a nivel empresarial e industrial en toda la región Centroamericana.
                </p>
            </div>
        </div>

        {/* 6. MISIÓN (Imagen al lado) */}
        <div className="vm-flex-row">
             {/* Imagen Pequeña a la izquierda */}
             <div className="vm-small-img">
                <img src={imgMision} alt="Misión Icono" /> {/* Cambia esta imagen por tu icono */}
            </div>
            {/* Texto a la derecha */}
            <div className="vm-text-side">
                <h2>Nuestra Misión</h2>
                <p>
                    Abastecer a cada socio comercial con productos garantizados que agreguen valor 
                    a sus instalaciones, brindando un servicio personalizado.
                </p>
            </div>
        </div>

        {/* 7. SECCIÓN EXTRA: NUESTRO EQUIPO */}
        <div className="gallery-section" style={{marginTop: '60px'}}>
            <h3 className="gallery-title">Nuestro Equipo e Instalaciones Hoy</h3>
            <div className="images-grid-3">
                <img src={imgPlanta} alt="Equipo Actual" />
                <img src={imgCentral} alt="Equipo Actual" />
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;