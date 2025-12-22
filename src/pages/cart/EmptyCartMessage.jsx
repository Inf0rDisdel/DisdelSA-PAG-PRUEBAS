import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

import { useNavigate } from 'react-router-dom'; 
import './EmptyCartMessage.css';

const EmptyCartMessage = () => {
    const navigate = useNavigate();

    return (
        <div className="empty-cart-wrapper">
            <FiShoppingCart className="empty-cart-icon" />
            
            <h3 className="empty-cart-title">Tu Lista de cotización está vacía</h3>
            
            <p className="empty-cart-text">
                Agrega productos para solicitar tu cotización formal.
            </p>

            <button 
                className="btn-empty-back" 
                onClick={() => navigate('/')} 
            >
                Explorar Catálogo
            </button>
        </div>
    );
};

export default EmptyCartMessage;