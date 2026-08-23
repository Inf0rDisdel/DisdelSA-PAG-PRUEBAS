import React, {useMemo} from 'react';
import './PromoNescafe.css';

import { useBanners } from '../../../hooks/useBanners';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';

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
              <OptimizedImage
                src={getDisdelImageUrl(bannerPrincipal.Imagen)}
                alt={bannerPrincipal.Titulo || "Promoción principal de Nescafé y Coffee-Mate"} 
                widths={[480, 720, 960, 1200]}
                targetWidth={1200}
                quality={75}
                sizes="(min-width: 1400px) 884px, (min-width: 801px) 65vw, calc(100vw - 16px)"
                width="850"
                height="420"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
        )}

        {bannerSecundario && (
            <div className="promo-item banner-secundario">
              <OptimizedImage
                src={getDisdelImageUrl(bannerSecundario.Imagen)}
                alt={bannerSecundario.Titulo || "Nescafé Ice"}
                widths={[360, 480, 640]}
                targetWidth={640}
                quality={75}
                sizes="(min-width: 1400px) 476px, 35vw"
                width="430"
                height="420"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
        )}

      </div>
    </div>
  );
};

export default PromoNescafe;
