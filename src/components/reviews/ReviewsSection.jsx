import React, { useState } from 'react';
import ReviewStats from './ReviewStats';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import './Reviews.css';

const INITIAL_DATA = [
  { id: 1, name: "Distribuidora El Sol", date: "14/01/2025", rating: 5, comment: "Excelente servicio y tiempos de entrega." },
  { id: 2, name: "Corporación Omega", date: "10/01/2025", rating: 4, comment: "Buenos productos, atención al cliente muy profesional." },
  { id: 3, name: "Hotel Central", date: "05/01/2025", rating: 5, comment: "Los insumos de limpieza son de alta calidad, muy recomendados." },
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState(INITIAL_DATA);
  const [showForm, setShowForm] = useState(false);

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
    setShowForm(false);
  };

  return (
    <div className="opiniones-page-wrapper">
      <div className="opiniones-container-master">
        
        <div className="page-header-center">
            <h1 className="page-title">Opiniones de nuestros clientes</h1>
            <p className="page-subtitle">Nuestra prioridad es tu satisfacción. Conoce lo que dicen las empresas que ya confían en Disdel.</p>
        </div>

        <ReviewStats 
          reviews={reviews} 
          showForm={showForm} 
          onWriteReviewClick={() => setShowForm(!showForm)} 
        />

        {showForm && (
          <ReviewForm onAddReview={handleAddReview} />
        )}

        <ReviewList reviews={reviews} />
        
      </div>
    </div>
  );
};

export default ReviewsSection;