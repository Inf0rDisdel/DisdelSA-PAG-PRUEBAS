import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryDetail.css';

const sectionConfig = {
  "esponjas-3m": { 
    title: "Esponjas 3M", 
    color: "#EE2737",
    subcategories: ["Fibras Verdes", "Cero Rayas", "Esponjas Doble Uso"]
  },
  "panos-limpieza": { 
    title: "Paños de Limpieza", 
    color: "#007bff", 
    subcategories: ["Microfibra", "Paños Desechables", "Toallas de Cocina"]
  },
  "alfombras": { 
    title: "Alfombras", 
    color: "#545b62", 
    subcategories: ["Atrapa Humedad", "Antifatiga", "Desinfectantes"]
  },
  "reciclaje": { 
    title: "Reciclaje", 
    color: "#28a745", 
    subcategories: ["Orgánico", "Inorgánico", "Plástico", "Papel y Cartón"]
  }
};

const CategoryDetail = ({ addToCart }) => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubcat, setActiveSubcat] = useState("all");

  const config = sectionConfig[categorySlug] || { title: "Productos", color: "#135eab", subcategories: [] };

  useEffect(() => {
    setLoading(true);
    setActiveSubcat("all"); 

    setTimeout(() => {
      const dummyProducts = [
        { id: 1, name: "Producto de Ejemplo 1", category: config.title, image: "https://via.placeholder.com/300" },
        { id: 2, name: "Producto de Ejemplo 2", category: config.title, image: "https://via.placeholder.com/300" },
        { id: 3, name: "Producto de Ejemplo 3", category: config.title, image: "https://via.placeholder.com/300" },
      ];
      setProducts(dummyProducts);
      setLoading(false);
      window.scrollTo(0, 0);
    }, 800);
  }, [categorySlug, config.title]);

  return (
    <div className="cd-page-container">
      
      {/* TÍTULO DE LA PÁGINA (Sin Banner) */}
      <h1 className="cd-main-title">{config.title}</h1>

      <div className="cd-layout">
        
        {/* SIDEBAR DE CATEGORÍAS ESTILO BOTÓN */}
        <aside className="cd-sidebar">
          <span className="cd-sidebar-label">Categorías</span>
          
          <div className="cd-button-stack">
            {/* Botón de Inicio / Ver Todo */}
            <button 
              className={`cd-cat-btn ${activeSubcat === "all" ? "active" : ""}`}
              onClick={() => setActiveSubcat("all")}
            >
              <div className="cd-btn-icon">🏠</div>
              <span>Inicio</span>
            </button>

            {/* Subcategorías dinámicas */}
            {config.subcategories.map((sub, idx) => (
              <button 
                key={idx}
                className={`cd-cat-btn ${activeSubcat === sub ? "active" : ""}`}
                onClick={() => setActiveSubcat(sub)}
              >
                <div className="cd-btn-icon">📦</div>
                <span>{sub}</span>
              </button>
            ))}
          </div>

          <div className="cd-valuation">
             <span className="cd-sidebar-label">Valoración</span>
             <p className="cd-rating-row"><span>★★★★★</span> 5.0</p>
             <p className="cd-rating-row"><span>★★★★☆</span> 4.0 y más</p>
          </div>
        </aside>

        {/* GRILLA DE PRODUCTOS ESTILO LIMPIO */}
        <main className="cd-grid-area">
          <div className="cd-product-grid">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="cd-skeleton-card"></div>)
            ) : (
              products.map(prod => (
                <div key={prod.id} className="cd-product-card">
                  <div className="cd-img-wrapper">
                    <img src={prod.image} alt={prod.name} />
                  </div>
                  <div className="cd-info-wrapper">
                    <span className="cd-item-category">{prod.category}</span>
                    <h3 className="cd-item-title">{prod.name}</h3>
                    <button className="cd-view-details-btn">Ver detalles</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default CategoryDetail;