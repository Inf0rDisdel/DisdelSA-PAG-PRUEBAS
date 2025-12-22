import React from 'react';
import CartItem from './CarItem'; // Verifica si es CarItem o CartItem
import EmptyCartMessage from './EmptyCartMessage';
import QuoteForm from './QuoteForm'; 
import Swal from 'sweetalert2'; 
import './CartPage.css';

// ✅ CORRECCIÓN: Cambiado de carItems a cartItems para que coincida con AppRouter
const CartPage = ({ cartItems, removeFromCart, updateQuantity, clearCart }) => {
  
  // Ahora cartItems ya no será undefined
  const isEmpty = !cartItems || cartItems.length === 0;

  const handleClearAll = () => {
    Swal.fire({
      title: '¿Vaciar lista?',
      text: "Se eliminarán todos los productos de la cotización.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0056b3',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart(); // Esta función viene de App.js
        Swal.fire({
          title: '¡Borrado!',
          text: 'Tu lista ha sido limpiada.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="cart-page-container">
      {/* 1. Encabezado dinámico */}
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
          
          {/* 2. Contenedor con Scroll para productos */}
          <div className="cart-items-scroll-container">
            {cartItems.map((item) => (
              <CartItem 
                key={item.id} 
                product={item} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* 3. Columna fija para el formulario (aparece solo si hay productos) */}
          <div className="cart-form-column">
            <div className="sticky-form-wrapper">
                <QuoteForm cartItems={cartItems} /> 
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;