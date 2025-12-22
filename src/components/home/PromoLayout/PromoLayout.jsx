import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PromoLayout.css'; 

import imgPanos from 'assets/images/products/Paños de Limpieza.jpg';
import imgEsponjas3M from 'assets/images/products/Esponjas3M.jpg';
import imgAlfombras from 'assets/images/products/Alfombras.jpg';
import imgReciclaje from 'assets/images/products/Reciclaje.jpg';

const promoItems = [
  {
    id: 'Paños-de-limpieza',
    image: imgPanos,
    label: 'Paños de Limpieza',
    alt: 'Hombre usando paños de limpieza en una cocina industrial'
  },
  {
    id: 'Esponjas-3m',
    image: imgEsponjas3M,
    label: 'Esponjas3M',
    alt: 'Contenedores de reciclaje'
  },
  {
    id: 'Alfombras',
    image: imgAlfombras,
    label: 'Alfombras',
    alt: 'Alfombra gris moderna'
  },
  {
    id: 'Reciclaje',
    image: imgReciclaje,
    label: 'Reciclaje',
    alt: 'Persona limpiando'
  }
];

const PromoLayout = () => {
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    navigate(`/categoria/${id}`);
  };

  return (
    // ✅ CAMBIO 1: de 'promo-section' a 'pl-section'
    <section className="pl-section">
      
      {/* ✅ CAMBIO 2: de 'promo-grid-container' a 'pl-grid-container' */}
      <div className="pl-grid-container">
        
        {promoItems.map((item) => (
          <div 
            key={item.id}
            // ✅ CAMBIO 3: de 'promo-card' a 'pl-card'
            className="pl-card"
            onClick={() => handleItemClick(item.id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={item.image} alt={item.alt} />
            
            {/* ✅ CAMBIO 4: de 'card-label' a 'pl-card-label' */}
            <div className="pl-card-label">
              <span>{item.label}</span>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default PromoLayout;