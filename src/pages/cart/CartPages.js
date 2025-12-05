import React from 'react';
import Swal from 'sweetalert2'; 
import { FiTrash2 } from 'react-icons/fi'; 
import CarItem from './CarItem';  
import QuoteForm from './QuoteForm';
import EmptyCartMessage from './EmptyCartMessage';
import './CartPage.css';

const CartPage = ({ cartItems, removeFromCart, updateQuantity, clearCart }) => {

  const handleClearAllClick = () => {
    Swal.fire({
      title: '¿Eliminar todo?',
      text: "Se vaciará todo tu carrito de compras.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '¡Sí, vaciar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire(
          '¡Vaciado!',
          'El carrito ha sido vaciado.',
          'success'
        );
      }
    });
  };

  return (
    <div className="cart-page-background">
      <div className="cart-page-layout">
        <main className="cart-items-section">
          
          {/* 
              CAMBIO AQUÍ: 
              Usamos la clase "cart-header" en lugar de estilos inline 
              para poder controlarlo en móviles.
          */}
          <div className="cart-header">
            <h1 className="main-title">Carrito</h1>
            
            {cartItems && cartItems.length > 0 && (
              <button 
                onClick={handleClearAllClick}
                className="clear-cart-btn" // Nueva clase
              >
                <FiTrash2 /> Eliminar todo
              </button>
            )}
          </div>

          <div className="cart-items-container">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map(item => (
                <CarItem 
                  key={item.id} 
                  product={item} 
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              ))
            ) : (
              <EmptyCartMessage />
            )}
          </div>
        </main>
        <aside className="quote-form-section">
          <QuoteForm />
        </aside>
      </div>
    </div>
  );
};

export default CartPage;