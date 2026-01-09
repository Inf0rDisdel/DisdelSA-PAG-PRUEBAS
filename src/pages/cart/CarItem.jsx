// src/pages/cart/components/CarItem.jsx
import React from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import useCartStore from 'store/useCartStore'; 
import './CarItem.css'; 

const CartItem = ({ product }) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  
  const quantity = product.quantity || 1; 

  return (
    <div className="cart-item-wrapper">
      <img src={product.image} alt={product.name} className="item-image"/>
      
      <div className="item-info">
        <span className="info-label">Descripción</span>
        <p className="item-name">{product.name}</p>
        <span className="item-id">Id#{product.id}</span>
      </div>

      <div className="item-info">
        <span className="info-label">Empaque</span>
        <p className="item-packaging">{product.packaging || 'N/A'}</p>
      </div>

      <div className="quantity-control">
        <button 
          className="quantity-btn"
          disabled={quantity <= 1} 
          onClick={() => updateQuantity(product.id, -1)}
        >
          <FiMinus />
        </button>
        
        <span className="quantity-display">{quantity}</span>

        <button 
          className="quantity-btn"
          onClick={() => updateQuantity(product.id, 1)}
        >
          <FiPlus />
        </button>
      </div>
      
      <button 
        className="delete-btn"
        onClick={() => removeFromCart(product.id)}
      >
        <FiTrash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;