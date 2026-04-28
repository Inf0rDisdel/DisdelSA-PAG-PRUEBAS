import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; 

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './CategoryGrid.css';

import { AppConfig } from '../../../config/AppConfig';
import { useMenu } from '../../../hooks/useMenu';
import { useBanners } from 'hooks/useBanners';
import Skeleton from 'components/ui/Skeleton/Skeleton';

const CategoryGrid = ({ isLoading: isLoadingProp }) => {
  const { data: menuData, isLoading: isLoadingMenu } = useMenu();
  const { data: bannerData, isLoading: isLoadingBanners } = useBanners();
  
  const [sliderKey, setSliderKey] = useState(Date.now());
  const loading = isLoadingProp || isLoadingMenu || isLoadingBanners;

  const defaultImage = useMemo(() => {
    const imgDb = bannerData?.ImagenPredeterminado?.find (b=> b.Titulo === "ImagenDefault");
    return imgDb ? `${AppConfig.baseImageUrl}${imgDb.Imagen}` : ''; 
  }, [bannerData]);

  const filteredCategories = useMemo(() => {
      if (!menuData) return [];
      const excludedBrands = ['KIMBERLY', '3M', 'WIESE', 'SILVER'];
      return menuData.filter(seg => 
          !excludedBrands.some(brand => seg.NombreSegmento.toUpperCase().includes(brand))
      );
  }, [menuData]);

  useEffect(() => {
    const handleResize = () => setSliderKey(Date.now());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/ñ/g, 'n') // Sincronizado
        .replace(/[^a-z0-9 -]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-'); 
  };

  const settings = {
    arrows: true,
    dots: true, 
    infinite: false, 
    speed: 500, 
    slidesToShow: 4, 
    slidesToScroll: 4,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 4, arrows:true} },
      { breakpoint: 468, settings: { slidesToShow: 3, slidesToScroll: 3, arrows: false } }
    ]
  };
  
  if (loading) {
    return (
      <section className="cgs-section" style={{ minHeight: '400px' }}>
        <h2 className="cgs-title">Categorías Destacadas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton width="100%" height="240px" style={{ borderRadius: '20px' }} />
                <Skeleton width="80%" height="20px" style={{ marginTop: '15px' }} />
              </div>
            ))}
          </div>
      </section>
    );
  }

  if (!loading && (!filteredCategories || filteredCategories.length === 0)) {
    return null;
  }

  return (
    <section className="cgs-section" style={{ minHeight: '400px' }}>
      <h2 className="cgs-title">Categorías Destacadas</h2>
      <div className="cgs-slider">
          <Slider key={sliderKey} {...settings}>
            {filteredCategories.map((category, index) => (
              <div key={category.IdSegmento}>
                <Link className="cgs-item" to={`/categoria/${createSlug(category.NombreSegmento)}`}>
                  <div className="cgs-image-wrapper">
                    <img 
                      src={category.Imagen ? `${AppConfig.baseImageUrl}${category.Imagen}` : defaultImage} 
                      alt={category.NombreSegmento} 
                      className="cgs-image" 
                      loading={index < 4 ? "eager" : "lazy"} 
                      decoding="async"
                      // ✅ CORRECCIÓN: Minúsculas para evitar Warning de React
                      fetchpriority={index < 4 ? "high" : "low"} 
                    />
                  </div>
                  <p>{category.NombreSegmento}</p>
                </Link>
              </div>
            ))}
          </Slider>
      </div>
    </section>
  );
};

export default CategoryGrid;