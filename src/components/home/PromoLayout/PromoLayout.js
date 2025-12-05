import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el hook de navegación
import './PromoLayout.css'; 

// Importación de imágenes (se mantiene igual)
import imgPanos from 'assets/images/products/Paños de Limpieza.jpg';
import imgEsponjas3M from 'assets/images/products/Esponjas3M.jpg';
import imgAlfombras from 'assets/images/products/Alfombras.jpg';
import imgReciclaje from 'assets/images/products/Reciclaje.jpg';

const promoItems = [
  {
    id: 'Paños-de-limpieza', // <--- ID ÚNICO (Simulando respuesta de API)
    image: imgPanos,
    label: 'Paños de Limpieza',
    alt: 'Hombre usando paños de limpieza en una cocina industrial'
  },
  {
    id: 'Esponjas-3m', // <--- ID ÚNICO
    image: imgEsponjas3M,
    label: 'Esponjas3M',
    alt: 'Contenedores de reciclaje de colores para orgánico, plástico y vidrio'
  },
  {
    id: 'Alfombras', // <--- ID ÚNICO
    image: imgAlfombras,
    label: 'Alfombras',
    alt: 'Alfombra gris en una sala de estar moderna'
  },
  {
    id: 'Reciclaje', // <--- ID ÚNICO
    image: imgReciclaje,
    label: 'Reciclaje',
    alt: 'Persona limpiando un fregadero con esponjas 3M'
  }
];

const PromoLayout = () => {
  const navigate = useNavigate(); // 2. Inicializamos el hook

  // Función que maneja el clic
  const handleItemClick = (id) => {
    // Aquí le decimos: "Vete a la página de categoría y lleva este ID contigo"
    navigate(`/categoria/${id}`);
  };

  return (
    <section className="promo-section">
      <div className="promo-grid-container">
        {promoItems.map((item) => (
          <div 
            key={item.id} // Es mejor usar ID que index cuando datos vienen de API
            className="promo-card"
            onClick={() => handleItemClick(item.id)} // 3. Pasamos el ID al hacer clic
            style={{ cursor: 'pointer' }} // Visualmente indicamos que es clickeable
          >
            <img src={item.image} alt={item.alt} />
            <div className="card-label">
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoLayout;