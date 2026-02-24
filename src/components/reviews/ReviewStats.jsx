import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewStats = ({ reviews, onWriteReviewClick, showForm }) => {
  // Cálculo del promedio
  const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

  return (
    <div className="reviews-header">
      {/* IZQUIERDA: Números y Estrellas juntos */}
      <div className="rating-summary">
        <h2 className="big-rating">{averageRating}</h2>
        <div className="stars-container">
          <div className="stars-display">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                color={i < Math.round(averageRating) ? "#ffc107" : "#e4e5e9"} 
                size={24} 
              />
            ))}
          </div>
          <p className="total-reviews">{reviews.length} opiniones verificadas</p>
        </div>
      </div>

      {/* DERECHA: Texto persuasivo y Botón */}
      <div className="reviews-actions">
        <h3>¿Ya compraste con nosotros?</h3>
        <p>Tu opinión es vital para mantener nuestra calidad. Ayuda a otras empresas a elegir con confianza.</p>
        <button 
          className={`btn-write-review ${showForm ? 'btn-cancel' : ''}`} 
          onClick={onWriteReviewClick}
        >
          {showForm ? 'Cancelar escritura' : 'Escribir una opinión'}
        </button>
      </div>
    </div>
  );
};

export default ReviewStats;