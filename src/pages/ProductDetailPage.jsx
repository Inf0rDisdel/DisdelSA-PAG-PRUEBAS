import React, { useState, useEffect, useMemo, useCallback, } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 
import Skeleton from 'components/ui/Skeleton/Skeleton';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import useCartStore from 'store/useCartStore';
import { useProductDetail } from 'hooks/useProductDetail';
import { generateProductInsight } from 'utils/SEO/productDescriptions';

import { FiCheckCircle, FiPackage, FiChevronLeft, FiTarget, FiTruck, FiAward } from 'react-icons/fi';
import { createSlug } from 'utils/slugify';
import './ProductDetailPage.css';
import { getProductSchema } from 'utils/schemas/mainSchemas';
import { optimizedSeoData } from 'utils/SEO/optimizedSeo';
import RelatedProducts from 'components/products/RelatedProducts';

const ProductDetailPage = () => {
  const { id } = useParams();
  const cleanIdFromUrl = id ? String(id).trim().toLowerCase() : "";
  const canonicalId = cleanIdFromUrl; 
 
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { data: bannerData } = useBanners();
  const { data: product, isLoading, isError } = useProductDetail(id);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(''); 
  const [selectedType, setSelectedType] = useState('Y');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  const professionalInsight = useMemo(() => generateProductInsight(product), [product]);

  const legacySeoInfo = useMemo(() => {
    if (!product) return null;
    // Buscamos directamente por el ID en minúsculas (llave del objeto)
    const match = optimizedSeoData[String(product.IdProducto).toLowerCase()];
    if (!match) return null;
    
    // Mapeamos las llaves cortas (k, t, d) a nombres legibles
    return {
      keywords: match.k,
      title: match.t,
      description: match.d
    };
  }, [product]);

  const currentSlug = useMemo(() => product ? createSlug(product.Descripcion) : '', [product]);
  const currentUrl = `https://disdelsa.com/producto/${canonicalId}/${currentSlug}`;

  // 3. UNIFICACIÓN DE KEYWORDS
  const seoKeywords = useMemo(() => {
    if (!product) return "";
    const base = `${product.Categoria}, ${product.Marca}, Disdel Guatemala`;
    const extra = legacySeoInfo?.keywords || "";
    return extra ? `${base}, ${extra}` : base;
  }, [product, legacySeoInfo]);

  // 4. GENERACIÓN DEL SCHEMA
  const productImages = useMemo(() => {
      if (!product) return [];
      return product.Imagenes?.length > 0 ? product.Imagenes.filter(img => img.Imagen).map(img => img.Imagen) : [product.Imagen];
  }, [product]);

  const fullSchema = useMemo(() => {
    if (!product) return null;
    return getProductSchema(product, currentUrl, productImages, legacySeoInfo);
  }, [product, currentUrl, productImages, legacySeoInfo]);

  //---HANDLERS---
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ 
      ...product, 
      presentationSelected: selectedUnit, 
      unitType: selectedType 
    });
  };


  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    return found ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil || found.Imagen}` : '';
  }, [bannerData]);

  const getImageUrl = useCallback((imgName) => (imgName && imgName.trim() !== "") 
    ? `${AppConfig.baseImageUrl}productos/${imgName}` 
    : defaultImage, [defaultImage]);

  const hasDifferentOptions = useMemo(() => {
    if (!product || !product.Unidad || !product.Empaque) return false;
    return product.Unidad.trim().toLowerCase() !== product.Empaque.trim().toLowerCase();
  }, [product]);


  useEffect(() => {
    if (product) {
      if (!selectedImage) setSelectedImage(product.Imagen);
      if (!selectedUnit) {
        setSelectedUnit(product.Unidad || product.Empaque || 'Unidad');
        setSelectedType(product.Unidad ? 'Y' : 'N');
      }
    }
  }, [product, selectedImage, selectedUnit]);

  // if (isLoading) return <div>Cargando Producto...</div>;
  // if (isError || !product) return <div>Error al cargar producto</div>;

   if (isLoading) {
    return (
      <div className="pdp-container">
        <Skeleton width="150px" height="20px" style={{ marginBottom: '25px' }} />
        <div className="pdp-main-grid">
          <div className="pdp-gallery-wrapper">
            <div className="pdp-thumbnails-vertical">
              {[1, 2, 3].map(i => <Skeleton key={i} width="75px" height="75px" style={{ marginBottom: '12px' }} />)}
            </div>
            <div style={{ flex: 1 }}><Skeleton width="100%" height="500px" /></div>
          </div>
          <div className="pdp-info-section">
            <Skeleton width="40%" height="25px" style={{ marginBottom: '15px' }} />
            <Skeleton width="100%" height="50px" style={{ marginBottom: '25px' }} />
            <Skeleton width="100%" height="150px" style={{ marginBottom: '25px' }} />
            <Skeleton width="100%" height="100px" style={{ borderRadius: '12px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="pdp-container" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Producto no disponible actualmente</h2>
        <button className="pdp-back-btn" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const seoTitle = legacySeoInfo?.title || `Compra ${product.Descripcion} en Guatemala ${product.Marca ? '| ' + product.Marca : ''} | Disdel`;
  const seoDescription = legacySeoInfo?.description || `${product.Descripcion} en Guatemala al mejor precio con Disdel. Suministros profesionales para empresas. Categoría ${product.Categoria}.`;
  const mainImg = getImageUrl(selectedImage || product.Imagen);

  return (
    <div className="pdp-container">
    <Helmet>
    <title>{seoTitle}</title>
    <meta name="description" content={seoDescription} />
    <meta name="keywords" content={seoKeywords} />
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
              width="600" height="600" // 🚀 Atributos fijos para evitar CLS
              className={`pdp-main-img ${zoomPos.show ? 'is-zoomed' : ''}`}
              style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }}
              fetchpriority="high" // 🚀 Prioridad máxima para la imagen del producto
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
                  <span dangerouslySetInnerHTML={{ __html: `<strong>Solución Institucional:</strong> ${professionalInsight}` }} />
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

      {/* --- SECCIÓN DE ESPECIFICACIONES TÉCNICAS --- */}
      <section className="pdp-specs-section">
        <div className="pdp-specs-header">
          <span className="pdp-specs-emoji">📌</span>
          <h2>Especificaciones</h2>
        </div>
        
        <div className="pdp-specs-grid">
          <div className="spec-group">
            <div className="spec-item">
              <span className="spec-label">Empaque Individual:</span>
              <span className="spec-value">{product.Empaque || 'Sin Definir'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Empaque por caja:</span>
              <span className="spec-value">{product.EmpaqueCaja ? Number(product.EmpaqueCaja).toFixed(2) : 'Sin Definir'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Venta por Unidad:</span>
              <span className="spec-value">{product.Unidad || 'Sin Definir'}</span>
            </div>
          </div>

          <div className="spec-group">
            <div className="spec-item">
              <span className="spec-label">Marca:</span>
              <span className="spec-value">{product.Marca || 'Disdel'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Ancho:</span>
              <span className="spec-value">{product.Ancho && product.Ancho !== "0" ? product.Ancho : 'Sin Definir'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Venta por Fardo/Empaque:</span>
              <span className="spec-value">{product.Empaque || 'Sin Definir'}</span>
            </div>
          </div>

          <div className="spec-group">
            <div className="spec-item">
              <span className="spec-label">Peso:</span>
              <span className="spec-value">{product.Peso && product.Peso !== "0" ? `${product.Peso} Kg` : 'Sin Definir'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Volumen:</span>
              <span className="spec-value">{product.Volumen && product.Volumen !== "0" ? product.Volumen : 'Sin Definir'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Catálogo del Fabricante:</span>
              <span className="spec-value">{product.SkuCaja || product.IdProducto}</span>
            </div>
          </div>
        </div>
      </section>

      {product && (
        <RelatedProducts 
          category={product.Categoria} 
          currentProductId={product.IdProducto} 
          />
        )}
    </div>
  );
};

export default ProductDetailPage;