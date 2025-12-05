import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './ProductCarousel.css';
import fondoImagen from 'assets/icons/FONDO.jpg';

const ProductCarousel = ({ title, products = [], addToCart }) => {
  const [favorites, setFavorites] = useState([]);

  // --- AQUÍ ESTÁ LA CONFIGURACIÓN CORREGIDA ---
  const settings = {
    dots: true,
    // Solo infinito si hay más de 4 productos, para que no brinque feo
    infinite: products && products.length > 4, 
    speed: 500,
    slidesToShow: 4, // Por defecto en PC
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Tablets y Laptops pequeñas
        settings: {
          slidesToShow: 4, // <--- 4 PRODUCTOS EN TABLET
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          infinite: products && products.length > 4
        }
      },
      {
        breakpoint: 600, // Celulares (Móvil)
        settings: {
          slidesToShow: 2, // <--- 3 PRODUCTOS EN MÓVIL
          slidesToScroll: 2,
          dots: false,
          arrows: false
        }
      }
    ]
  };

  if (!products || products.length === 0) {
    return null; 
  }

  return (
    <div className="product-carousel-container"
      style={{ 
        backgroundImage: `url(${fondoImagen})`,
        backgroundColor: '#ffffff' 
      }} 
    >
      <h2 className="carousel-title">{title}</h2>
      <Slider {...settings}>
        {products.map((product) => {
          if (!product || !product.id) return null; 
          
          return (
            <div key={product.id}>
              <div className="product-card">
                
                {/* ENLACE QUE SE COMPORTA COMO FLEX */}
                <Link 
                  to={`/producto/${product.id}`} 
                  state={{ product: product }}
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit', 
                    display: 'flex',           
                    flexDirection: 'column',   
                    flexGrow: 1,               
                    justifyContent: 'flex-start' 
                  }}
                >
                  <img src={product.image} alt={product.name} className="product-image" />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-disdel-id">{product.disdelId}</p>
                </Link>
                
                <button 
                  className="add-cart-button"
                  onClick={() => addToCart(product)}
                >
                  Agregar
                </button>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default ProductCarousel;