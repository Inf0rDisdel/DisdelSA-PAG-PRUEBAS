import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PromoLayout.css';

// Imports
import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';

const PromoLayout = () => {
  const navigate = useNavigate();
  const { data: banners, isLoading, isError } = useBanners();

  // 🔥 1. MAPA DE REDIRECCIÓN
  // Aquí configuramos a mano a dónde debe ir cada título exacto.
  // "segment": Es la URL del departamento (ej: herramientas-para-limpieza).
  // "catId": Es el ID numérico de la categoría que quieres activar.
  const LINK_MAP = {
      // Estos van para MARCA
      "Paños de Limpieza": { type: "marca", segment: "kimberly-clark-professional", catId: 2266 },
      "Esponjas 3M":       { type: "marca", segment: "3m", catId: 2275 },
      
      // Estos van para CATEGORIA normal
      "Reciclaje":         { type: "categoria", segment: "herramientas-para-limpieza", catId: 2153 },
      "Alfombras":         { type: "categoria", segment: "herramientas-para-limpieza", catId: 2151 },
  };

  const handleItemClick = (title) => {
    const config = LINK_MAP[title];

    if (config) {
        // Navega dinámicamente según el 'type' definido (marca o categoria)
        navigate(`/${config.type}/${config.segment}`, { 
            state: { preSelectedCatId: config.catId } 
        });
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
            <img
                src={`${AppConfig.baseImageUrl}${ban.Imagen}`}
                alt={ban.Titulo || "Promoción"}
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