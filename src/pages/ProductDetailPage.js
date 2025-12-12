import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiAward, FiShield, FiCreditCard } from 'react-icons/fi';
import './ProductDetailPage.css';


const ProductDetailPage = ({ addToCart }) => {
const location = useLocation();
const navigate = useNavigate();
const product = location.state?.product;


// ESTADO PARA RESEÑAS
const [reviews, setReviews] = useState([
{ id: 1, user: "Cliente Anónimo", rating: 5, comment: "Excelente producto, llegó rápido.", date: "2023-10-01", useful: 2 },
{ id: 2, user: "Juan Pérez", rating: 4, comment: "Muy bueno, aunque el empaque venía un poco golpeado.", date: "2023-10-05", useful: 0 }
]);


const [newRating, setNewRating] = useState(0);
const [newComment, setNewComment] = useState("");
if (!product) return null;
const handleSubmitReview = () => {
if (newRating === 0) return alert("Por favor califica con estrellas");
const newReviewObj = {
id: Date.now(),
user: "Usuario Nuevo",
rating: newRating,
comment: newComment,
date: new Date().toISOString().split('T')[0],
useful: 0
};
setReviews([newReviewObj, ...reviews]);
setNewComment("");
setNewRating(0);
};
return (
<div className="pdp-container">

{/* SECCIÓN SUPERIOR: IMAGEN - INFO/COMPRA - CONFIANZA */}
  <div className="pdp-main-grid">
    
    {/* COLUMNA 1: IMAGEN */}
    <div className="pdp-col-image">
      <img src={product.img || product.image} alt={product.name} className="pdp-main-img" />
    </div>

    {/* COLUMNA 2: INFO DEL PRODUCTO + BOTÓN COMPRA */}
    <div className="pdp-col-info">
      <span className="pdp-brand-label">{product.brand}</span>
      <h1 className="pdp-title">{product.name}</h1>
      
      <div className="pdp-stock-indicator">
        <span className="status-dot"></span> Disponible
      </div>

      <p className="pdp-desc-text">
        {product.description || "Descripción detallada del producto. Ideal para uso industrial y comercial, garantizando la mejor calidad."}
      </p>

      {/* MARCO DE ACCIÓN (Botón Aquí mismo) */}
      <div className="pdp-action-frame">
        <button className="pdp-add-cart-btn" onClick={() => addToCart(product)}>
          + Agregar al carrito
        </button>
        <p className="sold-by-text">Vendido y entregado por <strong>Disdel</strong></p>
      </div>
    </div>

    {/* COLUMNA 3: SIDEBAR DE CONFIANZA (Derecha) */}
    <div className="pdp-col-trust">
      <div className="trust-card">
        
        {/* ITEM 1 */}
        <div className="trust-item">
          <div className="trust-icon-wrapper"><FiAward size={22} /></div>
          <div className="trust-content">
            <strong>¿Por qué comprar en Disdel?</strong>
            <p>Más de 50 años de experiencia nos respaldan. Líderes en suministros de limpieza y mantenimiento.</p>
          </div>
        </div>
        
        <div className="divider"></div>

        {/* ITEM 2 */}
        <div className="trust-item">
          <div className="trust-icon-wrapper"><FiShield size={22} /></div>
          <div className="trust-content">
            <strong>Garantía: 15 días</strong>
            <p>Por defectos de fábrica. (No se aceptan devoluciones después de este periodo).</p>
          </div>
        </div>

        <div className="divider"></div>

        {/* ITEM 3 */}
        <div className="trust-item">
          <div className="trust-icon-wrapper"><FiCreditCard size={22} /></div>
          <div className="trust-content">
            <strong>Pagos Flexibles</strong>
            <p>Efectivo, Tarjeta y Crédito a clientes autorizados.</p>
          </div>
        </div>

      </div>
    </div>

  </div>

  {/* SECCIÓN DE ESPECIFICACIONES */}
  <div className="specs-section">
    <h2 className="section-title">Especificaciones</h2>
    <div className="specs-grid">
      <div className="spec-item"><span className="spec-label">Marca</span><span className="spec-value">{product.brand || "N/A"}</span></div>
      <div className="spec-item"><span className="spec-label">Categoría</span><span className="spec-value">{product.category || "N/A"}</span></div>
      <div className="spec-item"><span className="spec-label">Empaque Individual</span><span className="spec-value">{product.empaqueIndividual || "No aplica"}</span></div>
      <div className="spec-item"><span className="spec-label">Empaque por Caja</span><span className="spec-value">{product.empaqueCaja || "Consultar"}</span></div>
      <div className="spec-item"><span className="spec-label">Venta por Unidad</span><span className="spec-value">{product.ventaUnidad ? "Sí" : "No"}</span></div>
      <div className="spec-item"><span className="spec-label">Venta por Fardo</span><span className="spec-value">{product.ventaFardo ? "Sí" : "No"}</span></div>
      <div className="spec-item"><span className="spec-label">Peso</span><span className="spec-value">{product.peso || "-"}</span></div>
      <div className="spec-item"><span className="spec-label">SKU / Código</span><span className="spec-value">{product.id}</span></div>
    </div>
  </div>

  {/* SECCIÓN DE RESEÑAS */}
  <div className="reviews-section">
    <h2 className="section-title">Opiniones de los clientes</h2>
    <div className="review-form">
      <h4>Deja tu reseña</h4>
      <p style={{fontSize: '14px', marginBottom: '5px'}}>¿Cuántas estrellas le das?</p>
      <div className="star-input-group">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star-icon ${star <= newRating ? 'active' : ''}`} onClick={() => setNewRating(star)} style={{cursor: 'pointer', fontSize: '24px'}}>★</span>
        ))}
      </div>
      <textarea className="review-textarea" placeholder="Escribe tu opinión sobre el producto..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
      <button className="submit-review-btn" onClick={handleSubmitReview}>Publicar Opinión</button>
    </div>
    <div className="reviews-list">
      {reviews.map((rev) => (
        <div className="review-card" key={rev.id}>
          <div className="review-header"><span className="review-user">{rev.user}</span><span className="review-date">{rev.date}</span></div>
          <div className="review-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
          <p className="review-comment">{rev.comment}</p>
          <div className="review-useful"><span>¿Te fue útil? </span><span style={{fontWeight: 'bold', cursor: 'pointer'}}>Sí ({rev.useful})</span></div>
        </div>
      ))}
    </div>
  </div>
</div>
);
};
export default ProductDetailPage;