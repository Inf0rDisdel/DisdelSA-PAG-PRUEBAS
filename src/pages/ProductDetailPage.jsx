import React, { useState, useEffect, useMemo, useCallback, } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 
import './ProductDetailPage.css';
import ProductDetailSkeleton from 'components/ui/Skeleton/ProductDetailSkeleton';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import useCartStore from 'store/useCartStore';
import { useProductDetail } from 'hooks/useProductDetail';
import { generateProductInsight, generateProductSeoDescription } from 'utils/SEO/productDescriptions';

import { FiCheckCircle, FiPackage, FiChevronLeft, FiTarget, FiTruck, FiAward } from 'react-icons/fi';
import { createSlug } from 'utils/slugify';

import { getProductSchema } from 'utils/schemas/mainSchemas';
import { optimizedSeoData } from 'utils/SEO/optimizedSeo';
import RelatedProducts from 'components/products/RelatedProducts';

const ProductDetailPage = () => {
  const { id, slug } = useParams();
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

  const professionalInsight = useMemo(() => 
    generateProductInsight(product), 
  [product]);

  const activeSeoInfo = useMemo(() => {
    if (!product) return null;

    // Leemos de forma segura el objeto de metadatos devuelto por la API
    const dbSeo = product.seo || product.Seo;

    // Si la base de datos ya tiene metadatos configurados, los usamos
    if (dbSeo && (dbSeo.titlePage || dbSeo.typePage || dbSeo.keywords || dbSeo.Tags || dbSeo.tags)) {
      return {
        title: dbSeo.titlePage || "",
        description: dbSeo.typePage || "",
        keywords: dbSeo.keywords || "",
        tags: dbSeo.Tags || dbSeo.tags || ""
      };
    }

    // Si la base de datos no tiene datos de SEO aún, caemos en el respaldo estático
    const match = optimizedSeoData[String(product.IdProducto).toLowerCase()];
    if (match) {
      return {
        title: match.t,
        description: match.d,
        keywords: match.k,
        tags: ""
      };
    }

    // Fallback de seguridad por defecto para productos nuevos sin configurar
    return {
      title: `Compra ${product.Descripcion} en Guatemala ${product.Marca ? '| ' + product.Marca : ''} | Disdel`,
      description: product.DescripcionAux || product.DescripcionLarga || product.Descripcion,
      keywords: `${product.Categoria}, ${product.Marca}, Disdel Guatemala`,
      tags: ""
    };
  }, [product]);

  const seoTitle = useMemo(() => {
    return activeSeoInfo?.title || `Compra ${product?.Descripcion} en Guatemala ${product?.Marca ? '| ' + product.Marca : ''} | Disdel`;
  }, [activeSeoInfo, product]);

  const seoLongDescription = useMemo(() => {
    return activeSeoInfo?.description || generateProductSeoDescription(product, { description: activeSeoInfo?.description });
  }, [product, activeSeoInfo]);

  const currentSlug = useMemo(() => product ? createSlug(product.Descripcion) : '', [product]);
  const currentUrl = `https://disdelsa.com/producto/${canonicalId}/${currentSlug}`;

  // 3. UNIFICACIÓN DE KEYWORDS
  const seoKeywords = useMemo(() => {
    if (!product) return "";
    const base = `${product.Categoria}, ${product.Marca}, Disdel Guatemala`;
    const dbKeywords = activeSeoInfo?.keywords || "";
    const dbTags = activeSeoInfo?.tags || "";

    // Concatenamos las Keywords base de la base de datos con los nuevos Tags químicos/industriales
    const extra = [dbKeywords, dbTags].filter(Boolean).join(", ");
    return extra ? `${base}, ${extra}` : base;
  }, [product, activeSeoInfo]);

  // 4. GENERACIÓN DEL SCHEMA
  const productImages = useMemo(() => {
      if (!product) return [];
      return product.Imagenes?.length > 0 ? product.Imagenes.filter(img => img.Imagen).map(img => img.Imagen) : [product.Imagen];
  }, [product]);

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    return found ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil || found.Imagen}` : '';
  }, [bannerData]);

  const fullSchema = useMemo(() => {
    if (!product || activeSeoInfo) return null;

    // Mapeamos los datos al formato que espera tu función getProductSchema (t, d, k)
    const legacyFormat = {
      t: seoTitle,
      d: seoLongDescription,
      k: seoKeywords
    };

    return getProductSchema(product, currentUrl, productImages, legacyFormat, defaultImage);
  }, [product, currentUrl, productImages, activeSeoInfo, seoTitle, seoLongDescription, seoKeywords, defaultImage]);

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

  const getImageUrl = useCallback((imgName) => (imgName && imgName.trim() !== "") 
    ? `${AppConfig.baseImageUrl}productos/${imgName}` 
    : defaultImage, [defaultImage]);

  const hasDifferentOptions = useMemo(() => {
    if (!product || !product.Unidad || !product.Empaque) return false;
    return product.Unidad.trim().toLowerCase() !== product.Empaque.trim().toLowerCase();
  }, [product]);

  useEffect(() => {
    // Solo actuamos si el objeto 'product' existe y tiene datos
    if (product) {
      // 1. Reset de Imagen: Forzamos la imagen principal del nuevo producto
      setSelectedImage(product.Imagen);

      // 2. Reset de Unidades: Calculamos la unidad inicial del nuevo producto
      const initialUnit = product.Unidad || product.Empaque || 'Unidad';
      setSelectedUnit(initialUnit);
      setSelectedType(product.Unidad ? 'Y' : 'N');

      // 3. 🚀 EXPERIENCIA SENIOR: Scroll al inicio
      // Como venimos de hacer clic en un producto que estaba abajo (relacionados),
      // debemos subir al usuario al inicio de la página para que vea el nuevo detalle.
      window.scrollTo(0, 0);
    }
  }, [product]); 

  useEffect(() => {
    if (product) {
      const correctSlug = createSlug(product.Descripcion);

      //REEDIRECCIÓN AUTOMATICA SEO: si el slug en la URL no existe o es diferente al correcto.
      //Reedirigimos al isntante a la URL mejorada y limpia. Esto sana las URLs de Google.
      if (!slug || slug !== correctSlug) {
        navigate(`/producto/${String(product.IdProducto).trim().toLowerCase()}/${correctSlug}`, { replace: true });
      }
    }
  },[product, slug, navigate])
 
  // if (isLoading) return <div>Cargando Producto...</div>;
  // if (isError || !product) return <div>Error al cargar producto</div>;

  if (isLoading) {
    return <ProductDetailSkeleton />; // 🚀 Reutilización limpia de código
  }

  if (isError || !product) {
    return (
      <div className="pdp-container" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Producto no disponible actualmente</h2>
        <button className="pdp-back-btn" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const mainImg = getImageUrl(selectedImage || product.Imagen);
  // const seoKeywords = legacySeoInfo?.keywords || `${product.Categoria}, ${product.Marca}, Disdel Guatemala`;

  return (
    <main className="pdp-container" itemScope itemType="https://schema.org/Product">
    <Helmet>
    <title>{seoTitle}</title>
    <meta name="description" content={seoLongDescription} />
    <meta name="keywords" content={seoKeywords} />
    <link rel="canonical" href={currentUrl} />
    <link rel="preload" as="image" href={mainImg} fetchpriority="high" />

    <meta property="og:title" content={seoTitle} />
    <meta property="og:description" content={seoLongDescription} />
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
    <meta name="twitter:description" content={seoLongDescription} />
    <meta name="twitter:image" content={mainImg} />

    {fullSchema && (
          <script type="application/ld+json">{JSON.stringify(fullSchema)}</script>
        )}
      </Helmet>

      <button className="pdp-back-btn" onClick={() => navigate(-1)} aria-label="Regresar al catálogo">
        <FiChevronLeft /> Volver al catálogo
      </button>

       <article className="pdp-main-grid">
        <section className="pdp-gallery-wrapper" aria-label="Galería de imágenes del producto">
          
          {/* 1. MINIATURAS (Lado izquierdo) */}
          <div className="pdp-thumbnails-vertical">
            {productImages.map((img, index) => (
              <div 
                key={`${product.IdProducto}-${index}`} // 👈 Usar el ID aquí ayuda a React a no confundirse
                className={`pdp-thumb-item ${selectedImage === img ? 'active' : ''}`} 
                onMouseEnter={() => setSelectedImage(img)}
              >
                <img src={getImageUrl(img)} alt={`Vista miniatura ${index + 1} de ${product.Descripcion}`} loading='lazy' />
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
              itemProp="image"
            />
          </div>
        </section>
        
        <section className="pdp-info-section" aria-label="Información comercial del producto">
          <header className="pdp-header-info">
              <div className="pdp-meta-top">
                  {product.Marca && <span className="pdp-brand-tag">{product.Marca}</span>}
                  <span className="pdp-category-badge">{product.Categoria}</span>
              </div>
      
              <h1 className="pdp-title" itemProp="name">{product.Descripcion}</h1>
              <div className="pdp-sku-row">
              <span className="pdp-sku">Código: <strong itemProp="sku">{product.IdProducto}</strong></span>
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
      </article>

      {/* --- SECCIÓN DE ESPECIFICACIONES TÉCNICAS --- */}
      <section className="pdp-specs-section" aria-label="Especificaciones técnicas">
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
        <aside aria-label='Productos relacionados'>
          <RelatedProducts 
          category={product.Categoria} 
          currentProductId={product.IdProducto} 
          />
        </aside>
        )}
    </main>
  );
};

export default ProductDetailPage;