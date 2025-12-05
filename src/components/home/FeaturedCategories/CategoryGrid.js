import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; 

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './CategoryGrid.css';

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
    arrows:true,
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
          arrows:false
        }
      },
         {
        breakpoint: 468, 
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows:false
        }
      }
      
    ]
  };

  return (
    <section className="category-grid-section">
      <h2 className="section-title">Categorías Destacadas</h2>

      <div className="category-slider">
        <Slider key={sliderKey} {...settings}>
          {categories.map((category) => (
            // A react-slick le gusta tener un div simple como hijo directo
            <div key={category.name}>
              <Link 
                className="category-item"
                to={`/departamento/${createSlug(category.name)}`}
              >
                <div className="category-image-wrapper">
                    <img src={category.icon} alt={category.name} className="category-image" />
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