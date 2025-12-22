import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// Iconos Premium
import { FiMinus, FiPlus, FiStar, FiCheckCircle, FiShield, FiCreditCard, FiPackage, FiActivity, FiLayers, FiBox, FiShoppingBag, FiMaximize2 } from 'react-icons/fi';
import './ProductDetailPage.css';

const ProductDetailPage = ({ addToCart }) => {
  const location = useLocation();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  
  // Datos simulados de reseñas
  const [reviews, setReviews] = useState([
    { id: 1, user: "Industrias Unidas", rating: 5, comment: "El producto cumple con los estándares de calidad. Muy rendidor.", date: "12 Oct 2023" },
    { id: 2, user: "Oficinas Centrales", rating: 4, comment: "Buen servicio de entrega, el empaque llegó intacto.", date: "08 Oct 2023" }
  ]);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hoverStar, setHoverStar] = useState(0);

  if (!product) return null;

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleSubmitReview = () => {
    if (newRating === 0 || newComment.trim() === "") return;
    const newReview = {
      id: reviews.length + 1,
      user: "Usuario Verificado",
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleDateString()
    };
    setReviews([newReview, ...reviews]);
    setNewRating(0);
    setNewComment("");
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar key={i} className={`star-icon ${i < rating ? 'filled' : 'empty'}`} />
    ));
  };

  return (
    <div className="pdp-container">

      {/* =========================================
          BLOQUE 1: RESUMEN Y COTIZADOR
          ========================================= */}
      <div className="pdp-main-grid">
        
        {/* A. IMAGEN */}
        <div className="pdp-col-image">
          <img src={product.img || product.image} alt={product.name} className="pdp-main-img" />
        </div>

        {/* B. INFORMACIÓN CENTRAL & CONFIANZA */}
        <div className="pdp-col-info">
          <h1 className="pdp-title">{product.name}</h1>
          <div className="rating-sku-row">
            <div className="stars-wrapper">{renderStars(4)} <span>({reviews.length} opiniones)</span></div>
            <span className="sku-badge">SKU: {product.id || "0000"}</span>
          </div>

          <div className="stock-status">
             <span className="dot"></span> Disponible para cotización inmediata
          </div>

          <p className="short-desc">
            {/* Pequeña intro antes de los detalles completos */}
            Solución ideal para abastecimiento institucional. Producto garantizado para alto rendimiento y eficiencia en su categoría.
          </p>

          {/* --- BARRA DE CONFIANZA RENOVADA --- */}
          <div className="trust-benefits-grid">
            
            {/* 1. CALIDAD */}
            <div className="trust-benefit-item">
              <div className="benefit-icon"><FiCheckCircle /></div>
              <div className="benefit-text">
                <strong>Calidad Premium</strong>
                <p>Estándares industriales verificados.</p>
              </div>
            </div>

            {/* 2. GARANTÍA */}
            <div className="trust-benefit-item">
              <div className="benefit-icon"><FiShield /></div>
              <div className="benefit-text">
                <strong>Garantía Total</strong>
                <p>15 días de respaldo directo.</p>
              </div>
            </div>

            {/* 3. PAGOS */}
            <div className="trust-benefit-item">
              <div className="benefit-icon"><FiCreditCard /></div>
              <div className="benefit-text">
                <strong>Pago Flexible</strong>
                <p>Efectivo y Tarjetas contra entrega.</p>
              </div>
            </div>

          </div>
          {/* ----------------------------------- */}
        </div>

        {/* C. COTIZADOR (Derecha) */}
        <div className="pdp-action-frame">
          <div className="quote-header">Solicitar Cotización</div>
          <div className="quote-alert">
             Precios especiales por volumen para mayoristas y empresas.
          </div>

          <div className="qty-section">
          </div>

          <button className="btn-add-quote" onClick={() => addToCart({...product, quantity})}>
            AGREGAR A COTIZACIÓN
          </button>
          <p className="vendor-info">Vendido y distribuido por <strong>Disdel</strong></p>
        </div>

      </div>


      {/* =========================================
          BLOQUE 2: DETALLES Y CARACTERÍSTICAS
          ========================================= */}
      <div className="details-layout-grid">
        
        {/* IZQUIERDA: DESCRIPCIÓN LARGA */}
        <div className="description-col">
          <h2 className="section-heading">Descripción Detallada</h2>
          <div className="description-content">
            <p>
              {product.description || "Este producto ha sido seleccionado rigurosamente para cumplir con las exigencias del mercado profesional. Su formulación y presentación están diseñadas para optimizar costos y tiempos en operaciones de limpieza y mantenimiento. Ideal para oficinas, industrias, comercios y sector salud."}
            </p>
            <p>
              Al adquirir este producto con Disdel, garantizas el respaldo de una empresa con más de 50 años de experiencia en suministros. Aseguramos la continuidad del abastecimiento y la calidad constante en cada pedido.
            </p>
          </div>
        </div>

        {/* DERECHA: FICHA TÉCNICA (CARACTERÍSTICAS) */}
        <div className="specs-col">
          <h2 className="section-heading">Características del Producto</h2>
          <div className="specs-table">
            
            {/* 1. VENTA POR FARDO (Ya estaba) */}
            <div className="spec-row">
              <span className="spec-key"><FiPackage /> Venta por Fardo</span>
              <span className="spec-val">{product.ventaFardo ? "Disponible" : "No aplica"}</span>
            </div>

            {/* 2. MARCA (Ya estaba) */}
            <div className="spec-row">
              <span className="spec-key"><FiLayers /> Marca</span>
              <span className="spec-val highlight">{product.brand || "Genérica"}</span>
            </div>

            {/* --- NUEVO: EMPAQUE POR CAJA --- */}
            <div className="spec-row">
              <span className="spec-key"><FiBox /> Empaque por caja</span>
              <span className="spec-val">{product.empaqueCaja || "Consultar"}</span>
            </div>

            {/* --- NUEVO: VENTA POR UNIDAD --- */}
            <div className="spec-row">
              <span className="spec-key"><FiShoppingBag /> Venta por unidad</span>
              <span className="spec-val">{product.ventaUnidad ? "Sí" : "Solo por caja"}</span>
            </div>

            {/* 3. PESO (Ya estaba) */}
            <div className="spec-row">
              <span className="spec-key"><FiActivity /> Peso</span>
              <span className="spec-val">{product.peso || "N/A"}</span>
            </div>

            {/* --- NUEVO: ANCHO --- */}
            <div className="spec-row">
              <span className="spec-key"><FiMaximize2 /> Ancho</span>
              <span className="spec-val">{product.ancho || "N/A"}</span>
            </div>

            {/* 4. VOLUMEN (Ya estaba) */}
            <div className="spec-row">
              <span className="spec-key"><FiPackage /> Volumen</span>
              <span className="spec-val">{product.volumen || "N/A"}</span>
            </div>

            {/* 5. EMPAQUE INDIVIDUAL (Ya estaba) */}
            <div className="spec-row">
              <span className="spec-key"><FiCheckCircle /> Empaque Individual</span>
              <span className="spec-val">{product.empaqueIndividual || "Unidad"}</span>
            </div>

            {/* 6. CATÁLOGO (Ya estaba) */}
            <div className="spec-row">
               <span className="spec-key"><FiShield /> Catálogo Fabricante</span>
               <span className="spec-val code">{product.catalogoId || "REF-2025"}</span>
            </div>

          </div>
        </div>
      </div>


      {/* =========================================
          BLOQUE 3: COMENTARIOS Y RESEÑAS
          ========================================= */}
      <div className="reviews-wrapper">
        <h2 className="section-heading">Opiniones de Clientes</h2>
        
        <div className="reviews-split">
          
          {/* FORMULARIO */}
          <div className="review-input-box">
            <h3>Deja tu comentario</h3>
            <p>Tu opinión ayuda a otras empresas a elegir mejor.</p>
            
            <div className="star-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar 
                  key={star}
                  className={`s-star ${star <= (hoverStar || newRating) ? 'active' : ''}`}
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoverStar(star)}
                  onMouseLeave={() => setHoverStar(0)}
                />
              ))}
            </div>
            
            <textarea 
              placeholder="Escribe aquí tu experiencia con el producto..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn-submit-review" onClick={handleSubmitReview}>Publicar Reseña</button>
          </div>

          {/* LISTADO */}
          <div className="review-feed">
            {reviews.map((rev) => (
              <div className="review-bubble" key={rev.id}>
                <div className="rb-header">
                  <div className="rb-avatar">{rev.user.charAt(0)}</div>
                  <div className="rb-meta">
                    <span className="rb-user">{rev.user}</span>
                    <span className="rb-date">{rev.date}</span>
                  </div>
                </div>
                <div className="rb-stars">{renderStars(rev.rating)}</div>
                <p className="rb-text">{rev.comment}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProductDetailPage;