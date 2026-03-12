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

const CategoryGrid = ({ isLoading }) => {
  const { data: menuData } = useMenu();
  const { data: bannerData } = useBanners();

  const [sliderKey, setSliderKey] = useState(Date.now());

  const defaultImage = useMemo(() => {
    const imgDb = bannerData?.ImagenPredeterminado?.find (b=> b.Titulo === "ImagenDefault");
    return imgDb ? `${AppConfig.baseImageUrl}${imgDb.Imagen}` : ''; 
  }, [bannerData]);

  // Renombramos la variable interna para que no choque con las props
  const filteredCategories = useMemo(() => {
      if (!menuData) return [];
      const excludedBrands = ['KIMBERLY', '3M', 'WIESE', 'SILVER'];
      return menuData.filter(seg => 
          !excludedBrands.some(brand => seg.NombreSegmento.toUpperCase().includes(brand))
      );
  }, [menuData]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        setSliderKey(Date.now());
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 2. HELPERS ---
  const createSlug = (text) => {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, '-'); 
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

  // --- 3. CONDICIONALES DE RENDERIZADO ---
  
  // Skeleton Loader
  if (isLoading) {
    return (
      <section className="cgs-section">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <Skeleton width="300px" height="35px" />
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px', 
          padding: '0 40px' 
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton variant="circle" width="120px" height="120px" />
              <Skeleton width="100px" height="15px" style={{ marginTop: '15px' }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!filteredCategories.length) return null;

  return (
    <section className="cgs-section">
      <h2 className="cgs-title">Categorías Destacadas</h2>
      <div className="cgs-slider">
        <Slider key={sliderKey} {...settings}>
          {filteredCategories.map((category) => (
            <div key={category.IdSegmento}>
              <Link 
                className="cgs-item" 
                to={`/categoria/${createSlug(category.NombreSegmento)}`}
              >
                <div className="cgs-image-wrapper">
                  <img 
                    src={category.Imagen ? `${AppConfig.baseImageUrl}${category.Imagen}` : defaultImage} 
                    alt={category.NombreSegmento} 
                    className="cgs-image" 
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