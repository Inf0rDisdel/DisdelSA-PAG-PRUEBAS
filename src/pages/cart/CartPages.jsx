import React from 'react';
import useCartStore from '../../store/useCartStore'; // <--- IMPORTANTE: Usamos Zustand
import CartItem from './CarItem'; 
import EmptyCartMessage from './EmptyCartMessage';
import QuoteForm from './QuoteForm'; 
import Swal from 'sweetalert2'; 
import './CartPage.css';

const CartPage = () => {
  // 1. Extraemos TODO de Zustand. Ya NO usamos props.
  const { cart, clearCart, removeFromCart, updateQuantity } = useCartStore();
  
  const isEmpty = !cart || cart.length === 0;

  const handleClearAll = () => {
    Swal.fire({
      title: '¿Vaciar lista?',
      text: "Se eliminarán todos los productos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar todo',
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
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
            {cart.map((item) => (
              <CartItem 
                key={item.id} 
                product={item} 
                // Estas funciones ahora vienen de Zustand
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>

          <div className="cart-form-column">
            <div className="sticky-form-wrapper">
                {/* QuoteForm ya no necesita props, él solo lee Zustand */}
                <QuoteForm /> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;