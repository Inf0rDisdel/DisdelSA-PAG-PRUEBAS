import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from 'store/useCartStore';
import { AppConfig } from 'config/AppConfig';
import { FaCheckCircle } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.css';

import { useBanners } from 'hooks/useBanners';

const ProductCard =memo (({ product, index }) => {
  const { IdProducto, Descripcion, Imagen, Marca, Categoria } = product;
  const addItem = useCartStore((state) => state.addItem);
  const {data: bannerData} = useBanners();

  const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i=> i.Titulo?.trim() === "ImagenDefault");
    return found?.BannerImagenMovil ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil}` : '';
  }, [bannerData]);


  const badgeLogo = useMemo(() => {
    const found = bannerData?.Logo?.find(i=> i.Titulo?.trim() === "LogoDisdel");
    return found ? `${AppConfig.baseImageUrl}${found.Imagen}` : '';
  }, [bannerData]);

  const imageUrl = useMemo(() => {
    return (Imagen && Imagen.trim() !== "") 
      ? `${AppConfig.baseImageUrl}productos/${Imagen}` 
      : defaultImage;
  }, [Imagen, defaultImage]);

    const isPriority = index< 4;

  return (
    <article 
      className="product-card"
      itemScope 
      itemType="https://schema.org/Product"
    >

      <meta itemProp="sku" content={IdProducto} />
      <meta itemProp="brand" content={Marca || "Disdel"} />

      <div className="product-brand-badge">
        {badgeLogo && <img src={badgeLogo} alt="Disdel" className="badge-logo-img" />}<img src="disdel-logo.png" alt="Logo" className="badge-logo-img" />
      </div>
      <div className="product-id-badge">ID: {IdProducto}</div>

      <Link 
        to={`/producto/${IdProducto.toLowerCase()}`} 
        className="product-link"
        itemProp="url"
      >
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={Descripcion} 
            className="product-image" 
            loading={isPriority ? "eager" : "lazy"} 
            decoding='async'
            fetchpriority={isPriority ? "high" : "auto"}
            itemProp="image"
          />
        </div>
        
        <div className="product-info-top">
          <span className="brand-tag">{Marca || Categoria || 'Disdel'}</span>
          <h3 className="product-title">{Descripcion}</h3>
          <span className="product-detail-id">Disdel # {IdProducto}</span>
        </div>
      </Link>

      {/* Footer del card con botón de acción */}
      <div 
        className="product-card-footer"
        itemProp="offers" 
        itemScope 
        itemType="https://schema.org/Offer"
      >
        <meta itemProp="priceCurrency" content="GTQ" />
        <meta itemProp="price" content="0.00" />
        <link itemProp="availability" href="https://schema.org/InStock" />

        <div className="sold-by">
          <FaCheckCircle className="checkmark-icon" /> Disponible para cotizar
        </div>

        <button 
          className="quote-button" 
          onClick={(e) => {
            e.preventDefault(); // Evita navegar si haces clic en el botón
            addItem(product);
          }}
        >
          <FiShoppingCart className="cart-icon-btn" /> 
          COTIZAR
        </button>
      </div>
    </article>
  );
});

export default ProductCard;