import React, { useState } from 'react';

const ProductCard = ({ product }) => {
  const { 
    image, 
    name, 
    soldBy, 
  } = product;

  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited); 
  };

  return (
    <div className="product-card">
      
      <div className="product-card-header">
        <span></span>
       
      </div>

      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
      </div>
      
      <div className="product-card-body">
        
        <div className="sold-by">
          <span className="checkmark-icon">✔</span> Vendido por {soldBy}
        </div>

        <button className="add-to-cart-button">+ AGREGAR</button>
        
        <div className="product-name">{name}</div>
      </div>

    </div>
  );
};

export default ProductCard;