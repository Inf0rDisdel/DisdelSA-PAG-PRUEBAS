import React, {useMemo} from 'react';
import './PromoNescafe.css';

import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';

const PromoNescafe = () => {
  const { data: banners, isLoading, isError } = useBanners();

  const { bannerPrincipal, bannerSecundario } = useMemo(() => {
    const listado = banners?.promoNescafe || [];
    return {
      bannerPrincipal: listado.find(b => b.Titulo?.toLowerCase().includes("promocion1")),
      bannerSecundario: listado.find(b => b.Titulo?.toLowerCase().includes("promocion2"))
    };
  }, [banners]);

  // 🚀 EVITAR CLS: Mientras carga, mostramos el espacio reservado (Skeleton)
  if (isLoading) {
    return (
      <div className="promo-nescafe-wrapper skeleton-wrapper">
         <div className="promo-nescafe-container-skeleton"></div>
      </div>
    );
  }

  if (isError || (!bannerPrincipal && !bannerSecundario)) return null;

  return (
    <div className="promo-nescafe-wrapper" aria-label='Promocion Nescafé'>
      <h2 className="promo-nescafe-title">
        Sabor que inspira. Nescafé y Disdel, para aquellos que saben apreciar lo mejor
      </h2>

      <div className="promo-nescafe-container">
        {bannerPrincipal && (
            <div className="promo-item banner-principal">
              <img 
                src={`${AppConfig.baseImageUrl}${bannerPrincipal.Imagen}`} 
                alt={bannerPrincipal.Titulo || "Promoción principal de Nescafé y Coffee-Mate"} 
                loading="lazy"
                decoding="async"
              />
            </div>
        )}

        {bannerSecundario && (
            <div className="promo-item banner-secundario">
              <img 
                src={`${AppConfig.baseImageUrl}${bannerSecundario.Imagen}`} 
                alt={bannerSecundario.Titulo || "Nescafé Ice"}
                loading="lazy"
                decoding="async" 
              />
            </div>
        )}

      </div>
    </div>
  );
};

export default PromoNescafe;