import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PromoLayout.css'; 

import imgPanos from 'assets/images/products/Paños de Limpieza.jpg';
import imgEsponjas3M from 'assets/images/products/Esponjas3M.jpg';
import imgAlfombras from 'assets/images/products/Alfombras.jpg';
import imgReciclaje from 'assets/images/products/Reciclaje.jpg';

const promoItems = [
  {
    id: 'panos-limpieza', // Minúsculas para coincidir con CategoryDetail
    image: imgPanos,
    label: 'Paños de Limpieza',
    alt: 'Hombre usando paños de limpieza'
  },
  {
    id: 'esponjas-3m', 
    image: imgEsponjas3M,
    label: 'Esponjas 3M',
    alt: 'Esponjas de limpieza'
  },
  {
    id: 'alfombras',
    image: imgAlfombras,
    label: 'Alfombras',
    alt: 'Alfombra gris moderna'
  },
  {
    id: 'reciclaje',
    image: imgReciclaje,
    label: 'Reciclaje',
    alt: 'Contenedores de reciclaje'
  }
];

const PromoLayout = () => {
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    // ✅ CLAVE: Navegar a /seccion/ para que AppRouter cargue CategoryDetail.jsx
    navigate(`/seccion/${id}`);
  };

  return (
    <section className="pl-section">
      <div className="pl-grid-container">
        {promoItems.map((item) => (
          <div 
            key={item.id}
            className="pl-card"
            onClick={() => handleItemClick(item.id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={item.image} alt={item.alt} />
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