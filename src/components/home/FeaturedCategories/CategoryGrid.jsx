import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; 

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './CategoryGrid.css';

// TUS IMÁGENES (Se mantienen igual)
import higieneIcon from 'assets/images/categories/BañosHigiene.jpg';
import limpiezaIcon from 'assets/images/categories/HerramientasPLimpieza.jpg';
import quimicosIcon from 'assets/images/categories/QuimicosLimpieza.jpg';
import EPPIcon from 'assets/images/categories/EPP.jpg';
import cafeteriaIcon from 'assets/images/categories/Cafetería.jpg';
import BotiquinIcon from 'assets/images/categories/Botiquin.jpg';
import FerreteriaIcon from 'assets/images/categories/Ferreteria.jpg';
import MaterialOficinaIcon from 'assets/images/categories/MaterialOficina.jpg';

const categories = [
  { name: 'Baños e Higiene', icon: higieneIcon },
  { name: 'Herramientas para Limpieza', icon: limpiezaIcon },
  { name: 'Químicos para Limpieza', icon: quimicosIcon },
  { name: 'EPP', icon: EPPIcon },
  { name: 'Cafetería', icon: cafeteriaIcon },
  { name: 'Ferretería', icon: FerreteriaIcon },
  { name: 'Botiquín', icon: BotiquinIcon },
  { name: 'Material de Oficina', icon: MaterialOficinaIcon },
];

const createSlug = (text) => text.toLowerCase().replace(/ /g, '-');

const CategoryGrid = () => {
  const [sliderKey, setSliderKey] = useState(Date.now());

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
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          arrows: false
        }
      },
      {
        breakpoint: 468, 
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: false
        }
      }
    ]
  };

  return (
    // 1. Clase contenedora única: cgs-section
    <section className="cgs-section">
      
      {/* 2. Título único: cgs-title */}
      <h2 className="cgs-title">Categorías Destacadas</h2>

      {/* 3. Slider wrapper único: cgs-slider */}
      <div className="cgs-slider">
        <Slider key={sliderKey} {...settings}>
          {categories.map((category) => (
            <div key={category.name}>
              <Link 
                className="cgs-item" // 4. Item único
                to={`/departamento/${createSlug(category.name)}`}
              >
                {/* 5. Wrapper de imagen único */}
                <div className="cgs-image-wrapper">
                    <img src={category.icon} alt={category.name} className="cgs-image" />
                </div>
                <p>{category.name}</p>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CategoryGrid;