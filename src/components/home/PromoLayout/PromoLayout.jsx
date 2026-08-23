import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PromoLayout.css';

import { useBanners } from '../../../hooks/useBanners';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';

const PromoLayout = () => {
  const navigate = useNavigate();
  const { data: banners, isLoading, isError } = useBanners();

  // 🔥 1. MAPA DE REDIRECCIÓN
  // Aquí configuramos a mano a dónde debe ir cada título exacto.
  // "segment": Es la URL del departamento (ej: herramientas-para-limpieza).
  // "catId": Es el ID numérico de la categoría que quieres activar.
  const LINK_MAP = {
      // Estos van para MARCA
      "Paños de Limpieza": { type: "marca", segment: "kimberly-clark-professional/panos-wypall-kcp", catId: 2266 },
      "Esponjas 3M":       { type: "marca", segment: "3m/esponjas-de-limpieza-3m", catId: 2275 },
      
      // Estos van para CATEGORIA normal
      "Reciclaje":         { type: "categoria", segment: "herramientas-para-limpieza/basura-y-reciclaje", catId: 2153 },
      "Alfombras":         { type: "categoria", segment: "herramientas-para-limpieza/alfombras", catId: 2151 },
  };

  const handleItemClick = (title) => {
    const config = LINK_MAP[title];

    if (config) {
        // Navega dinámicamente según el 'type' definido (marca o categoria)
        navigate(`/${config.type}/${config.segment}`);
    } else {
        // Caso por defecto si no está en el mapa
        const slug = title.toLowerCase().trim().replace(/\s+/g, '-');
        navigate(`/categoria/${slug}`);
    }
  };

  if (isLoading || isError || !banners.promoGrid?.length) return null;

  return (
    <section className="pl-section">
      <div className="pl-grid-container">
        {banners.promoGrid.map((ban) => (
          <div
            key={ban.EntityID}
            className="pl-card"
            onClick={() => handleItemClick(ban.Titulo)}
            style={{ cursor: 'pointer' }}
          >
            <OptimizedImage
                src={getDisdelImageUrl(ban.Imagen)}
                alt={ban.Titulo || "Promoción"}
                widths={[240, 360, 480]}
                targetWidth={480}
                quality={76}
                sizes="(min-width: 1400px) 335px, (min-width: 501px) 25vw, 50vw"
                width="325"
                height="250"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
            />
            <div className="pl-card-label">
              <span>{ban.Titulo}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoLayout;
