import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 

import { AppConfig } from 'config/AppConfig';
import { useBanners } from 'hooks/useBanners';
import useCartStore from 'store/useCartStore';
import { useProductDetail } from 'hooks/useProductDetail';

import { FiCheckCircle, FiPackage, FiChevronLeft, FiTarget} from 'react-icons/fi';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id, slug } = useParams();
  const cleanId = id?.toString().split('-')[0];
  const canonicalId = id ? String(id).replace(/\/$/, "").trim().toLowerCase() : "";
 
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { data: bannerData } = useBanners();
 
  const { data: product, isLoading, isError } = useProductDetail(cleanId);

  console.log("ID URL:", id);
  console.log("ID limpio:", cleanId);
  console.log("Producto:", product);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(''); 
  const [selectedType, setSelectedType] = useState('Y');

  const createSlug = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '') // Quita caracteres especiales excepto guiones y espacios
    .replace(/\s+/g, '-') // Espacios por guiones
    .replace(/-+/g, '-'); // Quita guiones dobles
};

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    const fileName = found?.BannerImagenMovil || found?.Imagen;
    return fileName ? `${AppConfig.baseImageUrl}${fileName}` : '';
  }, [bannerData]);

  // Envolvemos en useCallback para quitar el Warning de la terminal
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
    const slugName = createSlug(product.Descripcion);
    const productUrl = `https://disdelsa.com/producto/${canonicalId}/${slugName}`;
    const categoryUrl = `https://disdelsa.com/categoria/${createSlug(product.Categoria)}`;

    return {
      "@context": "https://schema.org/",
      "@graph": [
       {
        "@type": "Product",
        "name": product.Descripcion,

        // ✅ CAMBIO: image como array
        "image": productImages.length > 0
          ? productImages.map(img => getImageUrl(img))
          : [getImageUrl(product.Imagen)],

        "description": `Cotiza ${product.Descripcion} en Disdel Guatemala. Ideal para ${product.Categoria}. Calidad institucional.`,

        "sku": product.IdProducto,

        // ✅ NUEVO
        "url": productUrl,

        // ✅ NUEVO
        "category": product.Categoria,

        "brand": {
          "@type": "Brand",
          "name": product.Marca || "Disdel"
        },

        "offers": {
          "@type": "Offer",
          "url": productUrl,
          "priceCurrency": "GTQ",
          "price": "0.00",

          // ✅ NUEVO
          "itemCondition": "https://schema.org/NewCondition",

          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Disdel, S.A."
          }
        }
      },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://disdelsa.com/" },
            { "@type": "ListItem", "position": 2, "name": product.Categoria, "item": categoryUrl },
            { "@type": "ListItem", "position": 3, "name": product.Descripcion, "item": productUrl }
          ]
        }
      ]
    };
  }, [product, canonicalId, createSlug, getImageUrl, productImages]);

useEffect(() => {
  if (product) {
    const correctSlug = createSlug(product.Descripcion);
    const correctId = String(cleanId).toLowerCase();

    // Verificamos si ALGO en la URL actual está mal (ya sea el ID o el SLUG)
    if (slug !== correctSlug || id !== correctId) {
      // Hacemos una única redirección con ambos valores corregidos
      navigate(`/producto/${correctId}/${correctSlug}`, { replace: true });
    }
  }
}, [product, slug, id, cleanId, navigate, createSlug]);

 useEffect(() => {
  if (isError) {
    console.error("Error cargando producto:", cleanId);
  }
}, [isError, cleanId]);

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
        <p>Buscando producto...</p>
    </div>
  );

  const seoTitle = `${product.Descripcion} ${product.Marca ? '| ' + product.Marca : ''} | Disdel Guatemala`;
  const mainImg = getImageUrl(selectedImage || product.Imagen);
  const currentSlug = createSlug(product.Descripcion);
  const currentUrl = `https://disdelsa.com/producto/${canonicalId}/${currentSlug}`;

  return (
    <div className="pdp-container">
    <Helmet>
    <title>{seoTitle}</title>
    <meta name="description" content={`Solicite cotización de ${product.Descripcion} en Guatemala. Suministro profesional para empresas. Categoría ${product.Categoria}.`} />
    <link rel="canonical" href={`https://disdelsa.com/producto/${id}/${createSlug(product.Descripcion)}`} />
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
              alt={`${product.Descripcion} - Suministro Institucional`} 
              className="pdp-main-img" 
              width="600" 
              height="600"
              fetchPriority="high" // Corregido a camelCase para React
              loading="eager"
              decoding="sync" 
              style={{ aspectRatio: '1/1', objectFit: 'contain' }}
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
              <FiTarget /> <strong>Venta Institucional:</strong> Abastecimiento profesional de {product.Descripcion} para empresas en toda Guatemala.
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