// src/components/reviews/ReviewsSection.jsx
import React, { useState } from 'react';
import ReviewStats from './ReviewStats'; // (Renombrado de ReviewState)
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import './Reviews.css';

// Datos falsos iniciales (luego esto vendría de tu API)
const INITIAL_DATA = [
  { id: 1, name: "Distribuidora El Sol", date: "14/12/2024", rating: 5, comment: "Excelente servicio y tiempos de entrega." },
  { id: 2, name: "Juan Mecánico", date: "10/12/2024", rating: 4, comment: "Buenos productos, pero la web podría ser más rápida." },
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState(INITIAL_DATA);
  const [showForm, setShowForm] = useState(false);

  // Función para agregar nueva review (se pasa al hijo Form)
  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]); // Pone la nueva arriba
    setShowForm(false); // Cierra el form
  };

  return (
    <div className="reviews-wrapper">
      {/* 1. Componente de Estadísticas */}
      <ReviewStats 
        reviews={reviews} 
        showForm={showForm} 
        onWriteReviewClick={() => setShowForm(!showForm)} 
      />

      {/* 2. Componente Formulario (Condicional) */}
      {showForm && (
        <ReviewForm onAddReview={handleAddReview} />
      )}

      {/* 3. Componente Lista */}
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ReviewsSection;