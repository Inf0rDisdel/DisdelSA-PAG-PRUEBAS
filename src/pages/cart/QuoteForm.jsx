import React, { useState } from 'react';
import useCartStore from '../../store/useCartStore'; 
import Swal from 'sweetalert2';
import './QuoteForm.css';

// 1. Configuración global del Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const EMPTY_FORM_DATA = {
  company: '',
  name: '',
  lastname: '',
  phone: '',
  email: '',
  address: '',
  nit: ''
};

const QuoteForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // 2. Consumimos Zustand
  const { cart, sendQuote } = useCartStore();

  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de carrito
    if (!cart || cart.length === 0) {
      Toast.fire({
        icon: 'warning',
        title: 'Agrega productos antes de cotizar',
        background: '#fff3cd'
      });
      return;
    }

    setLoading(true);

    try {
      // 3. Enviamos la data al Store
      const resultado = await sendQuote(formData);

      if (resultado.success) {
        const submittedData = { ...formData };
        setFormData(EMPTY_FORM_DATA);
        setLoading(false);
        onSuccess?.({
          ...resultado.confirmation,
          customerName: `${submittedData.name} ${submittedData.lastname}`.trim(),
          email: submittedData.email.trim(),
          message: resultado.message
        });
        return;
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Error al cotizar',
          text: resultado.message,
          background: '#fef2f2', 
          iconColor: '#ef4444'
        });
      }

    } catch (error) {
      console.error("Error al enviar:", error);
      Toast.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Intente más tarde',
        background: '#fef2f2',
        iconColor: '#ef4444'
      });
    }

    setLoading(false);
  };

  return (
    <div
      id="quote-form"
      className="quote-form-wrapper"
      tabIndex="-1"
      aria-labelledby="quote-form-title"
    >
      <h2 id="quote-form-title" className="form-title">Solicitud de Cotización</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="input-group">
          <label htmlFor="company">Empresa</label>
          <input 
            type="text" id="company" 
            placeholder="Nombre de su empresa" 
            value={formData.company} 
            onChange={handleChange} 
          />
        </div>

        <div className="input-group">
          <label htmlFor="nit">NIT</label>
          <input 
            type="text" id="nit" 
            placeholder="Ej: 1234567-8"
            value={formData.nit} 
            onChange={handleChange} 
          />
        </div>

        <div className="input-group">
          <label htmlFor="name">Nombre</label>
          <input 
            type="text" id="name" 
            placeholder="Ej: Juan" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="lastname">Apellido</label>
          <input 
            type="text" id="lastname" 
            placeholder="Ej: Pérez" 
            value={formData.lastname} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone">Teléfono</label>
          <input 
            type="tel" id="phone" 
            placeholder="Su número de contacto" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Correo</label>
          <input 
            type="email" id="email" 
            placeholder="su.correo@ejemplo.com" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="address">Dirección de Entrega</label>
          <textarea 
            id="address" rows="3" 
            placeholder="Detalles de la dirección" 
            value={formData.address} 
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Procesando...' : 'Enviar Cotización'}
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;
