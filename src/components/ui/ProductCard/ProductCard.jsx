import React, { memo, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import useCartStore from 'store/useCartStore';
import { useBanners } from 'hooks/useBanners';
import { fetchProductDetail } from 'hooks/useProductDetail';
import { createSlug } from 'utils/slugify';
import { getDisdelImageUrl } from 'utils/imageUrl';
import OptimizedImage from 'components/ui/OptimizedImage/OptimizedImage';
import './ProductCard.css';

const ProductCard = memo(({ product, index, priority }) => {
  const { IdProducto, Descripcion, Imagen, Marca, Categoria } = product;
  const addItem = useCartStore((state) => state.addItem);
  const { data: bannerData } = useBanners();
  const queryClient = useQueryClient();
  const prefetchTimerRef = useRef(null); 
  
  const handleMouseEnter = () => {
        prefetchTimerRef.current = setTimeout(() => {
        const id = String(IdProducto).trim();
        queryClient.prefetchQuery({
        queryKey: ['producto-detalle', id],
        queryFn: () => fetchProductDetail(id),
        staleTime: 1000 * 60 * 30
      });
    }, 80);

  };

  const handleMouseLeave = () => {
    if (prefetchTimerRef.current) clearTimeout(prefetchTimerRef.current);
  };

  useEffect(() => {
    return () => {
        if (prefetchTimerRef.current) {
            clearTimeout(prefetchTimerRef.current);
        }
    };
  }, []);

  const imageUrl = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault3");
    const defaultImg = getDisdelImageUrl(found?.BannerImagenMovil || found?.Imagen);
    return getDisdelImageUrl(Imagen, 'productos') || defaultImg;
  }, [Imagen, bannerData]);

  const badgeLogo = useMemo(() => {
    const found = bannerData?.Iconos?.find(i => i.Titulo?.trim() === "IconoDisdel");
    return getDisdelImageUrl(found?.Imagen);
  }, [bannerData]);

  const isPriority = priority ?? index < 4;
  const productUrl = `/producto/${String(IdProducto).trim().toLowerCase()}/${createSlug(Descripcion)}`;

  return (
    <article 
      className="product-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <div className="product-brand-badge">
        {badgeLogo && (
          <OptimizedImage
            src={badgeLogo} 
            alt="" aria-hidden="true"
            className="badge-logo-img" 
            widths={[32, 48, 64]}
            targetWidth={48}
            quality={80}
            sizes="24px"
            loading="lazy" 
            decoding="async" 
            fetchPriority="low"
            width="24"
            height="24"
          />
        )}
      </div>
      <div className="product-id-badge">ID: {IdProducto}</div>

      <Link 
        to={productUrl}
        className="product-link"
        title={`Ver detalle de ${Descripcion}`}
      >
        <div className="product-image-container">
          <OptimizedImage
            src={imageUrl} 
            alt={Descripcion} 
            className="product-image" 
            widths={[160, 240, 320]}
            targetWidth={240}
            quality={78}
            sizes="(min-width: 1025px) 150px, (min-width: 481px) 120px, 130px"
            width="200" height="200" // 🚀 Evita saltos de diseño (CLS)
            loading={isPriority ? "eager" : "lazy"} 
            decoding='async'
            fetchPriority={isPriority ? "high" : "low"}
          />
        </div>
        
        <div className="product-info-top">
          <span className="brand-tag">{Marca || Categoria || 'Disdel'}</span>
          <h3 className="product-title">{Descripcion}</h3>
          <span className="product-detail-id">Disdel # {IdProducto}</span>
        </div>
      </Link>

      {/* Footer del card con botón de acción */}
      <div className="product-card-footer">
        <button 
          className="quote-button" 
          aria-label={`Agregar ${Descripcion} a mi lista de cotización`}
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
