import React from 'react';
import useCartStore from 'store/useCartStore';
import CartItem from './CarItem';
import EmptyCartMessage from './EmptyCartMessage';
import QuoteForm from './QuoteForm';
import Swal from 'sweetalert2';
import './CartPage.css';

const CartPage = () => {
  const { cart, clearCart, _hasHydrated } = useCartStore();

  if (!_hasHydrated) {
    return <div className="pdp-loading">Cargando tu lista...</div>;
  }

  const isEmpty = !cart || cart.length === 0;

  const handleClearAll = () => {
    Swal.fire({
      title: '¿Vaciar lista?',
      text: "Se eliminarán todos los productos de tu cotización.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire('¡Listo!', 'Tu lista ha sido vaciada.', 'success');
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
            🗑️ Vaciar Lista
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
                /* 🔥 Mantenemos la llave única por producto y unidad */
                key={`${item.IdProducto}-${item.unitType}`} 
                product={item} 
              />
            ))}
          </div>

          <div className="cart-form-column">
            <div className="sticky-form-wrapper">
                <QuoteForm /> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;