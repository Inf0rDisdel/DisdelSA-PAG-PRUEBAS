import React, { useMemo } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useCartStore from 'store/useCartStore';
import { AppConfig } from 'config/AppConfig';
import { createSlug } from 'utils/slugify';
import './CarItem.css';
import { useBanners } from 'hooks/useBanners';

const CartItem = ({ product }) => {

  const {data:bannerData} = useBanners ();

 const defaultImage = useMemo(() => {
    const found = bannerData?.ImagenPredeterminado?.find(i => i.Titulo?.trim() === "ImagenDefault");
    const fileName = found?.BannerImagenMovil;
    return fileName ? `${AppConfig.baseImageUrl}${fileName}` : '';
  }, [bannerData]);

  const { removeFromCart, updateQuantity } = useCartStore();
  const quantity = product.quantity || 1;
  const productUrl = `/producto/${String(product.IdProducto).trim().toLowerCase()}/${createSlug(product.Descripcion)}`;

  return (
    <div className="cart-item-wrapper">
      <Link
        to={productUrl}
        className="item-image-container item-image-link"
        aria-label={`Ver detalle de ${product.Descripcion}`}
        title={`Ver detalle de ${product.Descripcion}`}
      >
        <img
          src={product.Imagen ? `${AppConfig.baseImageUrl}productos/${product.Imagen}` : defaultImage}
          alt={product.Descripcion}
          className="item-image"
          width="160"
          height="160"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          // Evitamos que la imagen se vea estirada
          style={{ objectFit: 'contain' }}
        />
      </Link>

      <div className="item-info">
        <span className="info-label">Producto</span>
        <p className="item-name">{product.Descripcion}</p>
        <span className="item-id">Cód: {product.IdProducto}</span>
      </div>

      {/* 🔥 Muestra la presentación guardada (Imagen 1) */}
      <div className="item-info">
        <span className="info-label">Presentación Solicitada</span>
        <p className="item-packaging" style={{ color: '#135eab', fontWeight: 'bold' }}>
          {product.presentationSelected || 'Unidad'}
        </p>
      </div>


      <div className="quantity-control">
        <button type="button" className="quantity-btn" aria-label={`Reducir cantidad de ${product.Descripcion}`} disabled={quantity <= 1} onClick={() => updateQuantity(product.IdProducto, product.unitType, -1)}>
          <FiMinus aria-hidden="true" />
        </button>
        <span className="quantity-display" aria-live="polite" aria-label={`Cantidad: ${quantity}`}>{quantity}</span>
        <button type="button" className="quantity-btn" aria-label={`Aumentar cantidad de ${product.Descripcion}`} onClick={() => updateQuantity(product.IdProducto, product.unitType, 1)}>
          <FiPlus aria-hidden="true" />
        </button>
      </div>

      <button type="button" className="delete-btn" aria-label={`Eliminar ${product.Descripcion} de la cotización`} onClick={() => removeFromCart(product.IdProducto, product.unitType)}>
        <FiTrash2 size={18} aria-hidden="true" />
      </button>
    </div>
  );
};

export default CartItem;
