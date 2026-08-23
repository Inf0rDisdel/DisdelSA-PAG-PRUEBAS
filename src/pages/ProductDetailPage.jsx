import React, { useState, useEffect, useMemo, useCallback, } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 
import './ProductDetailPage.css';
import ProductDetailSkeleton from 'components/ui/Skeleton/ProductDetailSkeleton';

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import useCartStore from 'store/useCartStore';
import { useProductDetail } from 'hooks/useProductDetail';
import { generateProductInsight, generateProductSeoDescription } from 'utils/SEO/productDescriptions';

import { FiCheckCircle, FiChevronRight, FiPackage, FiTarget, FiTruck, FiAward, FiShoppingCart, FiSend, FiShield, FiHeadphones  } from 'react-icons/fi';
import { createSlug } from 'utils/slugify';

import { getProductSchema } from 'utils/schemas/productSchema';
import { optimizedSeoData } from 'utils/SEO/optimizedSeo';
import RelatedProducts from 'components/products/RelatedProducts';

const isValidImage = (imgName) => {
  if (!imgName) return false;
  const cleanName = String(imgName).trim().toLowerCase();
  return cleanName !== "" &&
        cleanName !== "" &&
        cleanName !== "undefined" &&
        cleanName !== "0" &&
        cleanName !== "n/a";
};

const ProductDetailPage = () => {
  const { id, slug } = useParams();
  const rawIdFromUrl = id ? String(id).trim() : "";
  const cleanIdFromUrl = rawIdFromUrl.toLowerCase();
  const { data: product, isLoading, isError} = useProductDetail(cleanIdFromUrl);
  
  const canonicalId = useMemo(() => {
    if (!product) return cleanIdFromUrl;

    return String(product.IdProducto)
        .trim()
        .toLowerCase();

  }, [product, cleanIdFromUrl]);
 
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { data: bannerData } = useBanners();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(''); 
  const [selectedType, setSelectedType] = useState('Y');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  //ESTADO DEL MODAL DEL CATÁLOGO (SIMULADO)
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogStep, setCatalogStep] = useState(1); //1:Formulario, 2:Mensaje SMS, 3: Ingreso al Catalogo
  const [nit, setNit] = useState('');
  const [usuario, setUsuario] = useState('');
  const [codigo, setCodigo] = useState('');

  const professionalInsight = useMemo(() => 
    generateProductInsight(product), 
  [product]);

  const activeSeoInfo = useMemo(() => {
    if (!product) return null;

    // Leemos de forma segura el objeto de metadatos devuelto por la API
    const dbSeo = product.seo || product.Seo;

    const dbDescription = dbSeo && (
      dbSeo.description ||
      dbSeo.descripcion ||
      dbSeo.metaDescription ||
      dbSeo.Descripcion
    );

    // Si la base de datos ya tiene metadatos configurados, los usamos.
    // typePage describe el tipo de documento (por ejemplo, "product"); no es
    // una descripción válida para buscadores ni para el JSON-LD.
    if (dbSeo && (dbSeo.titlePage || dbDescription || dbSeo.keywords || dbSeo.Tags || dbSeo.tags)) {
      return {
        title: dbSeo.titlePage || "",
        description: dbDescription || "",
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
  const currentUrl = useMemo(() => (
    `https://disdelsa.com/producto/${canonicalId}/${currentSlug}`
), [canonicalId, currentSlug]);

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

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    return found ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil || found.Imagen}` : '';
  }, [bannerData]);

  // 4. GENERACIÓN DEL SCHEMA
  const productImages = useMemo(() => {
      if (!product) return [];
      
      const galleryImages = Array.isArray(product.Imagenes)
        ? product.Imagenes
            .map((img) => typeof img === 'string' ? img : img?.Imagen)
            .filter(isValidImage)
        : [];

      // La fotografía principal siempre ocupa la primera posición. Así el
      // HTML visible, Open Graph y Product.image envían la misma señal.
      return [...new Set([
        ...(isValidImage(product.Imagen) ? [product.Imagen] : []),
        ...galleryImages
      ])];
  }, [product]);

  const fullSchema = useMemo(() => {
    if (!product) return null;

    const legacyFormat = {
      t: seoTitle,
      d: seoLongDescription,
      k: seoKeywords
    };

    return getProductSchema(product, currentUrl, productImages, legacyFormat, defaultImage);
  }, [product, currentUrl, productImages, seoTitle, seoLongDescription, seoKeywords, defaultImage]);

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

  const getImageUrl = useCallback((imgName) => {
    return isValidImage(imgName)
      ? `${AppConfig.baseImageUrl}productos/${imgName}`
      : defaultImage;
  }, [defaultImage]);

  const hasDifferentOptions = useMemo(() => {
    if (!product || !product.Unidad || !product.Empaque) return false;
    return product.Unidad.trim().toLowerCase() !== product.Empaque.trim().toLowerCase();
  }, [product]);

  useEffect(() => {
    if (product) {
      // 🚀 Inicializamos solo si la imagen principal es válida
      setSelectedImage(isValidImage(product.Imagen) ? product.Imagen : null);

      const initialUnit = product.Unidad || product.Empaque || 'Unidad';
      setSelectedUnit(initialUnit);
      setSelectedType(product.Unidad ? 'Y' : 'N');
      window.scrollTo(0, 0);
    }
  }, [product]);

  useEffect(() => {

  if (!product) return;

  const correctSlug = createSlug(product.Descripcion);
  const correctId = String(product.IdProducto)
    .trim()
    .toLowerCase();

    if (
      slug !== correctSlug ||
      rawIdFromUrl !== correctId
    ) {
      navigate(
        `/producto/${correctId}/${correctSlug}`,
        { replace: true }
      );
    }

  }, [
    product,
    slug,
    rawIdFromUrl,
    navigate
  ]);
 
  // if (isLoading) return <div>Cargando Producto...</div>;
  // if (isError || !product) return <div>Error al cargar producto</div>;

  if (isLoading) {
  return <ProductDetailSkeleton />;
  }

  if (isError || !product || !product.IdProducto) {
    return (
      <div
        className="pdp-container"
        style={{
          textAlign: "center",
          padding: "100px"
        }}
      >
        <Helmet>
          <meta name="robots" content="noindex,nofollow" />
          <title>Producto no disponible | Disdel</title>
        </Helmet>

        <h2>Producto no disponible actualmente</h2>

        <button
          className="pdp-back-btn"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>

      </div>
    );
  }

  const mainImg = getImageUrl(selectedImage || product.Imagen);
  // const seoKeywords = legacySeoInfo?.keywords || `${product.Categoria}, ${product.Marca}, Disdel Guatemala`;

  return (
    <main className="pdp-container">
    <Helmet>
    <title>{seoTitle}</title>
    <meta name="description" content={seoLongDescription} />
    <meta name="keywords" content={seoKeywords} />
    <link rel="canonical" href={currentUrl} />
    <link rel="preload" as="image" href={mainImg} />

    <meta property="og:title" content={seoTitle} />
    <meta property="og:description" content={seoLongDescription} />
    <meta property="og:image" content={mainImg} />
    <meta property="og:image:alt" content={product.Descripcion} />
    <meta property="og:url" content={currentUrl} />
    <meta property="og:type" content="product" />
    <meta property="product:category" content={product.Categoria}/>
    <meta property="product:brand" content={product.Marca || "Disdel"} />
    <meta property="og:site_name" content="Disdel" />

    <meta property="og:image:secure_url" content={mainImg} />

    <meta property="product:condition" content="new" />
    <meta property="product:availability" content="in stock" />
    <meta property="product:brand" content={product.Marca || "Disdel"} />

    <meta name="robots" content="index,follow"/>

    {/* --- 3. TWITTER CARD --- */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seoTitle} />
    <meta name="twitter:description" content={seoLongDescription} />
    <meta name="twitter:image" content={mainImg} />
    <meta name="twitter:image:alt" content={product.Descripcion} />

    <meta name="theme-color" content="#135eab" />

    {fullSchema && (
          <script type="application/ld+json">{JSON.stringify(fullSchema)}</script>
        )}
      </Helmet>

      <div className="pdp-top-nav">
        <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Inicio</Link> <FiChevronRight size={12} />
          <Link
            to={`/categoria/${createSlug(product.Segmento || product.Categoria)}`}
          >
            {product.Segmento || product.Categoria}
          </Link><FiChevronRight size={12} />
          {product.Categoria && (
            <>
              <Link
              to={`/categoria/${createSlug(product.Segmento || product.Categoria)}/${createSlug(product.Categoria)}`}
            >
              {product.Categoria}
            </Link> <FiChevronRight size={12} />
            </>
           )}
          <span className="pdp-current-breadcrumb">{product.Descripcion}</span>
        </nav>
      </div>

      <article className="pdp-main-grid">
        <section className="pdp-gallery-wrapper" aria-label="Galería de imágenes del producto">
          
          {/* 1. MINIATURAS (Lado izquierdo) */}
          {productImages.length > 0 && (
            <div className="pdp-thumbnails-vertical">
              {productImages.map((img, index) => (
                <div 
                  key={`${product.IdProducto}-${index}`} 
                  className={`pdp-thumb-item ${selectedImage === img ? 'active' : ''}`} 
                  onMouseEnter={() => setSelectedImage(img)}
                >
                  <img 
                    src={getImageUrl(img)} 
                    alt={`Vista miniatura ${index + 1} de ${product.Descripcion}`} 
                    width="96"
                    height="96"
                    loading='lazy' 
                    decoding="async"
                    fetchPriority="low"
                    // 🚀 AGREGA ESTE BLOQUE AQUÍ TAMBIÉN:
                    onError={(e) => {
                      e.target.onerror = null; // Previene bucles infinitos de recarga
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
              ))}
            </div>
          )}

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
              loading="eager"
              decoding="async"
              fetchPriority="high" // 🚀 Prioridad máxima para la imagen del producto

              onError={(e) =>{
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
          </div>
        </section>
        
        <section className="pdp-info-section" aria-label="Información comercial del producto">
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
              <div className='pdp-action-buttons-row'>

                {/* ----- BOTON DE "AGREGAR A CATALOGO ---  DESCOMENTAR CUANDO YA ESTE LISTO" -----*/}

                {/* <button className='pdp-catalog-btn' onClick={handleOpenCatalogModal}>
                  <FiFolder className='pdp-btn-icon' /> AGREGAR A CATÁLOGO
                </button> */}

                
                <button className='pdp-catalog-btn-new' onClick={handleAddToCart}>
                  <FiShoppingCart className='pdp-btn-icon' /> AGREGAR A COTIZACIÓN
                </button>
              </div>
              <p className='pdp-action-note'>La unidad seleccionada aparecerá en su solicitud.</p>
          </div>
        </section>
      </article>

      {/* SECCIÓN DE BARRAS DE VALOR U GARANTÍA */}
      <section className='pdp-trust-badges-bar' aria-label='Garantías y sevicios de Disdel'>
        <div className='pdp-trust-item'>
          <div className='pdp-trust-icon-box'>
            <FiShield className='pdp-trust-icon' />
          </div>
          <div className='pdp-trust-text'>
            <h4>Calidad Garantizada</h4>
            <p>Productos originales con respaldo de fábrica.</p>
          </div>
        </div>

        <div className='pdp-trust-item'>
          <div className='pdp-trust-icon-box'>
            <FiTruck className='pdp-trust-icon' />
          </div>
          <div className='pdp-trust-text'>
            <h4>Entrega Rápida</h4>
            <p>Cobertura en toda Guatemala con entregas en 24 a 48 horas.</p>
          </div>
        </div>

        <div className='pdp-trust-item'>
          <div className='pdp-trust-icon-box'>
            <FiHeadphones className='pdp-trust-icon' />
          </div>
          <div className='pdp-trust-text'>
            <h4>Asesoría Técnica</h4>
            <p>Nuestro equipo le ayuda a elegir la mejor solución.</p>
          </div>
        </div>

        <div className='pdp-trust-item'>
          <div className='pdp-trust-icon-box'>
            <FiAward className='pdp-trust-icon' />
          </div>
          <div className='pdp-trust-text'>
            <h4>Precios Competitivos</h4>
            <p>Cotizaciónes especiales para compras por volumen.</p>
          </div>
        </div>
      </section>

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
        {showCatalogModal && (
        <div className="pdp-modal-overlay" onClick={() => setShowCatalogModal(false)}>
          <div className="pdp-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="pdp-modal-close" 
              onClick={() => setShowCatalogModal(false)} 
              aria-label="Cerrar modal"
            >
              &times;
            </button>
            
            {/* 🚀 PASO 1: Formulario NIT y Usuario */}
            {catalogStep === 1 && (
              <div className="pdp-modal-step">
                <h3 className="pdp-modal-title">Agregar a Catálogo</h3>
                <p className="pdp-modal-subtitle">Vincula este artículo a tu catálogo completando los siguientes campos.</p>
                
                <div className="pdp-form-group">
                  <label htmlFor="pdp-nit">NIT:</label>
                  <input 
                    id="pdp-nit"
                    type="text" 
                    placeholder="Escribe tu NIT" 
                    value={nit}
                    onChange={(e) => setNit(e.target.value)}
                  />
                </div>
                
                <div className="pdp-form-group">
                  <label htmlFor="pdp-user">Usuario:</label>
                  <input 
                    id="pdp-user"
                    type="text" 
                    placeholder="Escribe tu Usuario" 
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>
                
                <button 
                  className="pdp-modal-btn" 
                  onClick={() => setCatalogStep(2)}
                >
                  <FiSend /> Enviar datos
                </button>
              </div>
            )}

            {/* 🚀 PASO 2: Confirmación de envío de SMS + Validación del código en la misma vista */}
            {catalogStep === 2 && (
              <div className="pdp-modal-step text-center">
                <div className="pdp-success-icon-wrapper animate-pop">
                  <FiCheckCircle size={56} className="pdp-success-check-icon" />
                </div>
                
                <h3 className="pdp-modal-title-success">¡Datos Enviados!</h3>
                
                <p className="pdp-success-msg">
                  Se ha enviado un código de validación por mensaje de texto (SMS) al número registrado terminado en <strong>*****150</strong>.
                </p>
                
                <p className="pdp-validation-instruction">
                  Ingresa el código a continuación para autorizar la compra y guardarlo en tu catálogo:
                </p>

                <div className="pdp-form-group">
                  <label htmlFor="pdp-code">Código de Validación:</label>
                  <input 
                    id="pdp-code"
                    type="text" 
                    placeholder="Introduce el código de 6 dígitos" 
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>
                
                <button 
                  className="pdp-modal-btn pdp-confirm-btn" 
                  onClick={() => {
                    alert(`Simulación exitosa.\nNIT: ${nit}\nUsuario: ${usuario}\nCódigo: ${codigo}\nProducto guardado en tu catálogo.`);
                    setShowCatalogModal(false);
                    setCatalogStep(1);
                    setNit('');
                    setUsuario('');
                    setCodigo('');
                  }}
                >
                  Confirmar Código
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetailPage;
