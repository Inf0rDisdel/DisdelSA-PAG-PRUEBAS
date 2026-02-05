import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { AppConfig } from 'config/AppConfig';
import useCartStore from 'store/useCartStore';
import { useProductDetail } from 'hooks/useProductDetail';

import { 
  FiCheckCircle, FiShield, FiCreditCard, 
  FiPackage, FiLayers, FiChevronLeft, FiBox, FiTarget 
} from 'react-icons/fi';
import './ProductDetailPage.css';
import defaultImage from 'assets/images/categories/KCP.jpg'; 

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading, isError } = useProductDetail(id);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(''); 
  const [selectedType, setSelectedType] = useState('Y');

  // --- 1. HELPERS PRIMERO ---
  const getImageUrl = (imgName) => imgName ? `${AppConfig.baseImageUrl}productos/${imgName}` : defaultImage;

  // --- 2. HOOKS DE LÓGICA (SIEMPRE ARRIBA) ---
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

  // Schema para Google
  const productSchema = useMemo(() => {
    if (!product) return null;
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.Descripcion,
      "image": [getImageUrl(product.Imagen)],
      "description": `Comprar ${product.Descripcion} en Disdel. Suministros de limpieza profesional.`,
      "sku": product.IdProducto,
      "brand": { "@type": "Brand", "name": product.Marca || "Disdel" },
      "offers": {
        "@type": "Offer",
        "url": `https://www.disdelsa.com/producto/${product.IdProducto}`,
        "priceCurrency": "GTQ",
        "availability": "https://schema.org/InStock"
      }
    };
  }, [product]);

  // --- 3. EFECTOS ---
  useEffect(() => {
    if (isError && id) {
        console.warn("Producto no encontrado, redirigiendo a búsqueda...");
        navigate(`/buscar?q=${id}`, { replace: true });
        return;
    }

    if (product) {
        if (productImages.length > 0) setSelectedImage(productImages[0]);
        if (product.Unidad) {
            setSelectedUnit(product.Unidad);
            setSelectedType('Y');
        } else if (product.Empaque) {
            setSelectedUnit(product.Empaque);
            setSelectedType('N');
        }
    }
  }, [product, productImages, isError, id, navigate]);

  const handleAddToCart = () => {
    addItem({ ...product, presentationSelected: selectedUnit, unitType: selectedType });
  };

  // --- 4. RETURNOS CONDICIONALES (DESPUÉS DE LOS HOOKS) ---
  if (isLoading) return <div className="pdp-loading"><div className="spinner"></div></div>;
  if (isError || !product) return null;

  return (
    <div className="pdp-container">
      <Helmet>
        <title>{`${product.Descripcion} | Disdel`}</title>
        <link rel="canonical" href={`https://www.disdelsa.com/producto/${product.IdProducto}`} />
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
                <img src={getImageUrl(selectedImage || product.Imagen)} alt={product.Descripcion} className="pdp-main-img" />
            </div>
            {productImages.length > 1 && (
                <div className="pdp-thumbnails">
                    {productImages.map((img, index) => (
                        <div key={index} className={`pdp-thumb ${selectedImage === img ? 'active' : ''}`} onClick={() => setSelectedImage(img)}>
                            <img src={getImageUrl(img)} alt="thumb" />
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
                      <button className={`unit-opt ${selectedType === 'Y' ? 'active' : ''}`} onClick={() => {setSelectedUnit(product.Unidad); setSelectedType('Y')}}>
                          <FiTarget className="icon" />
                          <div className="unit-info">
                              <span className="unit-title">Por Unidad</span>
                              <span className="unit-desc">{product.Unidad}</span>
                          </div>
                      </button>
                      <button className={`unit-opt ${selectedType === 'N' ? 'active' : ''}`} onClick={() => {setSelectedUnit(product.Empaque); setSelectedType('N')}}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;