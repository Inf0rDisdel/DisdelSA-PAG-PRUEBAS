import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // 1. Importación de Helmet
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

  // Limpiamos la descripción para el meta tag (quitamos posibles etiquetas o limitamos caracteres)
  const metaDescription = product.description 
    ? product.description.substring(0, 160) 
    : `Compra ${product.name} en Disdel. Calidad garantizada para abastecimiento institucional e industrial.`;

  return (
    <div className="pdp-container">
      {/* 2. SEO DINÁMICO: Esto cambia según el producto que cargue */}
      <Helmet>
        <title>{`${product.name} | Disdel`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${product.name}, ${product.brand}, Disdel, suministros industriales`} />

        {/* Open Graph para Redes Sociales (WhatsApp, FB) */}
        <meta property="og:title" content={`${product.name} | Disdel`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={product.img || product.image} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Disdel" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | Disdel`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={product.img || product.image} />
      </Helmet>

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
            Solución ideal para abastecimiento institucional. Producto garantizado para alto rendimiento y eficiencia en su categoría.
          </p>

          <div className="trust-benefits-grid">
            <div className="trust-benefit-item">
              <div className="benefit-icon"><FiCheckCircle /></div>
              <div className="benefit-text">
                <strong>Calidad Premium</strong>
                <p>Estándares industriales verificados.</p>
              </div>
            </div>

            <div className="trust-benefit-item">
              <div className="benefit-icon"><FiShield /></div>
              <div className="benefit-text">
                <strong>Garantía Total</strong>
                <p>15 días de respaldo directo.</p>
              </div>
            </div>

            <div className="trust-benefit-item">
              <div className="benefit-icon"><FiCreditCard /></div>
              <div className="benefit-text">
                <strong>Pago Flexible</strong>
                <p>Efectivo y Tarjetas contra entrega.</p>
              </div>
            </div>
          </div>
        </div>

        {/* C. COTIZADOR (Derecha) */}
        <div className="pdp-action-frame">
          <div className="quote-header">Solicitar Cotización</div>
          <div className="quote-alert">
             Precios especiales por volumen para mayoristas y empresas.
          </div>

          <button className="btn-add-quote" onClick={() => addToCart({...product, quantity})}>
            AGREGAR A COTIZACIÓN
          </button>
          <p className="vendor-info">Vendido y distribuido por <strong>Disdel</strong></p>
        </div>
      </div>

      {/* BLOQUE 2: DETALLES... (Resto del código igual) */}
      <div className="details-layout-grid">
        {/* ... tu código de descripción y ficha técnica ... */}
        <div className="description-col">
          <h2 className="section-heading">Descripción Detallada</h2>
          <div className="description-content">
            <p>
              {product.description || "Este producto ha sido seleccionado rigurosamente para cumplir con las exigencias del mercado profesional..."}
            </p>
          </div>
        </div>

        <div className="specs-col">
          <h2 className="section-heading">Características del Producto</h2>
          <div className="specs-table">
            <div className="spec-row">
              <span className="spec-key"><FiPackage /> Venta por Fardo</span>
              <span className="spec-val">{product.ventaFardo ? "Disponible" : "No aplica"}</span>
            </div>
            {/* ... resto de las filas de specs ... */}
            <div className="spec-row">
              <span className="spec-key"><FiLayers /> Marca</span>
              <span className="spec-val highlight">{product.brand || "Genérica"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: COMENTARIOS... (Resto del código igual) */}
      <div className="reviews-wrapper">
        {/* ... tu código de reseñas ... */}
      </div>
    </div>
  );
};

export default ProductDetailPage;