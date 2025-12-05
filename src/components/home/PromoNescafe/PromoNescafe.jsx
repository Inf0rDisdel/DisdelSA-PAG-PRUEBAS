import React from 'react';
import './PromoNescafe.css'; // Crearemos este archivo CSS en el siguiente paso

// Importa las imágenes de la promoción. Asegúrate de que las rutas sean correctas.
import promoPrincipalImg from 'assets/images/brands/NescafeBann.jpg'; // <-- CAMBIA ESTA RUTA
import promoSecundariaImg from 'assets/images/brands/NescafePosst.jpg'; // <-- CAMBIA ESTA RUTA

const PromoNescafe = () => {
  return (
    // Usamos un wrapper para controlar el espaciado de toda la sección
    <div className="promo-nescafe-wrapper">
    
      {/* Título de la sección */}
      <h2 className="promo-nescafe-title">
        Sabor que inspira. Nescafé y Disdel, para aquellos que saben apreciar lo mejor
      </h2>

      {/* Contenedor de las imágenes */}
      <div className="promo-nescafe-container">
        
        {/* Banner Principal (65%) */}
        <div className="promo-item banner-principal">
          <img src={promoPrincipalImg} alt="Promoción principal de Nescafé y Coffee-Mate" />
        </div>

        {/* Banner Secundario (35%) */}
        <div className="promo-item banner-secundario">
          <img src={promoSecundariaImg} alt="Hombre sosteniendo un frasco de Nescafé Ice" />
        </div>
      </div>
    </div>
  );
};

export default PromoNescafe;