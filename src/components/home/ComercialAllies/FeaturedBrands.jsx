import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedBrands.css'; 

// 1. Imports Dinámicos
import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';

const FeaturedBrands = () => {
  const { data: banners, isLoading, isError } = useBanners();

  const crearSlug = (titulo) => {
      if (!titulo) return 'marca';

      return titulo.toLowerCase().trim().replace(/\s+/g, '-');
  };


  if (isLoading || isError || !banners.aliados?.length) return null;

  return (
    <section className="featured-brands-section">
      <h2 className="section-title">Aliados Comerciales</h2>
      
      <div className="brands-container">
        
        {banners.aliados.map((ban) => (
            <Link 
                key={ban.EntityID} 
                to={`/marca/${crearSlug(ban.Titulo)}`} 
                className="brand-item"
            >
                <img 
                    src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                    alt={ban.Titulo || "Marca Aliada"} 
                />
            </Link>
        ))}

      </div>
    </section>
  );
};

export default FeaturedBrands;