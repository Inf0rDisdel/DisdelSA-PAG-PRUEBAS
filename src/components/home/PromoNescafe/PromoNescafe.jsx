import React from 'react';
import './PromoNescafe.css';

// 1. Importamos Config y Hook
import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';
const PromoNescafe = () => {
  const { data: banners, isLoading, isError } = useBanners();

  if (isLoading || isError) return null;

  const listadoPromos = banners.promoNescafe || [];

  const bannerPrincipal = listadoPromos.find(b => 
      b.Titulo?.toLowerCase().replace(/\s/g, '').includes("promocion1")
  );

  const bannerSecundario = listadoPromos.find(b => 
      b.Titulo?.toLowerCase().replace(/\s/g, '').includes("promocion2")
  );

  if (!bannerPrincipal && !bannerSecundario) return null;

  return (
    <div className="promo-nescafe-wrapper">

      <h2 className="promo-nescafe-title">
        Sabor que inspira. Nescafé y Disdel, para aquellos que saben apreciar lo mejor
      </h2>

      <div className="promo-nescafe-container">
        

        {bannerPrincipal && (
            <div className="promo-item banner-principal">
              <img 
                src={`${AppConfig.baseImageUrl}${bannerPrincipal.Imagen}`} 
                alt={bannerPrincipal.Titulo || "Promoción principal de Nescafé y Coffee-Mate"} 
              />
            </div>
        )}

        {bannerSecundario && (
            <div className="promo-item banner-secundario">
              <img 
                src={`${AppConfig.baseImageUrl}${bannerSecundario.Imagen}`} 
                alt={bannerSecundario.Titulo || "Hombre sosteniendo un frasco de Nescafé Ice"} 
              />
            </div>
        )}

      </div>
    </div>
  );
};

export default PromoNescafe;