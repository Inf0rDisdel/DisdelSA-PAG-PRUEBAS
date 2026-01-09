import React from 'react';
import CartItem from './CarItem'; 
import EmptyCartMessage from './EmptyCartMessage';
import QuoteForm from './QuoteForm'; 
import Swal from 'sweetalert2'; 
import './CartPage.css';

const CartPage = ({ cartItems, removeFromCart, updateQuantity, clearCart }) => {
  
  const isEmpty = !cartItems || cartItems.length === 0;

  // 1. ALERTA PARA VACIAR TODO 
  const handleClearAll = () => {
    Swal.fire({
      title: '¿Vaciar lista?',
      text: "Se eliminarán todos los productos de la cotización.",
      icon: 'warning',
      iconColor: '#f8bb86',
      width: '350px',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0056b3',
      cancelButtonColor: '#e2e8f0',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-text',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        // Toast rápido de éxito
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Lista vaciada correctamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar:true
        });
      }
    });
  };

  return (
    <div className="cart-page-container">
      <div className="cart-header-flex">
        <h1 className="cart-page-title">
          {isEmpty ? 'Estado de la Solicitud' : 'Mi Lista de Cotización'}
        </h1>
        {!isEmpty && (
          <button className="clear-all-btn" onClick={handleClearAll}>
            🗑️ Eliminar todo
          </button>
        )}
      </div>

      {isEmpty ? (
        <EmptyCartMessage />
      ) : (
        <div className="cart-content-grid">
          <div className="cart-items-scroll-container">
            {cartItems.map((item) => (
              <CartItem 
                key={item.id} 
                product={item} 
                // Usamos la nueva función con alerta en lugar de removeFromCart directo
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>

          <div className="cart-form-column">
            <div className="sticky-form-wrapper">
                <QuoteForm cartItems={cartItems} clearCart={clearCart} /> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;