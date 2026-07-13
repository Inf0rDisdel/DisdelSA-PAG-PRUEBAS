import React, { memo, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from 'store/useCartStore';
import { AppConfig } from 'config/AppConfig';
import { FiShoppingCart } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import { useBanners } from 'hooks/useBanners';
import { createSlug } from 'utils/slugify';
import './ProductCard.css';

const ProductCard = memo(({ product, index }) => {
  const { IdProducto, Descripcion, Imagen, Marca, Categoria } = product;
  const addItem = useCartStore((state) => state.addItem);
  const { data: bannerData } = useBanners();
  const queryClient = useQueryClient();
  const prefetchTimerRef = useRef(null); 
  

  const handleMouseEnter = () => {
    prefetchTimerRef.current = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['product', IdProducto.trim().toUpperCase()],
        staleTime: 1000 * 60 * 5,
      });
    }, 80);
  };

  const handleMouseLeave = () => {
    if (prefetchTimerRef.current) clearTimeout(prefetchTimerRef.current);
  };

  const imageUrl = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    const defaultImg = found?.BannerImagenMovil || found?.Imagen ? `${AppConfig.baseImageUrl}${found.BannerImagenMovil || found.Imagen}` : '';
    return (Imagen && Imagen.trim() !== "") 
      ? `${AppConfig.baseImageUrl}productos/${Imagen}` 
      : defaultImg;
  }, [Imagen, bannerData]);

  const badgeLogo = useMemo(() => {
    const found = bannerData?.Iconos?.find(i => i.Titulo?.trim() === "IconoDisdel");
    return found ? `${AppConfig.baseImageUrl}${found.Imagen}` : '';
  }, [bannerData]);

  const isPriority = index < 4;
  const productUrl = `/producto/${String(IdProducto).trim().toLowerCase()}/${createSlug(Descripcion)}`;

  return (
    <article 
      className="product-card"
      itemScope itemType="https://schema.org/Product"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <meta itemProp="sku" content={IdProducto} />
      <meta itemProp="brand" content={Marca || "Disdel"} />

      <div className="product-brand-badge">
        {badgeLogo && (
          <img 
            src={badgeLogo} 
            alt="Disdel" 
            className="badge-logo-img" 
            loading="lazy" 
            decoding="async" 
            width="50" 
            height="16" 
          />
        )}
      </div>
      <div className="product-id-badge">ID: {IdProducto}</div>

      <Link 
        to={productUrl}
        className="product-link"
        itemProp="url"
        title={`Ver detalle de ${Descripcion}`}
      >
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={Descripcion} 
            className="product-image" 
            width="200" height="200" // 🚀 Evita saltos de diseño (CLS)
            loading={isPriority ? "eager" : "lazy"} 
            decoding='async'
            fetchpriority={isPriority ? "high" : "auto"}
            itemProp="image"
          />
        </div>
        
        <div className="product-info-top">
          <span className="brand-tag">{Marca || Categoria || 'Disdel'}</span>
          <h3 className="product-title" itemProp="name">{Descripcion}</h3>
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

        <button 
          className="quote-button" 
          onClick={(e) => {
            e.preventDefault();
            const defaultPresentation = product.Unidad || product.Empaque || 'Unidad';
            addItem({ ...product, presentationSelected: defaultPresentation, unitType: product.Unidad ? 'Y' : 'N' });
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