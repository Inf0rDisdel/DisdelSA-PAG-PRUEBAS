import React from 'react';
import './QuoteForm.css';

const QuoteForm = () => {
  return (
    <div className="quote-form-wrapper">
      <h2 className="form-title">Solicitud de Cotización</h2>
      <form>
        <div className="input-group">
          <label htmlFor="company">Empresa</label>
          <input type="text" id="company" placeholder="Nombre de su empresa" />
        </div>
        <div className="input-group">
          <label htmlFor="name">Nombre</label>
          <input type="text" id="name" placeholder="Ej: Juan" />
        </div>
        <div className="input-group">
          <label htmlFor="lastname">Apellido</label>
          <input type="text" id="lastname" placeholder="Ej: Pérez" />
        </div>
        <div className="input-group">
          <label htmlFor="phone">Teléfono</label>
          <input type="tel" id="phone" placeholder="Su número de contacto" />
        </div>
        <div className="input-group">
          <label htmlFor="email">Correo</label>
          <input type="email" id="email" placeholder="su.correo@ejemplo.com" />
        </div>
        <div className="input-group">
          <label htmlFor="address">Dirección de Entrega</label>
          <textarea id="address" rows="3" placeholder="Detalles de la dirección"></textarea>
        </div>
        <button type="submit" className="submit-button">
          Enviar Cotización
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;