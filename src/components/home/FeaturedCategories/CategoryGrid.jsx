import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; 

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './CategoryGrid.css';

// 1. Imports Dinámicos
import { AppConfig } from '../../../config/AppConfig';
import { useMenu } from '../../../hooks/useMenu';

// Imagen por defecto por si alguna categoría no tiene foto en BD
import defaultIcon from 'assets/images/categories/KCP.jpg'; 

const CategoryGrid = () => {
  // 2. Traemos los datos
  const { data: menuData, isLoading } = useMenu();
  const [sliderKey, setSliderKey] = useState(Date.now());

  // 3. FILTRADO INTELIGENTE (Excluir marcas)
  const categories = useMemo(() => {
      if (!menuData) return [];
      
      // Palabras clave de las marcas que NO queremos mostrar aquí
      const excludedBrands = ['KIMBERLY', '3M', 'WIESE', 'SILVER'];

      return menuData.filter(seg => 
          !excludedBrands.some(brand => seg.NombreSegmento.toUpperCase().includes(brand))
      );
  }, [menuData]);

  // Helper para slugs (limpio y seguro)
  const createSlug = (text) => {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita tildes
        .replace(/\s+/g, '-'); // Espacios a guiones
  };

  // Fix para Slick Slider en algunos navegadores (Mantenemos tu lógica)
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

  const settings = {
    arrows: true,
    dots: true, 
    infinite: false, 
    speed: 500, 
    slidesToShow: 4, 
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 4 }
      },
      {
        breakpoint: 768, 
        settings: { slidesToShow: 4, slidesToScroll: 4, arrows: false }
      },
      {
        breakpoint: 468, 
        settings: { slidesToShow: 3, slidesToScroll: 3, arrows: false }
      }
    ]
  };

  if (isLoading) return null; // No mostramos nada mientras carga para no saltar

  return (
    <section className="cgs-section">
      
      <h2 className="cgs-title">Categorías Destacadas</h2>

      <div className="cgs-slider">
        {/* Validamos que existan categorías filtradas antes de renderizar el Slider */}
        {categories.length > 0 ? (
            <Slider key={sliderKey} {...settings}>
            {categories.map((category) => (
                <div key={category.IdSegmento}>
                <Link 
                    className="cgs-item" 
                    to={`/categoria/${createSlug(category.NombreSegmento)}`}
                >
                    <div className="cgs-image-wrapper">
                        <img 
                            // Usamos la imagen de la API + tu URL base
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
        ) : (
            <p style={{textAlign:'center'}}>No hay categorías disponibles.</p>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;