import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from 'store/useCartStore';
import { AppConfig } from 'config/AppConfig';
import { FaCheckCircle } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.css';

import defaultImg from 'assets/images/categories/KCP.jpg'

const ProductCard =memo (({ product, index }) => {
  const { IdProducto, Descripcion, Imagen, Marca, Categoria } = product;
  const addItem = useCartStore((state) => state.addItem);

  const imageUrl = (Imagen && Imagen.trim() !== "") 
    ? `${AppConfig.baseImageUrl}productos/${Imagen}` 
    : defaultImg;

    const isPriority = index< 4;

    const handlePrefetch = () => {
      if (Imagen) {
        const img = new Image();
        img.src = imageUrl;
      }
    };

  return (
    <div 
      className="product-card">
      <div className="product-brand-badge">
        <img src="disdel-logo.png" alt="Logo" className="badge-logo-img" />
      </div>
      {/* Badge de ID discreto */}
      <div className="product-id-badge">ID: {IdProducto}</div>

      {/* Todo lo de arriba es un Link al detalle */}
      <Link to={`/producto/${IdProducto.toLowerCase()}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={Descripcion} 
            className="product-image" 
            loading={isPriority ? "eager" : "lazy"} 
            decoding='async'
            width="200" 
            height="200"
            fetchpriority={isPriority ? "high" : "auto"}
          />
        </div>
        
        <div className="product-info-top">
          <span className="brand-tag">{Marca || Categoria || 'Disdel'}</span>
          <h3 className="product-title">{Descripcion}</h3>
          <span className="product-detail-id">Disdel # {IdProducto}</span>
        </div>
      </Link>

      {/* Footer del card con botón de acción */}
      <div className="product-card-footer">
        <div className="sold-by">
          <FaCheckCircle className="checkmark-icon" /> Disponible para cotizar
        </div>

        <button 
          className="quote-button" 
          onClick={(e) => {
            e.preventDefault(); // Evita navegar si haces clic en el botón
            addItem(product);
          }}
        >
          <FiShoppingCart className="cart-icon-btn" /> 
          COTIZAR
        </button>
      </div>
    </div>
  );
});

export default ProductCard;