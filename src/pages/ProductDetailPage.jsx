import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast'; 

import { AppConfig } from 'config/AppConfig';
import useCartStore from 'store/useCartStore';
import { useProductDetail } from 'hooks/useProductDetail';

import { 
  FiCheckCircle, FiPackage, FiChevronLeft, FiTarget 
} from 'react-icons/fi';
import './ProductDetailPage.css';
import defaultImage from 'assets/images/categories/KCP.jpg'; 

const ProductDetailPage = () => {
  const { id } = useParams();
  
  const cleanId = id.replace(/\/$/, "").trim().toUpperCase();

  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

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


  const productSchema = useMemo(() => {
    if (!product) return null;
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.Descripcion,
      "image": [getImageUrl(product.Imagen)],
      "description": `Cotiza ${product.Descripcion} en Disdel. Suministros profesionales con entrega en toda Guatemala.`,
      "sku": product.IdProducto,
      "brand": { "@type": "Brand", "name": product.Marca || "Disdel" },
    };
  }, [product]);

  const hasDifferentOptions = useMemo(() => {
    if (!product || !product.Unidad || !product.Empaque) return false;
    return product.Unidad.trim().toLowerCase() !== product.Empaque.trim().toLowerCase();
  }, [product]);

  // --- 3. EFECTOS (Manejo de Carga y Rescate) ---
  useEffect(() => {
    // Si el ID de Google no existe, rescatamos mandando a búsqueda
    if (isError && id) {
        console.warn("Producto no encontrado, redirigiendo a búsqueda...");
        navigate(`/buscar?q=${id}`, { replace: true });
        return;
    }

    if (product) {
        if (!selectedImage) setSelectedImage(product.Imagen);
        
        if (!selectedUnit) {
            setSelectedUnit(product.Unidad || product.Empaque || 'Unidad');
            setSelectedType(product.Unidad ? 'Y' : 'N');
        }
    }
  }, [product, isError, id, navigate, selectedImage, selectedUnit]);

  // --- 4. FUNCIONES DE ACCIÓN ---
  const handleAddToCart = () => {
    addItem({ 
        ...product, 
        presentationSelected: selectedUnit, 
        unitType: selectedType 
    });
    toast.success("Agregado a la cotización");
  };

   useEffect(() => {
    if (isError && id) {
      navigate(`/buscar?q=${id}`, { replace: true });
      return;
    }

    if(product) {
      //Solo cambiamos si no hay una imagen seleccionada actualmente
      if (!selectedImage) setSelectedImage(product.Imagen);

      if (!selectedUnit) {
        setSelectedUnit(product.Unidad || product.Empaque || 'Unidad');
        setSelectedType(product.Unidad ? 'Y' : 'N');
      }
    }
  }, [product, isError, id,navigate,selectedImage, selectedUnit]);


  if (isLoading) return <div className="pdp-loading"><div className="spinner"></div></div>;
  if (isError || !product) return null;

  return (
    <div className="pdp-container">
    <Helmet>
  {/* 1. Básico y SEO de Google */}
  <title>{`${product.Descripcion} | Disdel`}</title>
  <link rel="preload" as="image" href={getImageUrl(selectedImage || product.Imagen)} />
  <meta name="description" content={`Compra ${product.Descripcion} al mejor precio en Disdel. Suministros de limpieza profesional en Guatemala.`} />
 <link rel="canonical" href={`https://www.disdelsa.com/producto/${product.IdProducto}`} />

  {/* 2. Open Graph / Facebook / WhatsApp (Para que se vea la foto al compartir el link) */}
  <meta property="og:type" content="product" />
  <meta property="og:title" content={`${product.Descripcion} | Disdel`} />
  <meta property="og:description" content={`Adquiere ${product.Descripcion} en nuestra tienda en línea. Calidad profesional garantizada.`} />
  <meta property="og:image" content={product.Imagen ? `${AppConfig.baseImageUrl}productos/${product.Imagen}` : 'URL_DE_TU_LOGO_POR_DEFECTO'} />
  <meta property="og:url" content={`https://www.disdelsa.com/producto/${product.IdProducto}`} />
  <meta property="og:site_name" content="Disdel" />

  {/* 3. Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${product.Descripcion} | Disdel`} />
  <meta name="twitter:description" content={`Compra ${product.Descripcion} en Disdel.`} />
  <meta name="twitter:image" content={product.Imagen ? `${AppConfig.baseImageUrl}productos/${product.Imagen}` : 'URL_DE_TU_LOGO_POR_DEFECTO'} />

  {/* 4. Datos Estructurados (Lo que ya tenías, que está muy bien) */}
  {productSchema && (
    <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
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
                    alt={product.Descripcion} 
                    className="pdp-main-img" 
                    fetchpriority="high" // 🔥 Le dice a Chrome: "Baja esta imagen YA"
                    loading="eager" // 🔥 Desactiva el lazy loading solo para esta imagen
                />  
            </div>
            {productImages.length > 1 && (
                <div className="pdp-thumbnails">
                    {productImages.map((img, index) => (
                        <div key={index} className={`pdp-thumb ${selectedImage === img ? 'active' : ''}`} onClick={() => setSelectedImage(img)}>
                            <img src={getImageUrl(img)} alt="thumb" loading='lazy'/>
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