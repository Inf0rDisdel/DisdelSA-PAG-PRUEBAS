import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import useCartStore from 'store/useCartStore';
import { useProductDetail } from 'hooks/useProductDetail';

import { 
  FiCheckCircle, FiPackage, FiChevronLeft, FiTarget, FiInfo
} from 'react-icons/fi';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { data: bannerData } = useBanners();
 
  const cleanId = id ? id.replace(/\/$/, "").trim().toUpperCase() : "";
  const canonicalId = id ? id.replace(/\/$/, "").trim().toLowerCase() : "";

   // Hook personalizado para traer datos
  const { data: product, isLoading, isError } = useProductDetail(cleanId);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(''); 
  const [selectedType, setSelectedType] = useState('Y');

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault");
    const fileName = found?.BannerImagenMovil || found?.Imagen;
    return fileName ? `${AppConfig.baseImageUrl}${fileName}` : '';
  }, [bannerData]);

  const getImageUrl = (imgName) => (imgName && imgName.trim() !== "") 
    ? `${AppConfig.baseImageUrl}productos/${imgName}` 
    : defaultImage;

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
    const fullUrl = `https://www.disdelsa.com/producto/${canonicalId}`;
    const brandName = product.Marca || "Disdel";

    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": `${fullUrl}#product`,
      "name": product.Descripcion,
      "image": productImages.map(img => getImageUrl(img)),
      "description": `Solicite cotización de ${product.Descripcion} en Guatemala. Suministro profesional para empresas y oficinas.`,
      "sku": product.IdProducto,
      "mpn": product.IdProducto,
      "brand": { 
        "@type": "Brand", 
        "name": brandName 
      },
      "offers": {
        "@type": "Offer",
        "url": fullUrl,
        "priceCurrency": "GTQ",
        "price": "0.00", // Al ser cotización, mantenemos 0.00 pero con estructura válida
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "priceValidUntil": "2026-12-31",
        "seller": {
          "@type": "Organization", // "Organization" es más aceptado por Google que WholesaleStore
          "name": "Disdel, S.A.",
          "url": "https://disdelsa.com/"
        }
      }
    };
  }, [product, canonicalId, productImages, defaultImage]);

  useEffect(() => {
    if (id && id !== id.toLowerCase()) {
      navigate(`/producto/${id.toLowerCase()}`, { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isError && cleanId) {
        navigate(`/buscar?q=${cleanId}`, { replace: true });
    }
  }, [isError, cleanId, navigate]);

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

  if (isLoading) return <div className="pdp-loading"><div className="spinner"></div><p>Cargando producto...</p></div>;
  if (isError || !product) return (
    <div className="pdp-container" style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p>Redirigiendo a búsqueda...</p>
    </div>
  );

  const seoTitle = `${product.Descripcion} ${product.Marca ? '| ' + product.Marca : ''} | Disdel Guatemala`;
  const mainImg = getImageUrl(selectedImage || product.Imagen);
  const currentUrl = `https://disdelsa.com/producto/${canonicalId}`;

  return (
    <div className="pdp-container">
    <Helmet>
    {/* --- 1. SEO DE BÚSQUEDA Y GOOGLE --- */}
    <title>{seoTitle}</title>
    <meta name="description" content={`Solicite cotización de ${product.Descripcion} en Guatemala. Suministro profesional para empresas, oficinas y sector hostelero. Producto garantizado de la línea ${product.Categoria}. Calidad y respaldo institucional por Disdel, S.A.`} />
    <link rel="canonical" href={currentUrl} />
    
    {/* Precarga de imagen crítica para mejorar el LCP (Core Web Vitals) */}
    <link rel="preload" as="image" href={mainImg} />

    {/* --- 2. OPEN GRAPH (Facebook, WhatsApp, LinkedIn) --- */}
    <meta property="og:title" content={seoTitle} />
    <meta property="og:description" content={`Distribución líder de ${product.Descripcion} en Guatemala. ¡Cotiza ahora para tu empresa con Disdelsa!`} />
    <meta property="og:image" content={mainImg} />
    <meta property="og:url" content={`https://www.disdelsa.com/producto/${canonicalId}`} />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="Disdel" />

    <meta property="og:image:secure_url" content={mainImg} />

    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <meta property="product:condition" content="new" />
    <meta property="product:price:amount" content="0.00" />
    <meta property="product:price:currency" content="GTQ" />
    <meta property="product:availability" content="instock" />
    <meta property="product:brand" content={product.Marca || "Disdel"} />

    {/* --- 3. TWITTER CARD --- */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seoTitle} />
    <meta name="twitter:description" content={`Compra ${product.Descripcion} en Disdel. Suministros industriales y de limpieza profesional.`} />
    <meta name="twitter:image" content={mainImg} />

    {fullSchema && (
          <script type="application/ld+json">
            {JSON.stringify(fullSchema)}
          </script>
        )}
      </Helmet>

      <button className="pdp-back-btn" onClick={() => navigate(-1)} aria-label="Regresar al catálogo">
        <FiChevronLeft /> Volver al catálogo
      </button>

      <div className="pdp-main-grid">
        <section className="pdp-gallery-section">
            <div className="pdp-main-image-wrapper">
              <img 
                    src={mainImg} 
                    alt={`${product.Descripcion} - Suministro Institucional Guatemala`} 
                    className="pdp-main-img" 
                    width="600" height="600"
                    fetchpriority="high" 
                    loading="eager"
                />  
            </div>
            {productImages.length > 1 && (
                <div className="pdp-thumbnails">
                    {productImages.map((img, index) => (
                        <button 
                          key={index} 
                          className={`pdp-thumb ${selectedImage === img ? 'active' : ''}`} 
                          onClick={() => setSelectedImage(img)}
                          aria-label={`Ver imagen ${index + 1}`}
                        >
                            <img src={getImageUrl(img)} alt={`Vista ${index + 1}`} loading="lazy" width="80" height="80" />
                        </button>
                    ))}
                </div>
            )}
        </section>
        
        <section className="pdp-info-section">
          <header className="pdp-header-info">
              <div className="pdp-meta-top">
                  {/* Badge de Marca: Estilo sutil */}
                  {product.Marca && <span className="pdp-brand-tag">{product.Marca}</span>}
                  {/* Badge de Área/Categoría: Azul Disdel (PRO) */}
                  <span className="pdp-category-badge">{product.Categoria}</span>
              </div>
      
              <h1 className="pdp-title">{product.Descripcion}</h1>
              <div className="pdp-sku-row">
              <span className="pdp-sku">Código: <strong>{product.IdProducto}</strong></span>
              {/* Estado de disponibilidad: Verde (PRO) */}
              <span className="pdp-stock-status in-stock">
                <FiCheckCircle className="pdp-check-icon" /> Disponible 
              </span>
            </div>
          </header>

          <div className="pdp-commercial-desc">
            <p>
              <FiInfo /> <strong>Solución Institucional:</strong> En Disdel nos especializamos en el abastecimiento técnico de <strong>{product.Descripcion}</strong> para el sector empresarial. Este artículo de la línea <strong>{product.Categoria}</strong> ha sido seleccionado bajo rigurosos estándares para garantizar la máxima eficiencia y rendimiento en las operaciones de su institución o negocio en toda Guatemala.
            </p>
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