import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './ProductCarousel.css';
import fondoImagen from 'assets/icons/FONDO-BLANCO.jpg';

const ProductCarousel = ({ title, products = [],isLoading, addToCart, variant = '' }) => {
   if (isLoading) {
    return (
      <div className="product-carousel-container">
        <div className="skeleton-box" style={{ width: '200px', height: '30px', borderRadius: '50px', marginBottom: '20px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[1, 2].map((n) => (
            <div key={n} className="product-card" style={{ border: '1px solid #eee' }}>
              <div className="skeleton-box" style={{ width: '100%', height: '120px', borderRadius: '10px' }}></div>
              <div className="skeleton-box" style={{ width: '80%', height: '15px', marginTop: '15px' }}></div>
              <div className="skeleton-box" style={{ width: '60%', height: '12px', marginTop: '10px' }}></div>
              <div className="skeleton-box" style={{ width: '90%', height: '40px', marginTop: 'auto', borderRadius: '8px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: products && products.length > 4, 
    speed: 500,
    slidesToShow: 4, 
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, 
          slidesToScroll: 1,
          dots: false,
          arrows: true,
          infinite: products && products.length > 3
        }
      },
      {
        breakpoint: 600, 
        settings: {
          slidesToShow: 2, 
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
    <div className={`product-carousel-container ${variant}`}
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
                
                <Link 
                  to={`/producto/${product.id}`} 
                  state={{ product: product }}
                  className='product_link'
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
                  Cotizar
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
