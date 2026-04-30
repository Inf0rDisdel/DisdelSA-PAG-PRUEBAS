import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; 

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './FeaturedBrands.css'; 

import { AppConfig } from '../../../config/AppConfig';
import { useBanners } from '../../../hooks/useBanners';
import { createSlug } from 'utils/slugify';

const FeaturedBrands = ({ isLoading: isLoadingProp }) => {
  const { data: banners, isLoading: isLoadingBanners, isError } = useBanners();
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 480);
  
  const loading = isLoadingProp || isLoadingBanners;

  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true
  };
  
  // Skeleton Loader
  if (loading) {
    return (
      <section className="featured-brands-section">
        <div className="section-title-skeleton"></div>
        <div className='brands-container-skeleton'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="brand-item-skeleton"></div>
          ))}
        </div>
      </section>
    );
  }

  if (isError || !banners?.aliados?.length) return null;

  return (
    <section className="featured-brands-section" aria-label="Nuestras Marcas Aliadas">
      <h2 className="section-title">Aliados Comerciales</h2>
      
      <div className="brands-content-wrapper">
        {isPhone ? (
          <Slider {...settings} className="brands-phone-slider">
            {banners.aliados.map((ban, index) => (
              <div key={ban.EntityID} className="phone-slide-item">
                <Link to={`/marca/${createSlug(ban.Titulo)}`} className="phone-brand-link">
                  <img 
                    src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                    alt={`Distribuidor autorizado ${ban.Titulo}`} 
                    className="phone-brand-img"
                    loading={index < 3 ? "eager" : "lazy"} 
                    fetchpriority={index < 3 ? "high" : "low"}
                  />
                </Link>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="brands-container">
            {banners.aliados.map((ban, index) => (
                <Link 
                  key={ban.EntityID} 
                  to={`/marca/${createSlug(ban.Titulo)}`} 
                  className="brand-item"
                >
                    <img 
                      src={`${AppConfig.baseImageUrl}${ban.Imagen}`} 
                      alt={`Distribuidor autorizado ${ban.Titulo}`} 
                      loading={index < 6 ? "eager" : "lazy"} 
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