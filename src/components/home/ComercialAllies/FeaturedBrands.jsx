import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; 

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './FeaturedBrands.css'; 

import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';

const FeaturedBrands = () => {
  const { data: banners, isLoading, isError } = useBanners();
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const crearSlug = (titulo) => {
      if (!titulo) return 'marca';
      return titulo.toLowerCase().trim().replace(/\s+/g, '-');
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1,
    arrows: false
  };

  if (isLoading || isError || !banners.aliados?.length) return null;

  return (
    <section className="featured-brands-section">
      <h2 className="section-title">Aliados Comerciales</h2>
      
      <div className="brands-content-wrapper">
        {isPhone ? (
          <Slider {...settings} className="brands-phone-slider">
            {banners.aliados.map((ban) => (
              <div key={ban.EntityID} className="phone-slide-item">
                <Link to={`/marca/${crearSlug(ban.Titulo)}`} className="phone-brand-link">
                  <img 
                    src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                    alt={ban.Titulo || "Marca Aliada"} 
                    className="phone-brand-img"
                  />
                </Link>
              </div>
            ))}
          </Slider>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default FeaturedBrands;