// src/pages/cart/components/EmptyCartMessage.js
import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import './EmptyCartMessage.css';

const EmptyCartMessage = () => {
    return (
        <div className="empty-cart-wrapper">
            <FiShoppingCart className="empty-cart-icon" />
            <h3 className="empty-cart-title">Tu carrito está vacío</h3>
            <p className="empty-cart-text">
                Aún no has agregado productos para cotizar. ¡Explora nuestro catálogo!
            </p>
        </div>
    );
};

export default EmptyCartMessage;