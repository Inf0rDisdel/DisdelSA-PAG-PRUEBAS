import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; 

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './CategoryGrid.css';

import { AppConfig } from '../../../config/AppConfig';
import { useMenu } from '../../../hooks/useMenu';
import defaultIcon from 'assets/images/categories/KCP.jpg'; 

const CategoryGrid = ({isLoading}) => {
  // --- 1. TODOS LOS HOOKS ARRIBA ---
  const { data: menuData } = useMenu();
  const [sliderKey, setSliderKey] = useState(Date.now());

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
      <div className="category-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '15px', 
        padding: '20px' 
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: 'white', padding: '10px', borderRadius: '12px' }}>
            <div className="skeleton-shimmer" style={{ width: '100%', height: '100px', borderRadius: '8px' }}></div>
            <div className="skeleton-shimmer" style={{ width: '70%', height: '14px', marginTop: '10px', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  // Si no hay datos después de cargar
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
                    src={category.Imagen ? `${AppConfig.baseImageUrl}${category.Imagen}` : defaultIcon} 
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