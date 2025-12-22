import React from 'react';
import ReviewsSection from '../../components/reviews/ReviewsSection';
const OpinionesPage = () => {
  return (
    <div className="opiniones-page-background">
      <div className="opiniones-container-master">
        
        <div className="page-header-center">
          <h1 className="page-title">Experiencias de nuestros clientes</h1>
          <p className="page-subtitle">
            Tu confianza es nuestro motor. Aquí verás lo que dicen otras empresas sobre nuestro servicio.
          </p>
        </div>
        
      <ReviewsSection />
        
      </div>
    </div>
  );
};

export default OpinionesPage;