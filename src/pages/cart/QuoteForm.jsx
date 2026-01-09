import React, { useState } from 'react';
import useCartStore from '../../store/useCartStore'; // Ajusta la ruta según tu estructura
import Swal from 'sweetalert2';
import './QuoteForm.css';

// 1. Configuración global del Toast con todas tus especificaciones visuales
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

const QuoteForm = () => {
  const [loading, setLoading] = useState(false);
  
  // 2. Consumimos Zustand: eliminamos las props del componente
  const { cart, sendQuote } = useCartStore();

  const [formData, setFormData] = useState({
    company: '',
    name: '',
    lastname: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación usando el estado global de Zustand
    if (!cart || cart.length === 0) {
      Toast.fire({
        icon: 'warning',
        title: 'Agrega productos antes de cotizar'
      });
      return;
    }

    setLoading(true);

    try {
      // 3. Enviamos la data al Store. 
      // El Store ya se encarga de usar VentasModels y llamar a la API.
      const resultado = await sendQuote(formData);

      if (resultado.success) {
        Toast.fire({
          icon: 'success',
          title: resultado.message || 'Cotización enviada correctamente',
          background: '#f0fdf4',
          iconColor: '#22c55e'
        });
        
        // Limpiamos el formulario local tras el éxito
        setFormData({ company: '', name: '', lastname: '', phone: '', email: '', address: '' });

      } else {
        Toast.fire({
          icon: 'error',
          title: 'No se pudo enviar la cotización',
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-form-wrapper">
      <h2 className="form-title">Solicitud de Cotización</h2>
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