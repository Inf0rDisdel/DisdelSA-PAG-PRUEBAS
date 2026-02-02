import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from 'store/useCartStore';
import { AppConfig } from 'config/AppConfig';
import { FaCheckCircle } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { IdProducto, Descripcion, Imagen, Marca, Categoria } = product;
  const addItem = useCartStore((state) => state.addItem);

  // Ruta corregida: base + productos/ + nombre
  const imageUrl = Imagen 
    ? `${AppConfig.baseImageUrl}productos/${Imagen}` 
    : 'https://via.placeholder.com/300?text=Sin+Imagen';

  return (
    <div className="product-card">
      {/* Badge de ID discreto */}
      <div className="product-id-badge">ID: {IdProducto}</div>

      {/* Todo lo de arriba es un Link al detalle */}
      <Link to={`/producto/${IdProducto}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={Descripcion} 
            className="product-image" 
            loading="lazy" 
          />
        </div>
        
        <div className="product-info-top">
          <span className="brand-tag">{Marca || Categoria || 'Disdel'}</span>
          <h3 className="product-title">{Descripcion}</h3>
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
          COTIZAR
        </button>
      </div>
    </div>
  );
};

export default ProductCard;