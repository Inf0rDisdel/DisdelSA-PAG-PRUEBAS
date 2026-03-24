import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 
import Skeleton from 'components/ui/Skeleton/Skeleton';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import useCartStore from 'store/useCartStore';
import { useProductDetail } from 'hooks/useProductDetail';

import { FiCheckCircle, FiPackage, FiChevronLeft, FiTarget,FiInfo, FiTruck, FiAward } from 'react-icons/fi';
import { createSlug } from 'utils/slugify';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id, slug } = useParams();
  const cleanIdFromUrl = id ? String(id).trim().toLowerCase() : "";
  const canonicalId = cleanIdFromUrl; 
 
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { data: bannerData } = useBanners();
  const { data: product, isLoading, isError } = useProductDetail(cleanIdFromUrl);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(''); 
  const [selectedType, setSelectedType] = useState('Y');

  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const currentSlug = useMemo(() => product ? createSlug(product.Descripcion) : '', [product]);
  const currentUrl = `https://disdelsa.com/producto/${canonicalId}/${currentSlug}`;

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    const fileName = found?.BannerImagenMovil || found?.Imagen;
    return fileName ? `${AppConfig.baseImageUrl}${fileName}` : '';
  }, [bannerData]);

  const getImageUrl = useCallback((imgName) => (imgName && imgName.trim() !== "") 
    ? `${AppConfig.baseImageUrl}productos/${imgName}` 
    : defaultImage, [defaultImage]);

  const productImages = useMemo(() => {
      if (!product) return [];
      if (product.Imagenes && product.Imagenes.length > 0) {
          return product.Imagenes.filter(img => img.Imagen).map(img => img.Imagen);
      }
      return product.Imagen ? [product.Imagen] : [];
  }, [product]);

  const hasDifferentOptions = useMemo(() => {
    if (!product || !product.Unidad || !product.Empaque) return false;
    return product.Unidad.trim().toLowerCase() !== product.Empaque.trim().toLowerCase();
  }, [product]);

  const fullSchema = useMemo(() => {
    if (!product) return null;
    const categoryUrl = `https://disdelsa.com/categoria/${createSlug(product.Categoria)}`;

     return {
      "@context": "https://schema.org/",
      "@graph": [
       {
        "@type": "Product",
        "name": product.Descripcion,
        "image": productImages.length > 0 ? productImages.map(img => getImageUrl(img)) : [getImageUrl(product.Imagen)],
        "description": `Cotiza ${product.Descripcion} en Disdel Guatemala. Ideal para ${product.Categoria}. Calidad institucional y venta al por mayor`,
        "sku": product.IdProducto,
        "url": currentUrl,
        "category": product.Categoria,
        "brand": { "@type": "Brand", "name": product.Marca || "Disdel" },
        "offers": {
          "@type": "Offer",
          "url": currentUrl,
          "priceCurrency": "GTQ",
          "price": product.Precio || "0.00",
          "priceValidUntil": "2026-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock",
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "GTQ" },
            "shippingDestination": [{ "@type": "DefinedRegion", "addressCountry": "GT" }],
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" },
              "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" }
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "GT",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnPeriod",
            "merchantReturnDays": 30,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          }
        }
      },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://disdelsa.com/" },
            { "@type": "ListItem", "position": 2, "name": product.Categoria, "item": categoryUrl },
            { "@type": "ListItem", "position": 3, "name": product.Descripcion, "item": currentUrl }
          ]
        }
      ]
    };
  }, [product, canonicalId, currentUrl, getImageUrl, productImages]);

useEffect(() => {
    if (product) {
      const correctSlug = createSlug(product.Descripcion);
      const correctId = String(product.IdProducto).trim().toLowerCase();
      if (slug !== correctSlug || cleanIdFromUrl !== correctId) {
        navigate(`/producto/${correctId}/${correctSlug}`, { replace: true });
      }
    }
  }, [product, slug, cleanIdFromUrl, navigate]);

  useEffect(() => {
    if (product) {
      if (!selectedImage) setSelectedImage(product.Imagen);
      if (!selectedUnit) {
        setSelectedUnit(product.Unidad || product.Empaque || 'Unidad');
        setSelectedType(product.Unidad ? 'Y' : 'N');
      }
    }
  }, [product, selectedImage, selectedUnit]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ ...product, presentationSelected: selectedUnit, unitType: selectedType });
  };

   if (isLoading) {
    return (
      <div className="pdp-container">
        {/* Botón de volver */}
        <Skeleton width="150px" height="20px" style={{ marginBottom: '25px' }} />
        
        <div className="pdp-main-grid">
          {/* Galería Skeleton */}
          <div className="pdp-gallery-wrapper">
            <div className="pdp-thumbnails-vertical">
              <Skeleton width="75px" height="75px" style={{ marginBottom: '12px' }} />
              <Skeleton width="75px" height="75px" style={{ marginBottom: '12px' }} />
              <Skeleton width="75px" height="75px" />
            </div>
            {/* Imagen Principal Skeleton */}
            <div style={{ flex: 1 }}>
               <Skeleton width="100%" height="500px" />
            </div>
          </div>

          {/* Información Skeleton */}
          <div className="pdp-info-section">
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <Skeleton width="80px" height="25px" />
                <Skeleton width="120px" height="25px" />
            </div>
            <Skeleton width="100%" height="40px" style={{ marginBottom: '15px' }} />
            <Skeleton width="200px" height="20px" style={{ marginBottom: '30px' }} />
            
            {/* Caja de descripción skeleton */}
            <Skeleton width="100%" height="150px" style={{ marginBottom: '25px' }} />
            
            {/* Presentación skeleton */}
            <Skeleton width="100%" height="60px" style={{ marginBottom: '25px' }} />
            
            {/* Botón skeleton */}
            <Skeleton width="100%" height="55px" style={{ borderRadius: '12px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) return <div className="pdp-container">Buscando producto...</div>;

  const seoTitle = `${product.Descripcion} ${product.Marca ? '| ' + product.Marca : ''} | Disdel Guatemala`;
  const mainImg = getImageUrl(selectedImage || product.Imagen);

  return (
    <div className="pdp-container">
    <Helmet>
    <title>{seoTitle}</title>
    <meta name="description" content={`Solicite cotización de ${product.Descripcion} en Guatemala. Suministro profesional para empresas. Categoría ${product.Categoria}.`} />
    <link rel="canonical" href={currentUrl} />
    <link rel="preload" as="image" href={mainImg} fetchpriority="high" />

    <meta property="og:title" content={seoTitle} />
    <meta property="og:description" content={`Distribución de ${product.Descripcion} en Guatemala. ¡Cotiza ahora con Disdel!`} />
    <meta property="og:image" content={mainImg} />
    <meta property="og:url" content={currentUrl} />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="Disdel" />

    <meta property="og:image:secure_url" content={mainImg} />

    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <meta property="product:condition" content="new" />
    <meta property="product:price:amount" content="0.00" />
    <meta property="product:price:currency" content="GTQ" />
    <meta property="product:availability" content="in stock" />
    <meta property="product:brand" content={product.Marca || "Disdel"} />

    {/* --- 3. TWITTER CARD --- */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seoTitle} />
    <meta name="twitter:description" content={`Compra ${product.Descripcion} en Disdel. Suministros industriales y de limpieza profesional.`} />
    <meta name="twitter:image" content={mainImg} />

    {fullSchema && (
          <script type="application/ld+json">{JSON.stringify(fullSchema)}</script>
        )}
      </Helmet>

      <button className="pdp-back-btn" onClick={() => navigate(-1)} aria-label="Regresar al catálogo">
        <FiChevronLeft /> Volver al catálogo
      </button>

       <div className="pdp-main-grid">
        <section className="pdp-gallery-wrapper">
          
          {/* 1. MINIATURAS (Lado izquierdo) */}
          <div className="pdp-thumbnails-vertical">
            {productImages.map((img, index) => (
              <div 
                key={index} 
                className={`pdp-thumb-item ${selectedImage === img ? 'active' : ''}`} 
                onMouseEnter={() => setSelectedImage(img)}
              >
                <img src={getImageUrl(img)} alt={`Vista ${index}`} loading='lazy' />
              </div>
            ))}
          </div>

          {/* 2. IMAGEN PRINCIPAL (Lado derecho de las miniaturas) */}
          <div 
            className="pdp-main-image-zoom-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
          >
            <img 
              src={mainImg} 
              alt={product.Descripcion} 
              className={`pdp-main-img ${zoomPos.show ? 'is-zoomed' : ''}`}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
              }}
            />
          </div>
        </section>
        
        <section className="pdp-info-section">
          <header className="pdp-header-info">
              <div className="pdp-meta-top">
                  {product.Marca && <span className="pdp-brand-tag">{product.Marca}</span>}
                  <span className="pdp-category-badge">{product.Categoria}</span>
              </div>
      
              <h1 className="pdp-title">{product.Descripcion}</h1>
              <div className="pdp-sku-row">
              <span className="pdp-sku">Código: <strong>{product.IdProducto}</strong></span>
              <span className="pdp-stock-status in-stock">
                <FiCheckCircle className="pdp-check-icon" /> Disponible 
              </span>
            </div>
          </header>

          <div className="pdp-commercial-desc-card">
             <p> 
                <FiAward className="pdp-desc-icon" /> 
                <strong>Solución Institucional:</strong> En disdel nos especializamos en el abastecimiento técnico de  <strong>{product.Descripcion}</strong> para el sector empresarial. Este artículo de la línea  <strong>{product.Categoria}</strong>ha sido seleccionada bajo riguroso estándares para garantizar la máxima eficiencia y rendimiento en las operaciones de su institución o negocio en toda Guatemala.
             </p>
             <div className="pdp-features-list">
                <span><FiTruck /> Envío a toda la República</span>
                <span><FiAward /> Garantía de Calidad Disdel</span>
             </div>
          </div>

          {hasDifferentOptions ? (
              <div className="pdp-unit-selector">
                  <label className="pdp-label">Seleccionar Presentación:</label>
                  <div className="pdp-unit-options">
                      <button className={`unit-opt ${selectedType === 'Y' ? 'active' : ''}`} onClick={() => { setSelectedUnit(product.Unidad); setSelectedType('Y'); }}>
                          <FiTarget className="icon" />
                          <div className="unit-info">
                              <span className="unit-title">Por Unidad</span>
                              <span className="unit-desc">{product.Unidad}</span>
                          </div>
                      </button>
                      <button className={`unit-opt ${selectedType === 'N' ? 'active' : ''}`} onClick={() => { setSelectedUnit(product.Empaque); setSelectedType('N'); }}>
                          <FiPackage className="icon" />
                          <div className="unit-info">
                              <span className="unit-title">Empaque / Mayoreo</span>
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
        </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;