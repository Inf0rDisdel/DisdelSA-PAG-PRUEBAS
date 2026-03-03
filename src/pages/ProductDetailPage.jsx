import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 

import { AppConfig } from 'config/AppConfig';
import useCartStore from 'store/useCartStore';
import { useProductDetail } from 'hooks/useProductDetail';

import { 
  FiCheckCircle, FiPackage, FiChevronLeft, FiTarget 
} from 'react-icons/fi';
import './ProductDetailPage.css';
import defaultImage from 'assets/images/KCP.webp'; 

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
 
  // 1. LIMPIEZA DE ID (Para la API usamos Mayúsculas, para SEO Minúsculas)
  const cleanId = id ? id.replace(/\/$/, "").trim().toUpperCase() : "";
  const canonicalId = id ? id.replace(/\/$/, "").trim().toLowerCase() : "";

   // Hook personalizado para traer datos
  const { data: product, isLoading, isError } = useProductDetail(cleanId);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(''); 
  const [selectedType, setSelectedType] = useState('Y');

  // --- 1. HELPERS PRIMERO (Definir antes de usar en useMemo) ---
    const getImageUrl = (imgName) => (imgName && imgName.trim() !== "") 
    ? `${AppConfig.baseImageUrl}productos/${imgName}` 
    : defaultImage;

  // --- 2. HOOKS DE LÓGICA (SIEMPRE ARRIBA) ---
  const productImages = useMemo(() => {
      if (!product) return [];
      if (product.Imagenes && product.Imagenes.length > 0) {
          return product.Imagenes.filter(img => img.Imagen).map(img => img.Imagen);
      }
      return product.Imagen ? [product.Imagen] : [];
  }, [product]);


  // --- ESTRATEGIA SEO B2B: Datos Estructurados ---
  const productSchema = useMemo(() => {
    if (!product) return null;
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": `${product.Descripcion} | Suministro Profesional Disdel`,
      "image": [getImageUrl(product.Imagen)],
      "description": `Cotización de ${product.Descripcion} para empresas. Ideal para ${product.Categoria}, lavandería y limpieza industrial en Guatemala. Venta por mayor y distribución institucional.`,
      "sku": product.IdProducto,
      "brand": { "@type": "Brand", "name": product.Marca || "Disdel" },
      "offers": {
        "@type": "Offer",
        "url": `https://www.disdelsa.com/producto/${canonicalId}`,
        "availability": "https://schema.org/InStock",
        "priceCurrency": "GTQ",
        "price": "0.00",
        "priceValidUntil": "2025-12-31",
        "description": "Precio sujeto a cotización mayorista B2B"
      }
    };
  }, [product, canonicalId]);

  const breadcrumbSchema = useMemo(() => {
    if (!product) return null;

    // Helper para crear el link de la categoría igual que en el ruteo
    const createSlug = (text) => text?.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, 'n').replace(/\s+/g, '-') || '';

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.disdelsa.com/" },
        { 
          "@type": "ListItem", 
          "position": 2, 
          "name": product.Categoria, 
          "item": `https://www.disdelsa.com/categoria/${createSlug(product.Categoria)}` 
        },
        { 
          "@type": "ListItem", 
          "position": 3, 
          "name": product.Descripcion, 
          "item": `https://www.disdelsa.com/producto/${canonicalId}` 
        }
      ]
    };
  }, [product, canonicalId]);

  const hasDifferentOptions = useMemo(() => {
    if (!product || !product.Unidad || !product.Empaque) return false;
    return product.Unidad.trim().toLowerCase() !== product.Empaque.trim().toLowerCase();
  }, [product]);

  // 1. Normalización de URL (UX/SEO): Si la URL tiene mayúsculas, la cambiamos visualmente a minúsculas
  useEffect(() => {
    if (id && id !== id.toLowerCase()) {
      navigate(`/producto/${id.toLowerCase()}`, { replace: true });
    }
  }, [id, navigate]);
  // 2. Manejo de Errores y Redirección de Rescate
  useEffect(() => {
    if (isError && cleanId) {
        console.warn("Producto no encontrado, redirigiendo a búsqueda...");
        navigate(`/buscar?q=${cleanId}`, { replace: true });
    }
  }, [isError, cleanId, navigate]);

  // 3. Selección inicial de opciones
  useEffect(() => {
    if (product) {
        if (!selectedImage) setSelectedImage(product.Imagen);
        if (!selectedUnit) {
            setSelectedUnit(product.Unidad || product.Empaque || 'Unidad');
            setSelectedType(product.Unidad ? 'Y' : 'N');
        }
    }
  }, [product, selectedImage, selectedUnit]);

  // --- 4. FUNCIONES DE ACCIÓN ---
  const handleAddToCart = () => {
    if (!product) return;
    addItem({ 
        ...product, 
        presentationSelected: selectedUnit, 
        unitType: selectedType 
    });
    /*toast.success("Agregado a la cotización");*/
  };

    // --- RENDERIZADO ---
  if (isLoading) return <div className="pdp-loading"><div className="spinner"></div></div>;
  
  // Evitamos pantalla blanca total retornando un div vacío mientras redirige el useEffect
  if (isError || !product) return <div className="pdp-container" style={{minHeight: '50vh'}}></div>;

  // --- VARIABLES DE TEXTO PARA SEO SEMÁNTICO ---
  const seoTitle = `${product.Descripcion} ${product.Marca ? '- ' + product.Marca : ''} | Cotización B2B Disdel Guatemala`;
  const seoDescription = `Solicita cotización de ${product.Descripcion}. Especialistas en suministros de ${product.Categoria.toLowerCase()}, lavandería profesional y limpieza industrial en Guatemala. Calidad Disdelsa institucional.`;

  return (
    <div className="pdp-container">
    <Helmet>
        {/* Keywords "Ocultas" (Enriquecimiento semántico vía etiquetas OG) */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={`Distribución de ${product.Descripcion} en Guatemala. Ideal para empresas, hoteles y lavanderías.`} />
        <meta property="og:image" content={getImageUrl(product.Imagen)} />
        <meta property="og:url" content={`https://www.disdelsa.com/producto/${canonicalId}`} />
        <meta property="og:type" content="product" />

        {/* 1. Básico y SEO de Google */}
        <title>{`${product.Descripcion} | Disdel`}</title>
        {/* 🔥 FIX: Canonical SIEMPRE en minúsculas y HTTPS explícito */}
        <link rel="canonical" href={`https://www.disdelsa.com/producto/${canonicalId}`} />
        <meta name="description" content={`Compra ${product.Descripcion} al mejor precio en Disdel. Suministros de limpieza profesional en Guatemala.`} />
        <link rel="preload" as="image" href={getImageUrl(selectedImage || product.Imagen)} />

        {/* 2. Open Graph / Facebook / WhatsApp (Para que se vea la foto al compartir el link) */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.Descripcion} | Disdel`} />
        <meta property="og:description" content={`Adquiere ${product.Descripcion} en nuestra tienda en línea. Calidad profesional garantizada.`} />
        <meta property="og:image" content={product.Imagen ? `${AppConfig.baseImageUrl}productos/${product.Imagen}` : 'URL_DE_TU_LOGO_POR_DEFECTO'} />
        <meta property="og:url" content={`https://www.disdelsa.com/producto/${canonicalId}`} />
        <meta property="og:site_name" content="Disdel" />

        {/* 3. Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.Descripcion} | Disdel`} />
        <meta name="twitter:description" content={`Compra ${product.Descripcion} en Disdel.`} />
        <meta name="twitter:image" content={product.Imagen ? `${AppConfig.baseImageUrl}productos/${product.Imagen}` : 'URL_DE_TU_LOGO_POR_DEFECTO'} />

        {/* 4. Datos Estructurados (Esquema de Producto) */}
        {productSchema && (
          <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        )}

        {/* 5. Datos Estructurados (Breadcrumbs) - Agregado al final */}
        {breadcrumbSchema && (
          <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        )}
      </Helmet>

      <button className="pdp-back-btn" onClick={() => navigate(-1)}>
        <FiChevronLeft /> Volver al catálogo
      </button>

      <div className="pdp-main-grid">
        <div className="pdp-gallery-section">
            <div className="pdp-main-image-wrapper">
              <img 
                    src={getImageUrl(selectedImage || product.Imagen)} 
                    alt={`${product.Descripcion} Disdel Guatemala - Suministro Institucional`} 
                    className="pdp-main-img" 
                    width="500" height="500" // Ayuda al CLS
                    fetchpriority="high"
                    loading="eager"
                />  
            </div>
            {productImages.length > 1 && (
                <div className="pdp-thumbnails">
                    {productImages.map((img, index) => (
                        <div key={index} className={`pdp-thumb ${selectedImage === img ? 'active' : ''}`} onClick={() => setSelectedImage(img)}>
                            <img src={getImageUrl(img)} alt={`Vista ${index + 1}`} loading='lazy'/>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        <div className="pdp-info-section">
          <div className="pdp-meta-top">
              <span className="pdp-brand">{product.Marca}</span>
              <span className="pdp-category-badge">{product.Categoria}</span>
          </div>

          <h1 className="pdp-title">{product.Descripcion}</h1>
          <div className="pdp-sku-row">
            <span className="pdp-sku">CÓDIGO: {product.IdProducto}</span>
            <span className="pdp-stock in-stock"><span className="dot"></span> Disponible</span>
          </div>


          {/* Bloque de texto para SEO Semántico (Visible para el usuario) */}
          <div className="pdp-seo-text">
            <p>Suministro profesional de <strong>{product.Descripcion}</strong> para industrias y comercios en Guatemala. Este producto pertenece a la línea de <strong>{product.Categoria}</strong> de Disdel, diseñado para alto rendimiento en lavanderías y mantenimiento institucional.</p>
          </div>

          {hasDifferentOptions ? (
              <div className="pdp-unit-selector">
                  <label className="pdp-label">Seleccionar Presentación:</label>
                  <div className="pdp-unit-options">
                      <button 
                        className={`unit-opt ${selectedType === 'Y' ? 'active' : ''}`} 
                        onClick={() => { setSelectedUnit(product.Unidad); setSelectedType('Y'); }}
                      >
                          <FiTarget className="icon" />
                          <div className="unit-info">
                              <span className="unit-title">Por Unidad</span>
                              <span className="unit-desc">{product.Unidad}</span>
                          </div>
                      </button>
                      <button 
                        className={`unit-opt ${selectedType === 'N' ? 'active' : ''}`} 
                        onClick={() => { setSelectedUnit(product.Empaque); setSelectedType('N'); }}
                      >
                          <FiPackage className="icon" />
                          <div className="unit-info">
                              <span className="unit-title">Por Empaque</span>
                              <span className="unit-desc">{product.Empaque}</span>
                          </div>
                      </button>
                  </div>
              </div>
          ) : (
              <div className="pdp-unit-info-single">
                  <FiCheckCircle className="icon-check" /> 
                  <span>Presentación: <strong>{selectedUnit}</strong></span>
              </div>
          )}

          <div className="pdp-action-box">
              <button className="pdp-add-btn" onClick={handleAddToCart}>AGREGAR A COTIZACIÓN</button>
              <p className="pdp-action-note">La unidad seleccionada aparecerá en su solicitud.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;