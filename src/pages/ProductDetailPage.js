import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHeart, FiChevronLeft } from 'react-icons/fi';
import './ProductDetailPage.css';

const ProductDetailPage = ({ addToCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // AQUÍ RECIBIMOS EL PRODUCTO QUE SE CLICKEÓ EN LA PÁGINA ANTERIOR
  const product = location.state?.product;

  // Si alguien intenta entrar directo por URL sin clickear un producto, lo regresamos
  if (!product) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/')} className="pdp-back-btn">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="pdp-container">
      {/* Navegación simple arriba */}
      <div className="pdp-breadcrumb">
        <span onClick={() => navigate(-1)} style={{cursor: 'pointer'}}>Volver</span> &gt; {product.category || 'Categoría'} &gt; {product.name}
      </div>

      <div className="pdp-grid">
        
        {/* 1. IMAGEN DEL PRODUCTO (Izquierda) */}
        <div className="pdp-image-section">
           {/* Si tienes una galería en el futuro, va aquí. Por ahora, la imagen principal */}
           <img src={product.image} alt={product.name} className="pdp-main-img" />
        </div>

        {/* 2. INFORMACIÓN (Centro) - SIN PRECIOS */}
        <div className="pdp-info-section">
          <span className="pdp-brand-label">Disdel</span>
          <h1 className="pdp-title">{product.name}</h1>
          
          <div className="pdp-meta">
             <span>Código: <strong>{product.id}</strong></span>
             {/* Aquí quitamos las estrellas y precios */}
          </div>

          <div className="pdp-description">
            <h3>Descripción:</h3>
            <p>{product.description || "Descripción detallada del producto disponible próximamente."}</p>
            
            {/* Si tienes empaque u otros datos en tu objeto product, úsalos aquí */}
            {product.packaging && (
              <p><strong>Empaque:</strong> {product.packaging}</p>
            )}
          </div>
        </div>

        {/* 3. CAJA DE ACCIÓN (Derecha) - ESTILO WALMART PERO SIN PRECIO */}
        <div className="pdp-action-section">
          <div className="buy-box">
            <h3 className="buy-box-header">Compra ahora este producto</h3>
            
            <div className="stock-status">
              <span className="status-dot"></span> Disponible
            </div>

            <button 
              className="pdp-add-cart-btn"
              onClick={() => addToCart(product)}
            >
              + Agregar al carrito
            </button>

            <div className="buy-box-footer">
              <small>Vendido y entregado por <strong>Disdel</strong></small>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;