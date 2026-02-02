import React from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import useCartStore from 'store/useCartStore'; 
import { AppConfig } from 'config/AppConfig'; // Importamos config para la URL de imagen
import './CarItem.css'; 

// Imagen default por si falla
import defaultImage from 'assets/images/categories/KCP.jpg'; 


const CartItem = ({ product }) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  
  const quantity = product.quantity || 1; 

  return (
    <div className="cart-item-wrapper">
      <img 
        src={product.Imagen ? `${AppConfig.baseImageUrl}productos/${product.Imagen}` : defaultImage} 
        alt={product.Descripcion} 
        className="item-image"
      />
      
      <div className="item-info">
        <span className="info-label">Producto</span>
        <p className="item-name">{product.Descripcion}</p>
        <span className="item-id">Cód: {product.IdProducto}</span>
      </div>

      <div className="item-info">
          <span className="info-label">Presentación Solicitada</span>
          <p className="item-packaging" style={{ color: '#135eab', fontWeight: 'bold' }}>
              {/* Aquí mostramos el valor que guardamos al agregar */}
              {product.presentationSelected}
          </p>
      </div>

      <div className="quantity-control">
        <button 
          className="quantity-btn"
          disabled={quantity <= 1} 
          onClick={() => updateQuantity(product.IdProducto, product.unitType, -1)}
        >
          <FiMinus />
        </button>
        
        <span className="quantity-display">{quantity}</span>

        <button 
          className="quantity-btn"
          onClick={() => updateQuantity(product.IdProducto, product.unitType, 1)}
        >
          <FiPlus />
        </button>
      </div>
      
      <button 
        className="delete-btn"
        onClick={() => removeFromCart(product.IdProducto, product.unitType)}
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;